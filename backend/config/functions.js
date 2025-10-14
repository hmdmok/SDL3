const XLSX = require("sheetjs-style");
const fs = require("fs");
const archiver = require("archiver");
const dossier = require("../models/dossierModel");
const person = require("../models/personModel");
const system = require("../models/systemModel");

function validateHeader(file, expectedHeader) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = (event) => {
			const binaryData = event.target.result;
			const workbook = XLSX.read(binaryData, { type: "binary" });
			const sheetName = workbook.SheetNames[0];
			const sheet = workbook.Sheets[sheetName];
			const header = XLSX.utils.sheet_to_json(sheet, { header: 1 })[0];

			if (JSON.stringify(header) === JSON.stringify(expectedHeader)) {
				resolve(true);
			} else {
				resolve(false);
			}
		};

		reader.onerror = (event) => {
			reject(event.target.error);
		};

		reader.readAsBinaryString(file);
	});
}

function isValidDate(dateString) {
	// Parse the input string into a Date object
	const dateObj = new Date(dateString);

	// Check if the input string was a valid date
	if (isNaN(dateObj.getTime())) {
		return false;
	}

	// Check if the date is equal to the parsed date string
	if (dateObj.toISOString().slice(0, 10) !== dateString) {
		return false;
	}

	return true;
}

const isStrictArabic = (str) => {
	const strictArabicRegex = /^[\u0600-\u06FF\s]+$/;
	return strictArabicRegex.test(str);
};

function isStrictFrench(str) {
	const strictFrenchRegex = /^[a-zA-Zàáâäçèéêëìíîïñòóôöùúûüÿ\s]+$/;
	return strictFrenchRegex.test(str);
}

const getCivility = (status, language) => {
	let civility = "";

	switch (status) {
		case "CM":
			civility = language === "a" ? "أعزب" : "Célibataire";
			break;
		case "MM":
			civility = language === "a" ? "متزوج" : "Marié";
			break;
		case "DM":
			civility = language === "a" ? "مطلق" : "Divorcé";
			break;
		case "VM":
			civility = language === "a" ? "أرمل" : "Veuf";
			break;
		case "CF":
			civility = language === "a" ? "عزباء" : "Célibataire";
			break;
		case "MF":
			civility = language === "a" ? "متزوجة" : "Mariée";
			break;
		case "DF":
			civility = language === "a" ? "مطلقة" : "Divorcée";
			break;
		case "VF":
			civility = language === "a" ? "أرملة" : "Veuve";
			break;
		default:
			civility = "Unknown marital status";
	}

	return civility;
};

const getAlphabet = (language) => {
	let alphabet = [];

	if (language === "ar") {
		for (let i = 0; i < 28; i++) {
			alphabet.push(String.fromCharCode(1601 + i)); // Arabic characters start from Unicode 1601
		}
	} else if (language === "fr") {
		for (let i = 65; i <= 90; i++) {
			alphabet.push(String.fromCharCode(i)); // Uppercase Latin alphabet characters start from Unicode 65
		}
		for (let i = 97; i <= 122; i++) {
			alphabet.push(String.fromCharCode(i)); // Lowercase Latin alphabet characters start from Unicode 97
		}
	}

	return alphabet;
};

const getGenderName = (gender, language) => {
	let genderName = "";

	if (gender === "F") {
		genderName = language === "a" ? "أنثى" : "Femme"; // Arabic: 'أنثى', French: 'Femme'
	} else if (gender === "M") {
		genderName = language === "a" ? "ذكر" : "Homme"; // Arabic: 'ذكر', French: 'Homme'
	}

	return genderName;
};

