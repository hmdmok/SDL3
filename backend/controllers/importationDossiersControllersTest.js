const asyncHandler = require("express-async-handler");
const reader = require("xlsx");
const Dossier = require("../models/dossierModel");
const Person = require("../models/personModel");
const { convertDateFormat } = require("../config/functions");

const updateDossiers = asyncHandler(async (req, res) => {
  try {
    const { creator, remark } = req.body;
    const importation_File = req.file?.path;

    if (!importation_File) {
      return res.status(400).send("No file uploaded");
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

    stream.on("data", (data) => {
      excelData.push(data);
    });

    stream.on("end", async () => {
      if (remark === "French Fichier Imported") {
        await processDossiers(excelData, creator, res, "French");
      } else if (remark === "Arabic Fichier Imported") {
        await processDossiers(excelData, creator, res, "Arabic");
      } else {
        res.status(400).send("Invalid remark provided");
      }
    });

    stream.on("error", (err) => {
      console.error("Error reading file:", err);
      res.status(500).send("Error reading file");
    });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).send("Server error");
  }
});

async function processDossiers(data, creator, res, language) {
  try {
    const dossiersCount = data.length;
    let dossierAddedCount = 0;
    let dossierUpdatedCount = 0;

    await Promise.all(
      data.map(async (dossier) => {
        const { num_dos } = extractDossierData(dossier, language);

        const existingDossier = await Dossier.findOne({ num_dos });

        if (existingDossier) {
          await updateExistingDossier(
            existingDossier,
            dossier,
            creator,
            language
          );
          dossierUpdatedCount++;
        } else {
          await createNewDossier(dossier, creator, language);
          dossierAddedCount++;
        }
      })
    );

    res.send(
      `${dossierAddedCount} added, and ${dossierUpdatedCount} updated of ${dossiersCount} dossiers.`
    );
  } catch (error) {
    console.error("Error processing dossiers:", error);
    res.status(500).send("Error processing dossiers");
  }
}

function extractDossierData(dossier, language) {
  // Extract fields from the dossier based on the language
  if (language === "French") {
    return {
      num_dos: dossier["Ref demande"],
      date_depo: dossier["Date demande"],
      nom_dem: dossier["Nom"],
      prenom_dem: dossier["Prenom"],
      gender_dem: dossier["sexe"],
      address: dossier["Adress"],
      num_act_dem: dossier["N°\nDE ACT"],
      num_conj: dossier["Nombre Conjoin"],
      date_n_dem: dossier["Date de naissance"],
      type_date_n_dem: dossier["Type date de naissance"],
      lieu_n_dem: dossier["Lieu de naissance"],
      prenom_p_dem: dossier["Prénom du pére"],
      prenom_m_dem: dossier["Prenom de la mére"],
      nom_m_dem: dossier["Nom de la mére"],
      stuation_f_dem: dossier["S F "],
      Ordre_conj: dossier["Ordre Conjoint"],
      prenom_conj: dossier["Prenom DE CONJOINT"],
      nom_conj: dossier["Nom DE CONJOINT"],
      num_act_conj: dossier["N DE L ACT"],
      type_date_n_conj: dossier["Type date de naissance_1"],
      date_n_conj: dossier["Date de naissance_1"],
      lieu_n_conj: dossier["Lieu de naissance_1"],
      prenom_p_conj: dossier["Prénom du pére_1"],
      prenom_m_conj: dossier["Prénom de la mére"],
      nom_m_conj: dossier["Nom de la mére_1"],
      note_revenue: dossier["Note Revenue"],
      note_habita: dossier["Note Habita"],
      note_situation_familiale: dossier["Note Situation Familiale"],
      note_anciennete: dossier["Note Anciennete"],
      notes: dossier["Notes"],
      remark: dossier["Remarque"],
    };
  } else if (language === "Arabic") {
    return {
      num_dos: dossier["رقـــم \nالملــــــف"],
      date_depo: dossier["تاريــــخ \nالايـــداع"],
      nom_dem: dossier["اللقــــب"],
      prenom_dem: dossier["الاســــم"],
      num_conj: dossier["عدد الزوجات"],
      lieu_n_dem: dossier["بلــدية الميــــلاد"],
      prenom_p_dem: dossier["اســــــــم الاب"],
      nom_m_dem: dossier["لقــــــب الام"],
      prenom_m_dem: dossier["اســــم الام"],
      Ordre_conj: dossier["ترتيب الزوجة"],
      prenom_conj: dossier["اســــم \nالـــزوج(ة)"],
      nom_conj: dossier["لقـــب الــزوج(ة)"],
      lieu_n_conj: dossier["بلـــدية ميــــــلاد الـــــــــــــزوج(ة)"],
      prenom_p_conj: dossier["اســـــــم أب الـــــزوج(ة)"],
      prenom_m_conj: dossier["اســم أم الـــــزوج (ة)"],
      nom_m_conj: dossier["لقـــب أم الــزوج(ة)"],
      notes: dossier["المجموع"],
      remark: dossier["الملاحظـــــــــــــــــــــــــــة"],
      gender_dem: dossier["الجنس"],
      address: dossier["العنـــــــــــــــــــــــــــــــــــــــــوان"],
      stuation_f: dossier["الحالة العائلية"],
      num_act_dem: dossier["رقـم عقد الميـــــلاد"],
      date_n_dem: dossier["تاريخ الميلاد"],
      type_date_n_dem: dossier["طبيعة تاريخ الميلاد"],
      num_act_conj: dossier["رقم عقد ميلاد الـــزوج(ة)"],
      date_n_conj: dossier["تاريـخ ميـــلاد\n الـــــــــزوج (ة)"],
      type_date_n_conj: dossier["طبيعة تاريخ ميلاد الزوج(ة)"],
      note_revenue: dossier["مستوى المداخيل"],
      note_habita: dossier["ظروف السكن"],
      note_situation_familiale: dossier["الحالة العائلية"],
      note_anciennete: dossier["أقدمية طلب السكن"],
    };
  }
}

