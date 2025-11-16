const asyncHandler = require("express-async-handler");
const reader = require("sheetjs-style");
const Dossier = require("../models/dossierModel");
const Person = require("../models/personModel");
const system = require("../models/systemModel");

const {
  convertDateFormat,
  getFullDossier,
  getCivilityCode,
} = require("../config/functions");

const correctionDB = asyncHandler(async (req, res) => {
  const allDossiers = await getFullDossier();
  //get system data
  const systemInfo = await system.findOne();

  //fix the dossiers that dont have id_commune set
  const updateResult = await Dossier.updateMany(
    { id_commune: { $exists: false } }, // Filter for documents without 'Id_commune'
    { $set: { id_commune: systemInfo.communeCode } } // Set 'Id_commune' to your default value
  );

  //fix the database from dossiers that have no demandeur
  const deleteDossWithNoDemResult = await Dossier.deleteMany(
    { id_demandeur: { $exists: false } } // Delete documents without 'id_demandeur'
  );
  console.log("fixing:", deleteDossWithNoDemResult);

  // fix the database from dossiers that the demandeur has no name

  // AND (prenom is void OR missing) AND (prenom_fr is void OR missing)
  const voidNameDocuments = await Person.aggregate([
    {
      $match: {
        // Case 1: One of the name fields are missing
        $or: [
          {
            $or: [
              { nom: { $exists: false } },
              { nom_fr: { $exists: false } },
              { prenom: { $exists: false } },
              { prenom_fr: { $exists: false } },
            ],
          },
          // Case 2: All name fields are void (null, empty, or whitespace)
          {
            $and: [
              {
                $or: [{ nom: null }, { nom: "" }, { nom: " " }],
              },
              {
                $or: [{ nom_fr: null }, { nom_fr: "" }, { nom_fr: " " }],
              },
            ],
          },
          {
            $and: [
              {
                $or: [{ prenom: null }, { prenom: "" }, { prenom: " " }],
              },
              {
                $or: [
                  { prenom_fr: null },
                  { prenom_fr: "" },
                  { prenom_fr: " " },
                ],
              },
            ],
          },
        ],
      },
    },
    {
      $project: {
        _id: 1,
        num_dos: 1,
        type: 1,
      },
    },
  ]);

  // find the dossiers of the persons that have no name
  const dossiersToUpdate = allDossiers.filter(async (dossier) => {
    return voidNameDocuments.forEach(async (person) => {
      if (person.type === "dema") {
        if (person._id.toString() === dossier.id_demandeur.toString()) {
          await Person.findByIdAndDelete(person._id);
          await Dossier.findByIdAndDelete(dossier._id);
        }
      }
      if (person.type === "conj") {
        if (person._id.toString() === dossier.id_conjoin.toString()) {
          await Person.findByIdAndDelete(person._id.toString());
          const dossierToUpdate = await Dossier.findById(dossier._id);

          const index = dossierToUpdate.id_conjoin?.indexOf(5);
          if (index > -1) {
            // only splice array when item is found
            dossierToUpdate.id_conjoin?.splice(index, 1); // 2nd parameter means remove one item only
          }
          dossierToUpdate.num_conj = dossierToUpdate.num_conj - 1;
          await dossierToUpdate.save();
        }
      }
    });
  });

  //  fix the database from dossiers that are duplicated.
  // First, identify duplicates using both fields
  const keepIds = await Dossier.aggregate([
    {
      $group: {
        _id: {
          num_dos: "$num_dos",
          id_commune: "$id_commune",
        },
        firstId: { $first: "$_id" }, // Keep the first document
        count: { $sum: 1 },
      },
    },
    {
      $match: {
        count: { $gt: 1 }, // Only consider duplicates
      },
    },
    {
      $project: {
        _id: 0,
        keepId: "$firstId",
        num_dos: "$_id.num_dos",
        id_commune: "$_id.id_commune",
      },
    },
  ]);

  // Delete all documents with duplicate (num_dos + id_commune) except the ones we're keeping
  const deleteResult =
    keepIds.length > 0
      ? await Dossier.deleteMany({
          $or: keepIds.map((item) => ({
            num_dos: item.num_dos,
            id_commune: item.id_commune,
            _id: { $ne: item.keepId },
          })),
        })
      : { deletedCount: 0 };

  console.log(`Deleted ${deleteResult.deletedCount} duplicate documents`);
  // // if (!res.headersSent)
  res.json(
    `${updateResult.modifiedCount} id_commune documents were updated, and ${deleteDossWithNoDemResult.deletedCount} documents were deleted.`
  );
});