function convertDateFormat(dateStr, outputType) {
	// Helper function to add leading zero if needed
	function padZero(number) {
		return number < 10 ? "0" + number : number;
	}

	// Regular expressions to match dd/mm/yyyy, dd-mm-yyyy, yyyy/mm/dd, and yyyy-mm-dd formats
	const dateRegex1 = /^(\d{1,2}|"00")[\/\-](\d{1,2}|"00")[\/\-](\d{4})$/; // dd/mm/yyyy or dd-mm-yyyy
	const dateRegex2 = /^(\d{4})[\/\-](\d{1,2}|00)[\/\-](\d{1,2}|00)$/; // yyyy/mm/dd or yyyy-mm-dd

	let match1 = dateRegex1.exec(dateStr);
	let match2 = dateRegex2.exec(dateStr);

	let day, month, year;
	let type = "E"; // Default to "E" for error

	if (match1) {
		day = parseInt(match1[1], 10);
		month = parseInt(match1[2], 10);
		year = parseInt(match1[3], 10);

		// Basic validation for day and month ranges
		if (day >= 1 && day <= 31 && month >= 1 && month <= 12) {
			type = "N"; // Normal date
		} else {
			// Swap day and month if they seem reversed
			if (day >= 1 && day <= 12 && month >= 1 && month <= 31) {
				let temp = day;
				day = month;
				month = temp;
				type = "N";
			} else {
				// If day or month is 00
				if (day == 0 || month == 0) {
					day = 0;
					month = 0;
					type = "P";
				} else {
					type = "E"; // Still an error
				}
			}
		}
	} else if (match2) {
		year = parseInt(match2[1], 10);
		month = parseInt(match2[2], 10);
		day = parseInt(match2[3], 10);

		// Basic validation for day and month ranges
		if (day >= 1 && day <= 31 && month >= 1 && month <= 12) {
			type = "N"; // Normal date
		} else {
			type = "E"; // Error if day or month are out of range
		}
	} else {
		// Try to find a 4-digit year and presume a valid date
		let yearMatch = /\b(\d{4})\b/.exec(dateStr);
		if (yearMatch) {
			year = parseInt(yearMatch[1], 10);
			day = 0;
			month = 0;
			type = "P"; // Presumed date
		} else {
			// If no valid year is found, return the fixed error date
			return { date: "01-01-1800", type: type };
		}
	}

	if (type === "E") {
		// Return the fixed error date
		return { date: "01-01-1800", type: type };
	}

	// Format the date parts with leading zeros
	day = padZero(day);
	month = padZero(month);

	// Format the date as 01/01/yyyy if day or month is 00
	let day01 = day === "00" ? "01" : day;
	let month01 = month === "00" ? "01" : month;

	// Format the date as  31/12/yyyy if day or month is 00
	let day31 = day === "00" ? "31" : day;
	let month12 = month === "00" ? "12" : month;

	// Determine the separator based on outputType
	let separator = outputType === "T" ? "-" : "/";

	// Format the date as  31/12/yyyy if day or month is 00
	let preDateAr =
		padZero(day) === "00" || padZero(month) === "00"
			? "خلال "
			: `${padZero(day)}${separator}${padZero(month)}${separator}`;

	let formattedDate = `${day}${separator}${month}${separator}${year}`;
	let jsFormattedDate = `${month}${separator}${day}${separator}${year}`;
	let formattedDate0101 = `${day01}${separator}${month01}${separator}${year}`;
	let formattedDate3112 = `${day31}${separator}${month12}${separator}${year}`;
	let formattedDatePreAr = `${preDateAr}${year}`;

	return {
		date: formattedDate,
		type: type,
		jsDate: jsFormattedDate,
		date0101: formattedDate0101,
		date3112: formattedDate3112,
		preDateAr: formattedDatePreAr,
	};
}

function sanitizeInput(input) {
	return input.replace(/[^a-zA-Z0-9 ]/g, ""); // Only allow alphanumeric characters and spaces
}

function getCivilityCode(civility) {
	if (!civility || typeof civility !== "string") return "";

	// Normalize input: lowercase, remove spaces, trim
	let input = civility.trim().toLowerCase();

	// French & Arabic mappings
	const mapping = {
		// French
		marié: "M",
		marie: "M",
		mariée: "M",
		mariee: "M",
		celibataire: "C",
		célibataire: "C",
		divorcé: "D",
		divorce: "D",
		divorcée: "D",
		divorcee: "D",
		veuf: "V",
		veuve: "V",

		// Arabic
		أعزب: "C", // célibataire
		اعزب: "C", // célibataire
		عازب: "C",
		عزباء: "C",
		متزوج: "M", // marié
		متزوجة: "M",
		متزوجه: "M",
		مطلق: "D", // divorcé
		مطلقة: "D",
		مطلقه: "D",
		أرمل: "V", // veuf
		ارمل: "V", // veuf
		أرملة: "V",
		أرمله: "V",
		ارملة: "V",
		ارمله: "V",
	};

	// If already a single character, just return uppercase
	if (input.length === 1) {
		return input.toUpperCase();
	}

	// Check mapping
	return mapping[input] || "";
}

