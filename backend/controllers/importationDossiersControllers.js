const asyncHandler = require("express-async-handler");
const generateToken = require("../utils/generateToken");
const jwt = require("jsonwebtoken");
const Dossier = require("../models/dossierModel");
const person = require("../models/personModel");
const reader = require("xlsx");

const addDossiers = asyncHandler(async (req, res) => {
  const { creator, remark } = req.body;
  const importation_File = req.file?.path;
  console.log(importation_File);
  res.send(`${creator} , ${remark} `);
  // const file = reader.readFile("../Book1.xlsx", {
  //   dense: true,
  //   dateNF: "dd/mm/yyyy",
  // });

  // var excel_file;

  // // var work_book = reader.read(file, { type: "array", dateNF: "dd/mm/yyyy" });
  // var sheet_name = file.SheetNames;

  // var stream = reader.stream.to_json(file.Sheets[sheet_name[0]], {
  //   raw: false,
  // });

  // var excel_file = [];
  // stream.on("data", function (data) {
  //   excel_file.push(data);
  // });
  // stream.on("end", function () {
  //   const dossiersCount = excel_file.length;
  //   let dossierAddedCount = 0;

  //   excel_file?.map(
  //     asyncHandler(async (dossier) => {
  //       // extract demandeur

  //       const {
  //         Prenom: prenom_dem,
  //         Nom: nom_dem,
  //         sexe: gender_dem,
  //         "N°\r\nDE ACT": num_act_dem,
  //         "Date de naissance": date_n_dem,
  //         "Lieu de naissance": lieu_n_dem,
  //         "Prénom du pére": prenom_p_dem,
  //         "Prenom de la mére": prenom_m_dem,
  //         "Nom de la mére": nom_m_dem,
  //         "S F ": stuation_f_dem,

  //         "Prenom DE CONJOINT": prenom_conj,
  //         "Nom DE CONJOINT": nom_conj,
  //         "N DE L ACT": num_act_conj,
  //         "Date de naissance_1": date_n_conj,
  //         "Lieu de naissance_1": lieu_n_conj,
  //         "Prénom du pére_1": prenom_p_conj,
  //         "Prénom de la mére": prenom_m_conj,
  //         "Nom de la mére_1": nom_m_conj,

  //         "Ref demande": num_dos,
  //         "Date demande": date_depo,
  //       } = dossier;
  //       // check conjoin
  //       var conjoinCheked = false;
  //       var gender_conj = "";
  //       if (stuation_f_dem === "M" || "V") conjoinCheked = true;
  //       if (gender_dem === "M") gender_conj = "F";
  //       else gender_conj = "M";

  //       // add demandeur
  //       var conjoinAdded;
  //       const demandeurAdded = await person.create({
  //         type: "dema",
  //         prenom: "",
  //         prenom_fr: prenom_dem,
  //         nom: "",
  //         nom_fr: nom_dem,
  //         gender: gender_dem,
  //         num_act: num_act_dem,
  //         date_n: date_n_dem,
  //         lieu_n: "",
  //         lieu_n_fr: lieu_n_dem,
  //         wil_n: "",
  //         com_n: "",
  //         prenom_p: "",
  //         prenom_p_fr: prenom_p_dem,
  //         prenom_m: "",
  //         prenom_m_fr: prenom_m_dem,
  //         nom_m: "",
  //         nom_m_fr: nom_m_dem,
  //         num_i_n: num_act_dem + " " + date_n_dem,
  //         stuation_f: stuation_f_dem,
  //         situation_p: "",
  //         profession: "",
  //         salaire: "",
  //         creator,
  //       });
  //       // add conjoin if any
  //       if (conjoinCheked) {
  //         conjoinAdded = await person.create({
  //           type: "conj",
  //           prenom: "",
  //           prenom_fr: prenom_conj,
  //           nom: "",
  //           nom_fr: nom_conj,
  //           gender: gender_conj,
  //           num_act: num_act_conj,
  //           date_n: date_n_conj,
  //           lieu_n: "",
  //           lieu_n_fr: lieu_n_conj,
  //           wil_n: "",
  //           com_n: "",
  //           prenom_p: "",
  //           prenom_p_fr: prenom_p_conj,
  //           prenom_m: "",
  //           prenom_m_fr: prenom_m_conj,
  //           nom_m: "",
  //           nom_m_fr: nom_m_conj,
  //           num_i_n: num_act_conj + " " + date_n_conj,
  //           stuation_f: "",
  //           situation_p: "",
  //           profession: "",
  //           salaire: "",
  //           creator,
  //         });
  //       }
  //       // add dossier
  //       const dossierAdded = await Dossier.create({
  //         creator,
  //         id_demandeur: demandeurAdded?._id,
  //         id_conjoin: conjoinAdded?._id || "",
  //         date_depo,
  //         num_dos,
  //         num_enf: 0,
  //         stuation_s_avec_d: "",
  //         stuation_s_andicap: "",
  //         stuation_d: "",
  //         numb_p: 0,
  //         type: "imported",
  //         gender_conj,
  //         remark,
  //         saisi_conj: "imported",
  //         scan_dossier: "",
  //         notes: 0,
  //       });
  //       // add count dossier added
  //       dossierAddedCount++;
  //     })
  //   );

  //   res.send(dossierAddedCount + " added of " + dossiersCount);
  // });
});