const updateDossiers = asyncHandler(async (req, res) => {
  try {
    console.log("updateDossiers File received:");
    const { creator, remark } = req.body;
    const importation_File = req.file?.path;
    if (!importation_File) {
      // if (!res.headersSent) 
      res.status(400).send("No file uploaded");
    }

    const file = reader.readFile(importation_File, {
      dense: true,
      dateNF: "dd/mm/yyyy",
    });

    const sheetName = file.SheetNames[0];

    const stream = reader.stream.to_json(file.Sheets[sheetName], {
      raw: false,
    });
    const excelData = [];

    await stream.on("data", (data) => {
      excelData.push(data);
    });

    if (excelData.length > 0) {
      if (remark === "French Fichier Imported") {
        await processDossiers(excelData, creator, res, "French");
      } else if (remark === "Arabic Fichier Imported") {
        await processDossiers(excelData, creator, res, "Arabic");
      } else if (remark === "numDos Fichier Imported") {
        await processDossiers(excelData, creator, res, "numDos");
      } else {
        // if (!res.headersSent) 
        res.status(400).send("Invalid remark provided");
      }
    } else {
      // if (!res.headersSent) 
      res.status(200).send("لا يمكن قراءة الملف");
    }
  } catch (error) {
    console.error("Error processing request:", error);
    // if (!res.headersSent) 
    res.status(500).send("Server error");
  }
});

async function processDossiers(data, creator, res, language) {
  try {
    console.log("processDossiers excelData: ");
    const dossiersCount = data.length;
    let dossierAddedCount = 0;
    let dossierUpdatedCount = 0;
    let numDos = [];
    const data2 = await getFullDossier();
    await Promise.all(
      data.map(async (dossier, index) => {
        const row = index + 2;
        const { num_dos } = extractDossierData(dossier, language);
        const existingDossier = await Dossier.findOne({ num_dos });
        if (language === "numDos") {
          if (existingDossier) {
            let dossiers = await data2.find(
              (d) => d._id.toString() === existingDossier._id.toString()
            );
            numDos.push({
              _id: dossiers._id,
              num_dos: dossiers.num_dos,
              date_depo: dossiers.date_depo,
              notes: dossiers.notes,
              demandeur: {
                nom_fr: dossiers["demandeur"]?.nom_fr,
                prenom_fr: dossiers["demandeur"]?.prenom_fr,
                date_n: dossiers["demandeur"]?.date_n,
                stuation_f: dossiers["demandeur"]?.stuation_f,
              },
            });
          }
        } else {
          if (existingDossier) {
            await updateExistingDossier(
              existingDossier,
              dossier,
              creator,
              language,
              res,
              row
            );
            dossierUpdatedCount++;
          } else {
            await createNewDossier(dossier, creator, language, res, row);
            dossierAddedCount++;
          }
        }
      })
    );
    if (language === "numDos")
      // if (!res.headersSent) 
    res.status(200).send(numDos);
      else
        res
          .status(200)
          .send(
            `${dossierAddedCount} added, and ${dossierUpdatedCount} updated of ${dossiersCount} dossiers.`
          );
  } catch (error) {
    console.error("Error processing dossiers:", error);
    // if (!res.headersSent) 
    res.status(500).send("Error processing dossiers");
  }
}