// Function to get the current date and time as a string
function getCurrentDateTimeString() {
	const now = new Date();
	const date = now.toISOString().split("T")[0]; // YYYY-MM-DD
	const time = now.toTimeString().split(" ")[0].replace(/:/g, "-"); // HH-MM-SS
	return `${date}_${time}`;
}

// Function to compress the folder into a ZIP file
function compressFolderToZip(folderPath) {
	return new Promise((resolve, reject) => {
		const output = fs.createWriteStream(`${folderPath}.zip`);
		const archive = archiver("zip", { zlib: { level: 9 } });

		output.on("close", function () {
			resolve();
		});

		archive.on("error", function (err) {
			reject(err);
		});

		archive.pipe(output);

		// Append the folder to the archive
		archive.directory(folderPath, false);

		archive.finalize();
	});
}

async function getFullDossier() {
	const people = await person.find();
	const systemInfo = await system.findOne();
	const dossies = await dossier.find({ id_commune: systemInfo.communeCode });
	// const dossies = await dossier.find();

	// Create a map of person ID to person data
	const personMap = people.reduce((map, person) => {
		map[person._id] = person;
		return map;
	}, {});

	// Combine dossier data with person data
	const dossierEnq = dossies.map((dossier) => {
		const demandeurInfo = personMap[dossier.id_demandeur] || null;
		var conjoinInfo = [];
		if (dossier.id_conjoin)
			conjoinInfo = dossier.id_conjoin.map((id_conj) => {
				const conjoin = personMap[id_conj] || null;
				return conjoin;
			});

		if (conjoinInfo)
			return {
				...dossier._doc,
				demandeur: demandeurInfo,
				conjoin: conjoinInfo,
			};
		else return { ...dossier._doc, demandeur: demandeurInfo };
	});

	return dossierEnq;
}

function sortByName(a, b, attribut, type) {
	let x = a.demandeur[attribut].toLowerCase();
	let y = b.demandeur[attribut].toLowerCase();
	if (type === "asc") {
		if (x < y) {
			return -1;
		}
		if (x > y) {
			return 1;
		}
	}
	if (type === "desc") {
		if (x < y) {
			return 1;
		}
		if (x > y) {
			return -1;
		}
	}

	return 0;
}
function reverseDayAndMonth(dateStr) {
	if (dateStr) {
		const [day, month, year] = dateStr.split("/");
		return `${month}/${day}/${year}`;
	} else {
		return "";
	}
}

function countParentKeyMatches(
	targetEntry,
	tableEntries,
	lowPercentage = 0.92
) {
	// Initialize counters
	const results = {
		brotherMatches: [],
		fatherMatches: [],
		motherMatches: [],
		totalBrotherMatches: 0,
		totalFatherMatches: 0,
		totalMotherMatches: 0,
	};

	// Improved fuzzy match function (Levenshtein-based)
	function calculateSimilarity(str1 = "", str2 = "") {
		if (str1 === str2) return 1;
		if (!str1 || !str2) return 0;

		const len1 = str1.length;
		const len2 = str2.length;
		const matrix = [];

		// Initialize matrix
		for (let i = 0; i <= len1; i++) matrix[i] = [i];
		for (let j = 0; j <= len2; j++) matrix[0][j] = j;

		// Fill matrix
		for (let i = 1; i <= len1; i++) {
			for (let j = 1; j <= len2; j++) {
				const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
				matrix[i][j] = Math.min(
					matrix[i - 1][j] + 1, // Deletion
					matrix[i][j - 1] + 1, // Insertion
					matrix[i - 1][j - 1] + cost // Substitution
				);
			}
		}

		// Calculate similarity percentage
		const maxLen = Math.max(len1, len2);
		return 1 - matrix[len1][len2] / maxLen;
	}

	// Ensure we have valid target and table entries
	if (!targetEntry?.demandeur || !Array.isArray(tableEntries)) {
		return results;
	}

	const targetBrother = targetEntry.demandeur.brotherkey;
	const targetFather = targetEntry.demandeur.fatherkey;
	const targetMother = targetEntry.demandeur.motherkey;

	// Compare against all table entries
	tableEntries.forEach((entry) => {
		if (!entry?.demandeur || entry._id === targetEntry._id) return;

		const currentBrother = entry.demandeur.brotherkey;
		const currentFather = entry.demandeur.fatherkey;
		const currentMother = entry.demandeur.motherkey;

		// Check brotherkey match
		if (targetBrother && currentBrother) {
			const similarity = calculateSimilarity(targetBrother, currentBrother);
			if (similarity >= lowPercentage) {
				results.brotherMatches.push({
					matchId: entry._id,
					num_dos: entry.num_dos,
					date_depo: entry.date_depo,
					notes: entry.notes,
					similarity: similarity * 100,
					matchingKey: currentBrother,
					demandeur: entry["demandeur"],
				});
				results.totalBrotherMatches++;
			}
		}

		// Check fatherkey match
		if (targetFather && currentFather) {
			const similarity = calculateSimilarity(targetFather, currentFather);
			if (similarity >= lowPercentage) {
				results.fatherMatches.push({
					matchId: entry._id,
					num_dos: entry.num_dos,
					date_depo: entry.date_depo,
					notes: entry.notes,
					similarity: similarity * 100,
					matchingKey: currentFather,
					demandeur: entry["demandeur"],
				});
				results.totalFatherMatches++;
			}
		}

		// Check motherkey match
		if (targetMother && currentMother) {
			const similarity = calculateSimilarity(targetMother, currentMother);
			if (similarity >= lowPercentage) {
				results.motherMatches.push({
					matchId: entry._id,
					num_dos: entry.num_dos,
					date_depo: entry.date_depo,
					notes: entry.notes,
					similarity: similarity * 100,
					matchingKey: currentFather,
					demandeur: entry["demandeur"],
				});
				results.totalMotherMatches++;
			}
		}
	});

	return results;
}