const updateDossiersFran = asyncHandler(async (req, res) => {
  const file = reader.readFile("../Book1.xlsx", {
    dense: true,
    dateNF: "dd/mm/yyyy",
  });

  var excel_file;

  // var work_book = reader.read(file, { type: "array", dateNF: "dd/mm/yyyy" });
  var sheet_name = file.SheetNames;
  console.log(sheet_name);
  var stream = reader.stream.to_json(file.Sheets[sheet_name[2]], {
    raw: false,
  });

  var excel_file = [];
  stream.on("data", function (data) {
    excel_file.push(data);
  });

  stream.on("end", function () {
    const dossiersCount = excel_file.length;
    var dossierAddedCount = 0;
    var dossierUpdatededCount = 0;

    const dossiersMaped = excel_file?.map(
      asyncHandler(async (dossier) => {
        // // extract demandeur

        const {
          Prenom: prenom_dem,
          Nom: nom_dem,
          sexe: gender_dem,
          "N°\r\nDE ACT": num_act_dem,
          "Date de naissance": date_n_dem,
          "Lieu de naissance": lieu_n_dem,
          "Prénom du pére": prenom_p_dem,
          "Prenom de la mére": prenom_m_dem,
          "Nom de la mére": nom_m_dem,
          "S F ": stuation_f_dem,

          "Prenom DE CONJOINT": prenom_conj,
          "Nom DE CONJOINT": nom_conj,
          "N DE L ACT": num_act_conj,
          "Date de naissance_1": date_n_conj,
          "Lieu de naissance_1": lieu_n_conj,
          "Prénom du pére_1": prenom_p_conj,
          "Prénom de la mére": prenom_m_conj,
          "Nom de la mére_1": nom_m_conj,

          "Ref demande": num_dos,
          "Date demande": date_depo,
        } = dossier;

        console.log(dossier);

        // find dossier to update
        const dossierToUpdate = await Dossier.find({ num_dos: num_dos });
        if (dossierToUpdate.length > 0) {
          if (dossierToUpdate[0].id_demandeur) {
            // get demandeur
            const demandeurToUpdate = await person.findById(
              dossierToUpdate[0].id_demandeur
            );

            // update demandeur
            if (demandeurToUpdate._id) {
              demandeurToUpdate.prenom_fr =
                prenom_dem || demandeurToUpdate.prenom_fr;
              demandeurToUpdate.nom_fr = nom_dem || demandeurToUpdate.nom_fr;
              demandeurToUpdate.lieu_n_fr =
                lieu_n_dem || demandeurToUpdate.lieu_n_fr;
              demandeurToUpdate.prenom_p_fr =
                prenom_p_dem || demandeurToUpdate.prenom_p_fr;
              demandeurToUpdate.prenom_m_fr =
                prenom_m_dem || demandeurToUpdate.prenom_m_fr;
              demandeurToUpdate.nom_m_fr =
                nom_m_dem || demandeurToUpdate.nom_m_fr;
              const updatedDemandeur = await demandeurToUpdate.save();
            }
          }
          if (dossierToUpdate[0].id_conjoin) {
            // get conjoin
            const conjoinToUpdate = await person.findById(
              dossierToUpdate[0].id_conjoin
            );

            // update conjoin
            if (conjoinToUpdate._id) {
              conjoinToUpdate.prenom_fr =
                prenom_conj || conjoinToUpdate.prenom_fr;
              conjoinToUpdate.nom_fr = nom_conj || conjoinToUpdate.nom_fr;
              conjoinToUpdate.lieu_n_fr =
                lieu_n_conj || conjoinToUpdate.lieu_n_fr;
              conjoinToUpdate.prenom_p_fr =
                prenom_p_conj || conjoinToUpdate.prenom_p_fr;
              conjoinToUpdate.prenom_m_fr =
                prenom_m_conj || conjoinToUpdate.prenom_m_fr;
              conjoinToUpdate.nom_m_fr = nom_m_conj || conjoinToUpdate.nom_m_fr;
              const updatedConjoin = await conjoinToUpdate.save();
            }
          }

          dossierUpdatededCount++;
        } else {
          // check donnee valide
          var conjoinCheked = false;
          var gender_conj = "";

          if (gender_dem === "M") {
            gender_conj = "F";
          } else {
            gender_conj = "M";
          }
          if (stuation_f_dem === "M" || "V") {
            conjoinCheked = true;
          }

          // add demandeur
          var conjoinAdded;
          const demandeurAdded = await person.create({
            type: "dema",
            prenom_fr: prenom_dem,
            nom_fr: nom_dem,
            gender: gender_dem,
            num_act: num_act_dem,
            date_n: date_n_dem,
            lieu_n_fr: lieu_n_dem,
            prenom_p_fr: prenom_p_dem,
            prenom_m_fr: prenom_m_dem,
            nom_m_fr: nom_m_dem,
            num_i_n: num_act_dem + " " + date_n_dem,
            stuation_f: stuation_f_dem,
            creator: "test3",
          });

          // add conjoin if any
          if (conjoinCheked) {
            conjoinAdded = await person.create({
              type: "conj",
              prenom_fr: prenom_conj,
              nom_fr: nom_conj,
              gender: gender_conj,
              num_act: num_act_conj,
              date_n: date_n_conj,
              lieu_n_fr: lieu_n_conj,
              prenom_p_fr: prenom_p_conj,
              prenom_m_fr: prenom_m_conj,
              nom_m_fr: nom_m_conj,
              num_i_n: num_act_conj + " " + date_n_conj,
              creator: "test3",
            });
          }

          // add dossier
          const dossierAdded = await Dossier.create({
            creator: "test3",
            id_demandeur: demandeurAdded?._id,
            id_conjoin: conjoinAdded?._id || "",
            date_depo: date_depo,
            num_dos: num_dos,
            num_enf: 0,
            stuation_s_avec_d: "",
            stuation_s_andicap: "",
            stuation_d: "",
            numb_p: 0,
            type: "imported",
            gender_conj: gender_conj,
            remark: "imported",
            saisi_conj: "imported",
            scan_dossier: "",
            notes: "0",
          });

          // // add count dossier added
          dossierAddedCount++;
        }
      })
    );
    return Promise.all(dossiersMaped).then(() => {
      res.send(
        `${dossierUpdatededCount} updated and ${dossierAddedCount} added of ${dossiersCount}`
      );
    });
  });
});