function extractDossierData(dossier, language, res) {
  try {
    // Extract fields from the dossier based on the language
    console.log("extractDossierData dossier:", dossier["رقم الملف"]);
    if (language === "French") {
      return {
        num_dos: dossier["Ref demande"],
        date_depo: dossier["Date demande"],
        nom_dem: dossier["Nom"],
        prenom_dem: dossier["Prenom"],
        gender_dem: dossier["sexe"],
        date_n_dem: dossier["Date de naissance"],
        type_date_n_dem: dossier["Type date de naissance"],
        num_act_dem: dossier["Num ACT"],
        lieu_n_dem: dossier["Lieu de naissance"],
        num_conj: dossier["Nombre Conjoin"],
        prenom_p_dem: dossier["Prénom du pére"],
        prenom_m_dem: dossier["Prenom de la mére"],
        nom_m_dem: dossier["Nom de la mére"],
        address: dossier["Adress"],
        stuation_f_dem: getCivilityCode(dossier["Situation Familiale"]),
        Ordre_conj: dossier["Ordre Conjoint"] || 1,
        nom_conj: dossier["Nom DE CONJOINT"],
        prenom_conj: dossier["Prenom DE CONJOINT"],
        date_n_conj: dossier["Date de naissance Conjoint"],
        num_act_conj: dossier["Num ACT Conjoint"],
        type_date_n_conj: dossier["Type date de naissance Conjoint"],
        lieu_n_conj: dossier["Lieu de naissance Conjoint"],
        prenom_p_conj: dossier["Prénom du pére Conjoint"],
        nom_m_conj: dossier["Nom de la mére Conjoint"],
        prenom_m_conj: dossier["Prénom de la mére Conjoint"],
        category: dossier["Catégorie ( Plus/ Moin)"],
        note_revenue: dossier["Note Revenue"],
        note_habita: dossier["Note Habita"],
        note_situation_familiale: dossier["Note Situation Familiale"],
        note_anciennete: dossier["Note Anciennete"],
        notes: dossier["Notes"],
        remark: dossier["Remarque"],
        num_i_n: dossier["NIN"],
        num_i_n_conj: dossier["NIN CONJ"],
      };
    } else if (language === "Arabic") {
      return {
        num_dos: dossier["رقم الملف"],
        date_depo: dossier["تاريخ الايداع"],
        nom_dem: dossier["اللقب"],
        prenom_dem: dossier["الاسم"],
        gender_dem: dossier["الجنس"],
        date_n_dem: dossier["تاريخ الميلاد"],
        type_date_n_dem: dossier["طبيعة تاريخ الميلاد"],
        num_act_dem: dossier["رقم عقد الميلاد"],
        lieu_n_dem: dossier["بلدية الميلاد"],
        stuation_f_dem: getCivilityCode(dossier["الحالة العائلية"]),
        num_conj: dossier["عدد الزوجات"],
        prenom_p_dem: dossier["اسم الاب"],
        nom_m_dem: dossier["لقب الام"],
        prenom_m_dem: dossier["اسم الام"],
        address: dossier["العنوان"],
        Ordre_conj: dossier["ترتيب الزوجة"] || 1,
        prenom_conj: dossier["اسم الزوج(ة)"],
        nom_conj: dossier["لقب الزوج(ة)"],
        date_n_conj: dossier["تاريخ ميلاد الزوج(ة)"],
        type_date_n_conj: dossier["طبيعة تاريخ ميلاد الزوج(ة)"],
        num_act_conj: dossier["رقم عقد ميلاد الزوج(ة)"],
        lieu_n_conj: dossier["بلدية ميلاد الزوج(ة)"],
        prenom_p_conj: dossier["اسم أب الزوج(ة)"],
        prenom_m_conj: dossier["اسم أم الزوج(ة)"],
        nom_m_conj: dossier["لقب أم الزوج(ة)"],
        note_revenue: dossier["مستوى المداخيل"],
        note_habita: dossier["ظروف السكن"],
        note_situation_familiale: dossier["2الحالة العائلية"],
        note_anciennete: dossier["أقدمية طلب السكن"],
        notes: dossier["المجموع"],
        remark: dossier["الملاحظة"],
      };
    } else if (language === "numDos") {
      return {
        num_dos: dossier["Ordre"],
      };
    }
  } catch (error) {
    console.error("Error extractDossierData:", error);
    // if (!res.headersSent) 
    res.status(500).send("Error extractDossierData");
  }
}