const getSimilarityKey = (dossierByNotes, type) => {
	return dossierByNotes.map(function (item) {
		const demandeur = item.demandeur || {};
		if (type === "ar")
			return {
				_id: item._id,
				num_dos: item.num_dos,
				date_depo: item.date_depo,
				notes: item.notes,
				remark: item.remark,
				demandeur: {
					...demandeur?._doc, // Spread existing demandeur properties
					brotherkey:
						item.demandeur?.nom +
							item.demandeur?.prenom_p +
							item.demandeur?.nom_m +
							item.demandeur?.prenom_m || null, // Add brotherkey with fallback
					fatherkey: item.demandeur?.nom + item.demandeur?.prenom_p || null, // Add fatherkey with fallback
					motherkey: item.demandeur?.nom_m + item.demandeur?.prenom_m || null, // Add motherkey with fallback
				},
			};
		else
			return {
				_id: item._id,
				num_dos: item.num_dos,
				date_depo: item.date_depo,
				notes: item.notes,
				remark: item.remark_fr,
				demandeur: {
					...demandeur?._doc, // Spread existing demandeur properties
					brotherkey:
						item.demandeur?.nom_fr +
							item.demandeur?.prenom_p_fr +
							item.demandeur?.nom_m_fr +
							item.demandeur?.prenom_m_fr || null, // Add brotherkey with fallback
					fatherkey:
						item.demandeur?.nom_fr + item.demandeur?.prenom_p_fr || null, // Add fatherkey with fallback
					motherkey:
						item.demandeur?.nom_m_fr + item.demandeur?.prenom_m_fr || null, // Add motherkey with fallback
				},
			};
	});
};

/**
 * Segregates a list of dossier items into groups based on brother relationships (father's side and mother's side).
 *
 * For each dossier, identifies its brothers by matching parent keys, then groups dossiers into:
 *   - fatherBrothersList: Groups of dossiers sharing the same father.
 *   - motherBrothersList: Groups of dossiers sharing the same mother.
 *   - remainingDossiers: Dossiers with no identified brothers.
 *
 * Each group contains a main dossier and its brothers, with relevant details.
 *
 * @async
 * @param {Array<Object>} keyArray2 - Array of dossier items to process. Each item should contain a `demandeur` object and an `_id`.
 * @returns {Promise<{
 *   fatherBrothersList: Array<Object>,
 *   motherBrothersList: Array<Object>,
 *   remainingDossiers: Array<Object>,
 *   stats: {
 *     fatherGroups: number,
 *     motherGroups: number,
 *     remaining: number
 *   }
 * }>} An object containing the segregated lists and statistics.
 */