const updateDossiers = asyncHandler(async (req, res) => {
  const file = reader.readFile("../Book1.xlsx", {
    dense: true,
    dateNF: "dd/mm/yyyy",
  });

  var excel_file;

  // var work_book = reader.read(file, { type: "array", dateNF: "dd/mm/yyyy" });
  var sheet_name = file.SheetNames;

  var stream = reader.stream.to_json(file.Sheets[sheet_name[1]], {
    raw: false,
  });

  var excel_file = [];
  stream.on("data", function (data) {
    excel_file.push(data);
  });

  stream.on("end", function () {
    const dossiersCount = excel_file.length;
    var dossierAddedCount = 0;
    var dossierUpdatededCount = 0;

    const dossiersMaped = excel_file?.map(
      asyncHandler(async (dossier) => {
        // // extract demandeur

        const {
          "رقـــم \r\nالملــــــف": num_dos,
          "تاريــــخ \r\nالايـــداع": date_depo,
          اللقــــب: nom_dem,
          الاســــم: prenom_dem,
          "بلــدية الميــــلاد": lieu_n_dem,
          "اســــــــم الاب": prenom_p_dem,
          "لقــــــب الام": nom_m_dem,
          "اســــم الام": prenom_m_dem,
          "اســــم \r\nالـــزوج(ة)": prenom_conj,
          "لقـــب الــزوج(ة)": nom_conj,
          "بلـــدية ميــــــلاد الـــــــــــــزوج(ة)": lieu_n_conj,
          "اســـــــم أب الـــــزوج(ة)": prenom_p_conj,
          "اســم أم الـــــزوج (ة)": prenom_m_conj,
          "لقـــب أم الــزوج(ة)": nom_m_conj,
          المجموع: notes,
          الملاحظـــــــــــــــــــــــــــة: remark,
          الجنس: gender,
          "الحالة العائلية": stuation_f,
          "رقـم عقد الميـــــلاد": num_act_dem,
          "تاريخ الميلاد": date_n_dem,
          "رقم عقد ميلاد الـــزوج(ة)": num_act_conj,
          "تاريـخ ميـــلاد\r\n الـــــــــزوج (ة)": date_n_conj,
        } = dossier;

        // find dossier to update
        const dossierToUpdate = await Dossier.find({ num_dos: num_dos });
        if (dossierToUpdate.length > 0) {
          if (dossierToUpdate[0].id_demandeur) {
            // get demandeur
            const demandeurToUpdate = await person.findById(
              dossierToUpdate[0].id_demandeur
            );

            // update demandeur
            if (demandeurToUpdate._id) {
              demandeurToUpdate.prenom = prenom_dem || demandeurToUpdate.prenom;
              demandeurToUpdate.nom = nom_dem || demandeurToUpdate.nom;
              demandeurToUpdate.lieu_n = lieu_n_dem || demandeurToUpdate.lieu_n;
              demandeurToUpdate.prenom_p =
                prenom_p_dem || demandeurToUpdate.prenom_p;
              demandeurToUpdate.prenom_m =
                prenom_m_dem || demandeurToUpdate.prenom_m;
              demandeurToUpdate.nom_m = nom_m_dem || demandeurToUpdate.nom_m;
              const updatedDemandeur = await demandeurToUpdate.save();
              console.log(updatedDemandeur);
            }
          }
          if (dossierToUpdate[0].id_conjoin) {
            // get conjoin
            const conjoinToUpdate = await person.findById(
              dossierToUpdate[0].id_conjoin
            );

            // update conjoin
            if (conjoinToUpdate._id) {
              conjoinToUpdate.prenom = prenom_conj || conjoinToUpdate.prenom;
              conjoinToUpdate.nom = nom_conj || conjoinToUpdate.nom;
              conjoinToUpdate.lieu_n = lieu_n_conj || conjoinToUpdate.lieu_n;
              conjoinToUpdate.prenom_p =
                prenom_p_conj || conjoinToUpdate.prenom_p;
              conjoinToUpdate.prenom_m =
                prenom_m_conj || conjoinToUpdate.prenom_m;
              conjoinToUpdate.nom_m = nom_m_conj || conjoinToUpdate.nom_m;
              const updatedConjoin = await conjoinToUpdate.save();
            }
          }

          // update dossier
          dossierToUpdate[0].notes = notes || dossierToUpdate[0].notes;
          dossierToUpdate[0].remark = remark || dossierToUpdate[0].remark;
          const updatedDossier = await dossierToUpdate[0].save();

          dossierUpdatededCount++;
        } else {
          // check donnee valide
          var conjoinCheked = false;
          var gender_conj = "";
          var gender_dem = "";
          var stuation_f_dem = "";

          if (gender === "ذكر") {
            gender_dem = "M";
            gender_conj = "F";
          } else {
            gender_dem = "F";
            gender_conj = "M";
          }
          if (stuation_f === "متزوج" || "متزوجة") {
            stuation_f_dem = "M";
            conjoinCheked = true;
          } else if (stuation_f === "أرملة") {
            stuation_f_dem = "V";
            conjoinCheked = true;
          } else if (stuation_f === "مطلقة") {
            stuation_f_dem = "D";
            conjoinCheked = false;
          } else if (stuation_f === "عزباء") {
            stuation_f_dem = "C";
            conjoinCheked = false;
          }

          // add demandeur
          var conjoinAdded;
          const demandeurAdded = await person.create({
            type: "dema",
            prenom: prenom_dem,
            prenom_fr: "",
            nom: nom_dem,
            nom_fr: "",
            gender: gender_dem,
            num_act: num_act_dem,
            date_n: date_n_dem,
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
            num_i_n: num_act_dem + " " + date_n_dem,
            stuation_f: stuation_f_dem,
            situation_p: "",
            profession: "",
            salaire: "",
            creator: "test3",
          });

          // add conjoin if any
          if (conjoinCheked) {
            conjoinAdded = await person.create({
              type: "conj",
              prenom: prenom_conj,
              prenom_fr: "",
              nom: nom_conj,
              nom_fr: "",
              gender: gender_conj,
              num_act: num_act_conj,
              date_n: date_n_conj,
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
              creator: "test3",
            });
          }

          // add dossier
          const dossierAdded = await Dossier.create({
            creator: "test3",
            id_demandeur: demandeurAdded?._id,
            id_conjoin: conjoinAdded?._id || "",
            date_depo: date_depo,
            num_dos: num_dos,
            num_enf: 0,
            stuation_s_avec_d: "",
            stuation_s_andicap: "",
            stuation_d: "",
            numb_p: 0,
            type: "imported",
            gender_conj: gender_conj,
            remark: remark,
            saisi_conj: "imported",
            scan_dossier: "",
            notes: notes,
          });

          // // add count dossier added
          dossierAddedCount++;
        }
      })
    );
    return Promise.all(dossiersMaped).then(() => {
      res.send(
        `${dossierUpdatededCount} updated and ${dossierAddedCount} added of ${dossiersCount}`
      );
    });
  });
});

module.exports = { addDossiers, updateDossiers, updateDossiersFran };