async function updateExistingDossier(dossier, newData, creator, language, res) {
  try {
    // Extract data from the newData object based on the language
    console.log("updateExistingDossier newData:");
    const {
      nom_dem,
      prenom_dem,
      num_act_dem,
      date_n_dem,
      type_date_n_dem,
      lieu_n_dem,
      prenom_p_dem,
      prenom_m_dem,
      nom_m_dem,
      stuation_f_dem,
      Ordre_conj,
      prenom_conj,
      nom_conj,
      num_act_conj,
      type_date_n_conj,
      date_n_conj,
      lieu_n_conj,
      prenom_p_conj,
      prenom_m_conj,
      nom_m_conj,
      date_depo,
      address,
      num_conj,
      note_revenue,
      note_habita,
      note_situation_familiale,
      note_anciennete,
      notes,
      remark,
      num_i_n,
      num_i_n_conj,
    } = extractDossierData(newData, language, res);

    // Update demandeur if exists
    const demandeur = await Person.findById(dossier.id_demandeur);

    if (demandeur) {
      if (language === "French") {
        dossier.adress_fr = address || dossier.adress_fr;
        demandeur.prenom_fr = prenom_dem || demandeur.prenom_fr;
        demandeur.nom_fr = nom_dem || demandeur.nom_fr;
        demandeur.lieu_n_fr = lieu_n_dem || demandeur.lieu_n_fr;
        demandeur.prenom_p_fr = prenom_p_dem || demandeur.prenom_p_fr;
        demandeur.prenom_m_fr = prenom_m_dem || demandeur.prenom_m_fr;
        demandeur.nom_m_fr = nom_m_dem || demandeur.nom_m_fr;
      } else if (language === "Arabic") {
        dossier.adress = address || dossier.adress;
        demandeur.prenom = prenom_dem || demandeur.prenom;
        demandeur.nom = nom_dem || demandeur.nom;
        demandeur.lieu_n = lieu_n_dem || demandeur.lieu_n;
        demandeur.prenom_p = prenom_p_dem || demandeur.prenom_p;
        demandeur.prenom_m = prenom_m_dem || demandeur.prenom_m;
        demandeur.nom_m = nom_m_dem || demandeur.nom_m;
      }
      demandeur.num_act = num_act_dem || demandeur.num_act;
      demandeur.num_i_n = num_i_n || demandeur.num_i_n;
      demandeur.date_n =
        convertDateFormat(date_n_dem, "S").date || demandeur.date_n;
      demandeur.type_date_n = type_date_n_dem || demandeur.type_date_n;
      demandeur.stuation_f = stuation_f_dem || demandeur.stuation_f;
      await demandeur.save();
    }

    // Update conjoin if exists
    if (!(nom_conj === "") && !(nom_conj === "/") && !(nom_conj == null)) {
      if (dossier.id_conjoin) {
        if (dossier.id_conjoin[Ordre_conj - 1]) {
          // get conjoin
          const conjoin = await Person.findById(
            dossier.id_conjoin[Ordre_conj - 1]
          );

          // update conjoin
          if (conjoin) {
            if (language === "French") {
              conjoin.prenom_fr = prenom_conj || conjoin.prenom_fr;
              conjoin.nom_fr = nom_conj || conjoin.nom_fr;
              conjoin.lieu_n_fr = lieu_n_conj || conjoin.lieu_n_fr;
              conjoin.prenom_p_fr = prenom_p_conj || conjoin.prenom_p_fr;
              conjoin.prenom_m_fr = prenom_m_conj || conjoin.prenom_m_fr;
              conjoin.nom_m_fr = nom_m_conj || conjoin.nom_m_fr;
            } else if (language === "Arabic") {
              conjoin.prenom = prenom_conj || conjoin.prenom;
              conjoin.nom = nom_conj || conjoin.nom;
              conjoin.lieu_n = lieu_n_conj || conjoin.lieu_n;
              conjoin.prenom_p = prenom_p_conj || conjoin.prenom_p;
              conjoin.prenom_m = prenom_m_conj || conjoin.prenom_m;
              conjoin.nom_m = nom_m_conj || conjoin.nom_m;
            }
            conjoin.num_act = num_act_conj || conjoin.num_act;
            conjoin.num_i_n = num_i_n_conj || conjoin.num_i_n;
            conjoin.date_n =
              convertDateFormat(date_n_conj, "S").date || conjoin.date_n;
            conjoin.type_date_n = type_date_n_conj || conjoin.type_date_n;

            await conjoin.save();
          }
        } else {
          //create Conjoin
          const conjoin = await createConjoin(newData, language, creator);

          //add conjoin id
          if (conjoin) dossier.id_conjoin[Ordre_conj - 1] = conjoin._id;
        }
      } else {
        //create Conjoin
        const conjoin = await createConjoin(newData, language, creator);

        // create id_conjoin table
        var id_conjoin = [];
        id_conjoin[Ordre_conj - 1] = conjoin._id;

        //add id_conjoin
        dossier.id_conjoin = id_conjoin;
      }
    } else {
      if (dossier.id_conjoin) dossier.id_conjoin = [];
      if (dossier.num_conj) dossier.num_conj = 0;
    }

    // get system info
    const systemInfo = await system.findOne();

    // Update dossier
    dossier.date_depo = date_depo || dossier.date_depo;
    dossier.id_commune = systemInfo.communeCode || dossier.id_commune;
    dossier.num_conj = num_conj || dossier.num_conj;
    dossier.note_revenue = note_revenue || dossier.note_revenue;
    dossier.note_habita = note_habita || dossier.note_habita;
    dossier.note_situation_familiale =
      note_situation_familiale || dossier.note_situation_familiale;
    dossier.note_anciennete = note_anciennete || dossier.note_anciennete;
    dossier.notes = notes || dossier.notes;
    dossier.remark = remark || dossier.remark;
    await dossier.save();
  } catch (error) {
    console.error("Error updateExistingDossier", error);
    // // if (!res.headersSent)
      res.status(500).send("Error updateExistingDossier: ", dossier.num_dos);
  }
}