async function segregateBrothersLists(keyArray2) {
	// Create a Set to track used IDs for efficient lookups
	const usedIds = new Set(),
		usedIdsF = new Set(),
		usedIdsM = new Set();

	// Initialize result arrays
	const brotherBrothersList = [];
	const fatherBrothersList = [];
	const motherBrothersList = [];
	const remainingDossiers = [];

	// First pass: Process all items to identify brothers
	const processedItems = await Promise.all(
		keyArray2.map(async (item) => {
			if (item.remark) console.log("item", item.remark);

			const demandeur = item.demandeur || {};
			const parentKeyMatches = await countParentKeyMatches(item, keyArray2);

			return {
				...item,
				demandeur: {
					...demandeur,
					numberOfBrotherBrothers: parentKeyMatches.totalBrotherMatches || 0,
					numberOfFatherBrothers: parentKeyMatches.totalFatherMatches || 0,
					numberOfMotherBrothers: parentKeyMatches.totalMotherMatches || 0,
					listOfBrotherBrothers: parentKeyMatches.brotherMatches || [],
					listOfFatherBrothers: parentKeyMatches.fatherMatches || [],
					listOfMotherBrothers: parentKeyMatches.motherMatches || [],
				},
			};
		})
	);

	// Second pass: Segregate into separate lists
	for (const item of processedItems) {
		// Check if this item has any brothers
		const hasBrotherBrothers = item.demandeur.listOfBrotherBrothers.length > 0;
		const hasFatherBrothers = item.demandeur.listOfFatherBrothers.length > 0;
		const hasMotherBrothers = item.demandeur.listOfMotherBrothers.length > 0;

		if (hasBrotherBrothers) {
			if (usedIds.has(item._id.toString())) {
				continue; // Skip already used items
			}
			// Create father brothers group
			const brotherGroup = {
				mainDossier: {
					_id: item._id,
					num_dos: item.num_dos,
					date_depo: item.date_depo,
					address_fr: item.adress_fr,
					remark: item.remark,
					...item.demandeur, // Spread existing demandeur properties
				},
				brothers: item.demandeur.listOfBrotherBrothers.map((p) => ({
					_id: p.matchId,
					num_dos: p.num_dos,
					date_depo: p.date_depo,
					address_fr: p.adress_fr,
					remark: p.remark,
					...p.demandeur, // Spread existing demandeur properties
					similarity: p.similarity,
				})),
			};
			brotherBrothersList.push(brotherGroup);

			// Mark all brothers as used
			usedIds.add(item._id.toString());
			item.demandeur.listOfBrotherBrothers.forEach((b) =>
				usedIds.add(b.matchId.toString())
			);
		} else {
			// No brothers - add to remaining dossiers
			remainingDossiers.push({
				mainDossier: {
					_id: item._id,
					num_dos: item.num_dos,
					date_depo: item.date_depo,
					address_fr: item.adress_fr,
					remark: item.remark,
					...item.demandeur, // Spread existing demandeur properties
				},
			});
		}
		if (hasFatherBrothers) {
			if (usedIdsF.has(item._id.toString())) {
				continue; // Skip already used items
			}
			// Create father brothers group
			const fatherGroup = {
				mainDossier: {
					_id: item._id,
					num_dos: item.num_dos,
					date_depo: item.date_depo,
					address_fr: item.adress_fr,
					remark: item.remark,
					...item.demandeur, // Spread existing demandeur properties
				},
				brothers: item.demandeur.listOfFatherBrothers.map((p) => ({
					_id: p.matchId,
					num_dos: p.num_dos,
					date_depo: p.date_depo,
					address_fr: p.adress_fr,
					remark: p.remark,
					...p.demandeur, // Spread existing demandeur properties
					similarity: p.similarity,
				})),
			};
			fatherBrothersList.push(fatherGroup);
			// Mark all brothers as used
			usedIdsF.add(item._id.toString());
			item.demandeur.listOfFatherBrothers.forEach((b) =>
				usedIdsF.add(b.matchId.toString())
			);
		}
		if (hasMotherBrothers) {
			if (usedIdsM.has(item._id.toString())) {
				continue; // Skip already used items
			}
			// Create mother brothers group
			const motherGroup = {
				mainDossier: {
					_id: item._id,
					num_dos: item.num_dos,
					date_depo: item.date_depo,
					address_fr: item.adress_fr,
					remark: item.remark,
					...item.demandeur, // Spread existing demandeur properties
				},
				brothers: item.demandeur.listOfMotherBrothers.map((b) => ({
					_id: b.matchId,
					num_dos: b.num_dos,
					date_depo: b.date_depo,
					address_fr: b.adress_fr,
					remark: b.remark,
					...b.demandeur, // Spread existing demandeur properties
					similarity: b.similarity,
				})),
			};
			// console.log("motherBrothersList", motherGroup.brothers[0]);
			motherBrothersList.push(motherGroup);
			// Mark all brothers as used
			usedIdsM.add(item._id.toString());
			item.demandeur.listOfMotherBrothers.forEach((b) =>
				usedIdsM.add(b.matchId.toString())
			);
		}
	}

	return {
		brotherBrothersList,
		fatherBrothersList,
		motherBrothersList,
		remainingDossiers,
		stats: {
			brotherGroups: brotherBrothersList.length,
			fatherGroups: fatherBrothersList.length,
			motherGroups: motherBrothersList.length,
			remaining: remainingDossiers.length,
		},
	};
}