async function updateExistingDossier(dossier, newData, creator, language) {
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
  } = extractDossierData(newData, language);

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
    demandeur.date_n =
      convertDateFormat(date_n_dem, "S").date || demandeur.date_n;
    demandeur.type_date_n = type_date_n_dem || demandeur.type_date_n;
    await demandeur.save();
  }

  // Update conjoin if exists
  if (
    !(nom_conj === "") &&
    !(nom_conj === "/") &&
    !(nom_conj == null) &&
    stuation_f_dem === ("M" || "V")
  ) {
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
          conjoin.date_n =
            convertDateFormat(date_n_conj, "S").date || conjoin.date_n;
          conjoin.type_date_n = type_date_n_conj || conjoin.type_date_n;

          await conjoin.save();
        }
      } else {
        //create Conjoin
        const conjoin = await createConjoin(dossier, language, creator);

        //add conjoin id
        dossier.id_conjoin[Ordre_conj - 1] = conjoin._id;
      }
    } else {
      //create Conjoin
      const conjoin = await createConjoin(dossier, language, creator);

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

  // Update dossier
  dossier.date_depo = date_depo || dossier.date_depo;

  dossier.num_conj = num_conj || dossier.num_conj;
  dossier.note_revenue = note_revenue || dossier.note_revenue;
  dossier.note_habita = note_habita || dossier.note_habita;
  dossier.note_situation_familiale =
    note_situation_familiale || dossier.note_situation_familiale;
  dossier.note_anciennete = note_anciennete || dossier.note_anciennete;
  dossier.notes = notes || dossier.notes;
  dossier.remark = remark || dossier.remark;

  await dossier.save();
}

async function createNewDossier(dossier, creator, language) {
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
        num_i_n: num_act_dem + " " + convertDateFormat(date_n_dem, "T").date,
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
        num_i_n: num_act_dem + " " + convertDateFormat(date_n_dem, "T").date,
        stuation_f: stuation_f_dem,
        situation_p: "",
        profession: "",
        salaire: "",
        creator,
      });
    }
  }
  var nb_conj = 0;
  if (num_conj) nb_conj = num_conj;
  else if (stuation_f_dem === "M" || "V") nb_conj = 1;

  var id_conjoin = [];
  if (
    !(nom_conj === "") &&
    !(nom_conj === "/") &&
    !(nom_conj == null) &&
    stuation_f_dem === ("M" || "V")
  ) {
    //create Conjoin
    const conjoin = await createConjoin(dossier, language, creator);

    // create id_conjoin table
    id_conjoin[Ordre_conj - 1] = conjoin._id;
  }
  // determine conjoin gender
  var gender_conj = "";
  if (gender_dem === "M") gender_conj = "F";
  else gender_conj = "M";

  await Dossier.create({
    creator,
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
}

async function createConjoin(dossier, language, creator) {
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
  } = extractDossierData(dossier, language);

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
        num_i_n: num_act_conj + " " + date_n_conj,
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
        num_i_n: num_act_conj + " " + date_n_conj,
        stuation_f: "",
        situation_p: "",
        profession: "",
        salaire: "",
        creator,
      });
  }

  return null;
}

module.exports = { updateDossiers };