async function createNewDossier(dossier, creator, language, res, row) {
  try {
    // Extract data from the dossier object based on the language
    console.log("createNewDossier dossier:");
    const {
      num_dos,
      nom_dem,
      prenom_dem,
      gender_dem,
      num_act_dem,
      date_n_dem,
      type_date_n_dem,
      lieu_n_dem,
      num_conj,
      prenom_p_dem,
      prenom_m_dem,
      nom_m_dem,
      stuation_f_dem,
      Ordre_conj,
      nom_conj,
      date_depo,
      address,
      note_revenue,
      note_habita,
      note_situation_familiale,
      note_anciennete,
      notes,
      remark,
      date_n_conj,
      num_i_n,
      num_i_n_conj,
    } = extractDossierData(dossier, language);

    var demandeur = {};

    if (prenom_dem && nom_dem) {
      if (language === "French") {
        demandeur = await Person.create({
          type: "dema",
          prenom: "",
          prenom_fr: prenom_dem,
          nom: "",
          nom_fr: nom_dem,
          gender: gender_dem,
          num_act: num_act_dem,
          date_n: convertDateFormat(date_n_dem, "S").date,
          type_date_n: type_date_n_dem,
          lieu_n: "",
          lieu_n_fr: lieu_n_dem,
          wil_n: "",
          com_n: "",
          prenom_p: "",
          prenom_p_fr: prenom_p_dem,
          prenom_m: "",
          prenom_m_fr: prenom_m_dem,
          nom_m: "",
          nom_m_fr: nom_m_dem,
          num_i_n:
            num_i_n ||
            num_act_dem + " " + convertDateFormat(date_n_dem, "T").date,
          stuation_f: stuation_f_dem,
          situation_p: "",
          profession: "",
          salaire: "",
          creator,
        });
      } else if (language === "Arabic") {
        demandeur = await Person.create({
          type: "dema",
          prenom: prenom_dem,
          prenom_fr: "",
          nom: nom_dem,
          nom_fr: "",
          gender: gender_dem,
          num_act: num_act_dem,
          date_n: convertDateFormat(date_n_dem, "S").date,
          type_date_n: type_date_n_dem,
          lieu_n: lieu_n_dem,
          lieu_n_fr: "",
          wil_n: "",
          com_n: "",
          prenom_p: prenom_p_dem,
          prenom_p_fr: "",
          prenom_m: prenom_m_dem,
          prenom_m_fr: "",
          nom_m: nom_m_dem,
          nom_m_fr: "",
          num_i_n: num_i_n || "",
          stuation_f: stuation_f_dem,
          situation_p: "",
          profession: "",
          salaire: "",
          creator,
        });
      }
    } else {
      // if (!res.headersSent)
        res.status(400).send("الاسم غير موجود في السطر " + row);
    }

    var nb_conj = 0;
    if (num_conj) nb_conj = num_conj;
    else if (stuation_f_dem === "M" || "V") nb_conj = 1;

    var id_conjoin = [];
    if (!(nom_conj === "") && !(nom_conj === "/") && !(nom_conj == null)) {
      //create Conjoin
      const conjoin = await createConjoin(dossier, language, creator);
      // create id_conjoin table
      if (conjoin) id_conjoin[Ordre_conj - 1] = conjoin._id;
    }
    // determine conjoin gender
    var gender_conj = "";
    if (gender_dem === "M") gender_conj = "F";
    else gender_conj = "M";
    // get system data
    const systemInfo = await system.findOne();
    if (demandeur._id)
      await Dossier.create({
        creator,
        id_commune: systemInfo.communeCode,
        id_demandeur: demandeur._id,
        id_conjoin: id_conjoin,
        date_depo: date_depo,
        num_dos: num_dos,
        adress: language === "Arabic" ? address : "",
        adress_fr: language === "French" ? address : "",
        num_conj: nb_conj,
        note_revenue,
        note_habita,
        note_situation_familiale,
        note_anciennete,
        type: "imported",
        gender_conj,
        remark,
        saisi_conj: "imported",
        scan_dossier: "",
        notes,
      });
  } catch (error) {
    console.error("Error updateExistingDossier", error);
    // if (!res.headersSent)
      res.status(500).send("Error updateExistingDossier: ", num_dos);
  }
}