const addRowToWorksheet = (worksheet, rowData, imagePath, col, workbook) => {
	worksheet?.addRow(rowData, "i+");
	if (imagePath) {
		const image = workbook.addImage({
			filename: imagePath,
			extension: "png",
		});
		worksheet?.addImage(image, {
			tl: { col, row: worksheet._media.length + 6 },
			ext: { width: 178, height: 198 },
		});
	}
};

const isDateBeforeQuota = (record, triDossiers, quotaDate) => {
	if (triDossiers === "quotas") quotaDate = quotaDate;
	else if (triDossiers === "date-depo") quotaDate = record.date_depo;
	return (
		new Date(convertDateFormat(record.demandeur?.date_n).jsDate) <=
		new Date(
			new Date(quotaDate).getFullYear() - 35,
			new Date(quotaDate).getMonth(),
			new Date(quotaDate).getDate()
		)
	);
};

const processDossier = async (
	record,
	triDossiers,
	quotaDate,
	workbook,
	type,
	photoFemme,
	worksheetPlus,
	worksheetMoin
) => {
	let imagePath;
	if (photoFemme === "true" && record.demandeur?.gender === "F") {
		imagePath = "usersPicUpload/Women_icon.png";
	} else
		imagePath = record?.demandeur?.photo_link || "usersPicUpload/default.png";
	const rowCount = isDateBeforeQuota(record)
		? worksheetPlus?._rows.length - 6
		: worksheetMoin?._rows.length - 6;
	const rowData = type.includes("fr")
		? [
				rowCount,
				record.demandeur?.nom_fr,
				record.demandeur?.prenom_fr,
				record.demandeur?.date_n,
				record.demandeur?.lieu_n_fr,
				getCivility(
					record.demandeur?.stuation_f + record.demandeur?.gender,
					"f"
				),
				record.demandeur?.prenom_p_fr,
				record.demandeur?.nom_m_fr,
				record.demandeur?.prenom_m_fr,
				record.adress_fr,
				record.date_depo,
				"",
				record.num_dos,
		  ]
		: [
				rowCount,
				record.demandeur?.nom,
				record.demandeur?.prenom,
				record.demandeur?.date_n,
				record.demandeur?.lieu_n,
				getCivility(
					record.demandeur?.stuation_f + record.demandeur?.gender,
					"a"
				),
				record.demandeur?.prenom_p,
				record.demandeur?.nom_m,
				record.demandeur?.prenom_m,
				record.adress,
				record.date_depo,
				"",
				record.num_dos,
		  ];
	const rowDataExport = [
		worksheetPlus?._rows.length - 1,
		record.num_dos,
		record.date_depo,
		record.demandeur?.nom,
		record.demandeur?.prenom,
		record.demandeur?.gender,
		record.demandeur?.date_n,
		record.demandeur?.num_act,
		record.demandeur?.lieu_n,
		getCivility(record.demandeur?.stuation_f + record.demandeur?.gender, "a"),
		record.demandeur?.prenom_p,
		record.demandeur?.nom_m,
		record.demandeur?.prenom_m,
		record.adress,
		record.note_revenue,
		record.note_habita,
		record.note_situation_familiale,
		record.note_anciennete,
		record.notes,
		record.remark,
	];
	let addWorkSheet;
	if (type === "exportFilter") addWorkSheet = worksheetPlus;
	else
		addWorkSheet = isDateBeforeQuota(record, triDossiers, quotaDate)
			? worksheetPlus
			: worksheetMoin;
	if (type === "export") {
		addRowToWorksheet(addWorkSheet, rowDataExport, null, 29, workbook);
	} else if (type === "exportFilter") {
		addRowToWorksheet(addWorkSheet, rowDataExport, null, 29, workbook);
	} else if (type.includes("f")) {
		addRowToWorksheet(addWorkSheet, rowData, imagePath, 11, workbook);
	} else if (type.includes("a")) {
		addRowToWorksheet(addWorkSheet, rowData, imagePath, 11, workbook);
	}
};

const getRowData = (record, type, rowCount, numBro) => {
	// console.log("type", type);
	return type.includes("fr")
		? [
				rowCount,
				record?.nom_fr,
				record?.prenom_fr,
				record?.date_n,
				record?.lieu_n_fr,
				getCivility(record?.stuation_f + record?.gender, "f"),
				record?.prenom_p_fr,
				record?.nom_m_fr,
				record?.prenom_m_fr,
				record?.date_depo,
				record?.photo_link,
				record?.num_dos,
				record?.remark,
				record?.similarity || "---",
				numBro || "---",
		  ]
		: [
				rowCount,
				record?.nom,
				record?.prenom,
				record?.date_n,
				record?.lieu_n,
				getCivility(record?.stuation_f + record?.gender, "a"),
				record?.prenom_p,
				record?.nom_m,
				record?.prenom_m,
				record?.date_depo,
				record?.photo_link,
				record?.num_dos,
				record?.remark,
				record?.similarity || "---",
				numBro || "---",
		  ];
};

const processDossierBrothers = async (
	record,
	triDossiers,
	quotaDate,
	workbook,
	type,
	photoFemme,
	worksheetBrother,
	worksheetFather,
	worksheetMother,
	worksheetUnique,
	listType
) => {
	let addWorkSheet;

	if (listType === "Brothers") addWorkSheet = worksheetBrother;
	else if (listType === "Fathers") addWorkSheet = worksheetFather;
	else if (listType === "Mothers") addWorkSheet = worksheetMother;
	else addWorkSheet = worksheetUnique;

	let imagePath;
	if (photoFemme === "true" && record.mainDossier?.gender === "F") {
		imagePath = "usersPicUpload/Women_icon.png";
	} else
		imagePath = record?.mainDossier?.photo_link || "usersPicUpload/default.png";
	const rowCount = triDossiers;
	// if (record.mainDossier.remark) console.log("record.mainDossier", record.mainDossier.remark);
	const rowData = getRowData(record.mainDossier, type, rowCount, quotaDate);

	addRowToWorksheet(addWorkSheet, rowData, imagePath, 10, workbook);
	if (
		listType === "Brothers" ||
		listType === "Fathers" ||
		listType === "Mothers"
	) {
		record.brothers.forEach((brother) => {
			let imagePathBrother;
			// console.log("brother:", brother.photo_link,"maindossier:", record.mainDossier.prenom_fr);
			if (photoFemme === "true" && brother?.gender === "F") {
				imagePathBrother = "usersPicUpload/Women_icon.png";
			} else
				imagePathBrother = brother.photo_link || "usersPicUpload/default.png";
			const rowCountBrother = addWorkSheet?._rows.length - 6;
			const brotherRowData = getRowData(brother, type, rowCountBrother);
			addRowToWorksheet(
				addWorkSheet,
				brotherRowData,
				imagePathBrother,
				10,
				workbook
			);
		});
		const brotherSeparetor = [
			"---",
			"---",
			"---",
			"---",
			"---",
			"---",
			"---",
			"---",
			"---",
			"---",
			"---",
			"---",
			"---",
			"---",
		];

		addRowToWorksheet(
			addWorkSheet,
			brotherSeparetor,
			"usersPicUpload/default.png",
			10,
			workbook
		);
	}
};

module.exports = {
	isValidDate,
	validateHeader,
	isStrictArabic,
	isStrictFrench,
	getCivility,
	getAlphabet,
	getGenderName,
	convertDateFormat,
	sanitizeInput,
	getCurrentDateTimeString,
	compressFolderToZip,
	getFullDossier,
	sortByName,
	reverseDayAndMonth,
	countParentKeyMatches,
	segregateBrothersLists,
	processDossier,
	processDossierBrothers,
	getSimilarityKey,
	addRowToWorksheet,
	isDateBeforeQuota,
	getCivilityCode,
};