async function createConjoin(dossier1, language, creator, res) {
  try {
    // Extract data from the dossier object based on the language
    console.log("createConjoin dossier1:");
    const {
      prenom_conj,
      nom_conj,
      gender_dem,
      num_act_conj,
      date_n_conj,
      type_date_n_conj,
      lieu_n_conj,
      prenom_p_conj,
      prenom_m_conj,
      nom_m_conj,
      num_i_n_conj,
    } = extractDossierData(dossier1, language);
    // determine conjoin gender
    var gender_conj = "";
    if (gender_dem === "M") gender_conj = "F";
    else gender_conj = "M";

    if (prenom_conj && nom_conj) {
      if (language === "French")
        return await Person.create({
          type: "conj",
          prenom: "",
          prenom_fr: prenom_conj,
          nom: "",
          nom_fr: nom_conj,
          gender: gender_conj,
          num_act: num_act_conj,
          date_n: convertDateFormat(date_n_conj, "S").date,
          type_date_n: type_date_n_conj,
          lieu_n: "",
          lieu_n_fr: lieu_n_conj,
          wil_n: "",
          com_n: "",
          prenom_p: "",
          prenom_p_fr: prenom_p_conj,
          prenom_m: "",
          prenom_m_fr: prenom_m_conj,
          nom_m: "",
          nom_m_fr: nom_m_conj,
          num_i_n: num_i_n_conj || num_act_conj + " " + date_n_conj,
          stuation_f: "",
          situation_p: "",
          profession: "",
          salaire: "",
          creator,
        });
      else if (language === "Arabic")
        return await Person.create({
          type: "conj",
          prenom: prenom_conj,
          prenom_fr: "",
          nom: nom_conj,
          nom_fr: "",
          gender: gender_conj,
          num_act: num_act_conj,
          date_n: convertDateFormat(date_n_conj, "S").date,
          type_date_n: type_date_n_conj,
          lieu_n: lieu_n_conj,
          lieu_n_fr: "",
          wil_n: "",
          com_n: "",
          prenom_p: prenom_p_conj,
          prenom_p_fr: "",
          prenom_m: prenom_m_conj,
          prenom_m_fr: "",
          nom_m: nom_m_conj,
          nom_m_fr: "",
          num_i_n: num_i_n_conj || num_act_conj + " " + date_n_conj,
          stuation_f: "",
          situation_p: "",
          profession: "",
          salaire: "",
          creator,
        });
    }

  } catch (error) {
    console.error("Error createConjoin", error);
    // // if (!res.headersSent) 
    res.status(500).send("Error createConjoin");
  }
}

module.exports = { updateDossiers, correctionDB };
