const asyncHandler = require("express-async-handler");
const dossier = require("../models/dossierModel");
const person = require("../models/personModel");
const system = require("../models/systemModel");
const generateToken = require("../utils/generateToken");
const { calculate } = require("./CalculeNotesDossier");
const {
  getFullDossier,
  sortByName,
  convertDateFormat,
  countParentKeyMatches,
  segregateBrothersLists,
  getSimilarityKey,
} = require("../config/functions");

const getDossiers = asyncHandler(async (req, res) => {
  const dossiers = await dossier.find();

  if (dossiers) res.json(dossiers);
  else {
    res.status(400);
    throw new Error("لا يوجد ملفات");
  }
});

const getDossierByNumDoss = asyncHandler(async (req, res) => {
  const id = req.params.num_dos.replace("-", "/");

  const photo_link = req.file?.path;

  const dossierById = await dossier.findOne({ num_dos: id });

  if (dossierById) {
    const personToUpdate = await person.findById(dossierById.id_demandeur);

    if (!personToUpdate) {
      res.status(400);
      throw new Error("هذا الشخص غير موجود");
    } else {
      personToUpdate.photo_link = photo_link;
      const updatedperson = await personToUpdate.save();
      res.status(201).json(updatedperson);
    }
  } else {
    res.status(400);
    throw new Error("الملف غير موجود");
  }
});

const getDossierById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const dossierById = await dossier.findById(id);
  if (dossierById) res.json(dossierById);
  else {
    res.status(400);
    throw new Error("الملف غير موجود");
  }
});

const getDossierByFilters = asyncHandler(async (req, res) => {
  try {
    const page = Number(req.query.page) - 1 || 0;
    const limit = Number(req.query.limit) || 20;
    const search = req.query.search || "";
    let Sort = req.query.sort || "notes";
    let fromDate = req.query.fromDate || "";
    let toDate = req.query.toDate || "";
    let p_m_35_dd = req.query.p_m_35_dd || "";
    let p_m_35_de = req.query.p_m_35_de || "";
    let stuation_f = req.query.stuation_f || "";

    // const {
    //   dossiersCount,
    //   numDoss,
    //   nomFr,
    //   prenomFr,
    //   birthDate,

    //   situationFamiliale,
    //   dateEtude,
    //   plusMoin35Value,
    // } = req.body;

    const dossierByNotes = await getFullDossier();

    var keyArray1 = dossierByNotes.map(function (item) {
      return {
        _id: item._id,
        num_dos: item.num_dos,
        date_depo: item.date_depo,
        notes: item.notes,
        demandeur: item["demandeur"],
      };
    });

    // filter by search
    var filterBySearch = keyArray1.filter(function (item) {
      return (
        item.num_dos?.toLowerCase().includes(search?.toLowerCase()) ||
        item.demandeur?.nom_fr?.toLowerCase().includes(search?.toLowerCase()) ||
        item.demandeur?.prenom_fr
          ?.toLowerCase()
          .includes(search?.toLowerCase()) ||
        item.demandeur?.nom?.toLowerCase().includes(search?.toLowerCase()) ||
        item.demandeur?.prenom?.toLowerCase().includes(search?.toLowerCase()) ||
        item.demandeur?.date_n?.toLowerCase().includes(search?.toLowerCase()) ||
        item.notes === parseInt(search?.toLowerCase())
      );
    });

    //filter by plus or moins 35 from date etude
    let p_m_35_de_value = {};
    p_m_35_de = p_m_35_de.split(",");
    p_m_35_de_value = {
      date_etude: p_m_35_de[0],
      type: p_m_35_de[1],
    };

    filterBySearch = filterBySearch.filter((dossier) => {
      if (p_m_35_de_value.type === "m") {
        return (
          new Date(
            convertDateFormat(dossier.demandeur?.date_n).jsDate
          ).getTime() >
          new Date(
            new Date(
              convertDateFormat(p_m_35_de_value.date_etude).jsDate
            ).getFullYear() - 35,
            new Date(
              convertDateFormat(p_m_35_de_value.date_etude).jsDate
            ).getMonth(),
            new Date(
              convertDateFormat(p_m_35_de_value.date_etude).jsDate
            ).getDate()
          ).getTime()
        );
      } else if (p_m_35_de_value.type === "p") {
        return (
          new Date(
            convertDateFormat(dossier.demandeur?.date_n).jsDate
          ).getTime() <=
          new Date(
            new Date(
              convertDateFormat(p_m_35_de_value.date_etude).jsDate
            ).getFullYear() - 35,
            new Date(
              convertDateFormat(p_m_35_de_value.date_etude).jsDate
            ).getMonth(),
            new Date(
              convertDateFormat(p_m_35_de_value.date_etude).jsDate
            ).getDate()
          ).getTime()
        );
      } else {
        return true;
      }
    });
    //filter by plus or moins 35 from date depo
    filterBySearch = filterBySearch.filter((dossier) => {
      if (p_m_35_dd === "m") {
        return (
          new Date(
            convertDateFormat(dossier.demandeur?.date_n).jsDate
          ).getTime() >
          new Date(
            new Date(
              convertDateFormat(dossier.date_depo).jsDate
            ).getFullYear() - 35,
            new Date(convertDateFormat(dossier.date_depo).jsDate).getMonth(),
            new Date(convertDateFormat(dossier.date_depo).jsDate).getDate()
          ).getTime()
        );
      } else if (p_m_35_dd === "p") {
        return (
          new Date(
            convertDateFormat(dossier.demandeur?.date_n).jsDate
          ).getTime() <=
          new Date(
            new Date(
              convertDateFormat(dossier.date_depo).jsDate
            ).getFullYear() - 35,
            new Date(convertDateFormat(dossier.date_depo).jsDate).getMonth(),
            new Date(convertDateFormat(dossier.date_depo).jsDate).getDate()
          ).getTime()
        );
      } else {
        return true;
      }
    });

    //filter by situation familial

    filterBySearch = filterBySearch.filter((dossier) => {
      if (stuation_f !== "")
        return dossier.demandeur?.stuation_f === stuation_f;
      else return true;
    });
    //filter by fromDate and toDate
    filterBySearch = filterBySearch.filter((dossier) => {
      let fdCheck = true;
      let tdCheck = true;

      if (fromDate !== "") {
        fdCheck = !(
          new Date(
            convertDateFormat(dossier.date_depo, "S").jsDate
          ).getTime() <=
          new Date(convertDateFormat(fromDate, "S").jsDate).getTime()
        );
      }
      if (toDate) {
        tdCheck = !(
          new Date(
            convertDateFormat(dossier.date_depo, "S").jsDate
          ).getTime() >=
          new Date(convertDateFormat(toDate, "S").jsDate).getTime()
        );
      }
      return fdCheck && tdCheck;
    });

    // Sort by methode
    let sort = {};
    Sort = Sort.split(",");
    if (Sort[1]) {
      sort.name = Sort[0];
      sort.type = Sort[1];
    } else {
      sort.name = Sort[0];
      sort.type = "desc";
    }
    switch (sort.name) {
      case "nom":
        filterBySearch = filterBySearch.sort(function (a, b) {
          return sortByName(a, b, "nom_fr", sort.type);
        });
        break;

      case "prenom":
        filterBySearch = filterBySearch.sort(function (a, b) {
          return sortByName(a, b, "prenom_fr", sort.type);
        });
        break;

      case "date_n":
        filterBySearch = filterBySearch.sort(function (a, b) {
          // Turn your strings into dates, and then subtract them
          // to get a value that is either negative, positive, or zero.
          if (sort.type === "asc") {
            return (
              new Date(
                convertDateFormat(b.demandeur.date_n, "S").jsDate
              ).getTime() -
              new Date(
                convertDateFormat(a.demandeur.date_n, "S").jsDate
              ).getTime()
            );
          } else if (sort.type === "desc") {
            return (
              new Date(
                convertDateFormat(a.demandeur.date_n, "S").jsDate
              ).getTime() -
              new Date(
                convertDateFormat(b.demandeur.date_n, "S").jsDate
              ).getTime()
            );
          }
        });
        break;

      case "date_depo":
        filterBySearch = filterBySearch.sort(function (a, b) {
          // Turn your strings into dates, and then subtract them
          // to get a value that is either negative, positive, or zero.
          if (sort.type === "asc") {
            return (
              new Date(convertDateFormat(a.date_depo, "S")?.jsDate).getTime() -
              new Date(convertDateFormat(b.date_depo, "S")?.jsDate).getTime()
            );
          } else if (sort.type === "desc") {
            return (
              new Date(convertDateFormat(b.date_depo, "S")?.jsDate).getTime() -
              new Date(convertDateFormat(a.date_depo, "S")?.jsDate).getTime()
            );
          }
        });
        break;

      case "notes":
        filterBySearch = filterBySearch.sort(function (a, b) {
          // Turn your strings into dates, and then subtract them
          // to get a value that is either negative, positive, or zero.
          if (sort.type === "asc") {
            return a.notes - b.notes;
          } else if (sort.type === "desc") {
            return b.notes - a.notes;
          }
          return b.notes - a.notes;
        });
        break;
    }

    // calculate total
    const total = filterBySearch.length;
    var totalArray = filterBySearch.map(function (item) {
      return {
        _id: item._id,
        num_dos: item.num_dos,
        date_depo: item.date_depo,
        notes: item.notes,
        demandeur: {
          nom_fr: item["demandeur"]?.nom_fr,
          prenom_fr: item["demandeur"]?.prenom_fr,
          date_n: item["demandeur"]?.date_n,
          stuation_f: item["demandeur"]?.stuation_f,
        },
      };
    });

    // Skip page * limit and limit
    filterBySearch = filterBySearch.filter((x, i) => {
      if (i > page * limit - 1 && i < page * limit + limit) {
        return true;
      }
    });

    var keyArray = filterBySearch.map(function (item) {
      return {
        _id: item._id,
        num_dos: item.num_dos,
        date_depo: item.date_depo,
        notes: item.notes,
        demandeur: {
          nom_fr: item["demandeur"]?.nom_fr,
          prenom_fr: item["demandeur"]?.prenom_fr,
          date_n: item["demandeur"]?.date_n,
          stuation_f: item["demandeur"]?.stuation_f,
        },
      };
    });

    // define the response
    const response = {
      error: false,
      total,
      page: page + 1,
      limit,
      data: keyArray,
      totalArray: totalArray,
    };

    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: "Internal Server Error2" });
    throw new Error(error.message);
  }
});

// New: paginated dossiers endpoint using aggregation and DB-side filtering
const getDossiersPaged = asyncHandler(async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 20, 1);
    const search = req.query.search?.trim() || "";
    const sortParam = req.query.sort || "notes,desc";

    const systemInfo = await system.findOne();
    // build match stage
    const match = { id_commune: systemInfo.communeCode };

    // build aggregation pipeline
    const pipeline = [];

    // initial match by commune
    pipeline.push({ $match: match });

    // allow client to skip expensive person lookups to speed up queries
    const includeDemandeur = req.query.includeDemandeur !== "false";

    // Determine if search contains alphabetic or Arabic characters — if it doesn't, it's likely numeric and
    // we can match `num_dos` early without performing lookups.
    const hasAlpha = /[A-Za-z\u00C0-\u017F\u0600-\u06FF]/.test(search);

    if (search && !hasAlpha) {
      // numeric-only search: match on num_dos early
      const regex = new RegExp(search, "i");
      pipeline.push({ $match: { num_dos: { $regex: regex } } });
    }

    // perform lookups only if the client requests them or we need to search by person fields
    const needLookup =
      includeDemandeur && (includeDemandeur === true || hasAlpha);
    if (needLookup) {
      // Prefer joins on ObjectId fields if we've migrated the collection.
      // This is much faster than converting strings to ObjectId in the lookup pipeline.
      const sample = await dossier
        .findOne({ id_commune: systemInfo.communeCode })
        .select("id_demandeur_obj id_conjoin_obj")
        .lean();
      if (
        sample &&
        (sample.id_demandeur_obj ||
          (Array.isArray(sample.id_conjoin_obj) &&
            sample.id_conjoin_obj.length > 0))
      ) {
        // lookup by ObjectId localField (fast index-backed join)
        pipeline.push({
          $lookup: {
            from: "people",
            localField: "id_demandeur_obj",
            foreignField: "_id",
            as: "demandeur",
          },
        });
        pipeline.push({
          $unwind: { path: "$demandeur", preserveNullAndEmptyArrays: true },
        });

        pipeline.push({
          $lookup: {
            from: "people",
            localField: "id_conjoin_obj",
            foreignField: "_id",
            as: "conjoin",
          },
        });
      } else {
        // fallback: lookup converting string ids to ObjectId per-document (slower)
        pipeline.push({
          $lookup: {
            from: "people",
            let: { id_dem: "$id_demandeur" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$_id", { $toObjectId: "$$id_dem" }] },
                },
              },
              {
                $project: {
                  _id: 1,
                  nom_fr: 1,
                  prenom_fr: 1,
                  nom: 1,
                  prenom: 1,
                  date_n: 1,
                  stuation_f: 1,
                },
              },
            ],
            as: "demandeur",
          },
        });
        pipeline.push({
          $unwind: { path: "$demandeur", preserveNullAndEmptyArrays: true },
        });

        pipeline.push({
          $lookup: {
            from: "people",
            let: { conjoinIds: "$id_conjoin" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $in: [
                      "$_id",
                      {
                        $map: {
                          input: "$$conjoinIds",
                          as: "c",
                          in: { $toObjectId: "$$c" },
                        },
                      },
                    ],
                  },
                },
              },
              {
                $project: {
                  _id: 1,
                  nom_fr: 1,
                  prenom_fr: 1,
                  nom: 1,
                  prenom: 1,
                },
              },
            ],
            as: "conjoin",
          },
        });
      }

      // If search contains alphabetic characters, match against name fields after lookup
      if (search && hasAlpha) {
        const regex = new RegExp(search, "i");
        pipeline.push({
          $match: {
            $or: [
              { "demandeur.nom_fr": { $regex: regex } },
              { "demandeur.prenom_fr": { $regex: regex } },
              { "demandeur.nom": { $regex: regex } },
              { "demandeur.prenom": { $regex: regex } },
            ],
          },
        });
      }
    } else {
      // If no lookup and search contains alpha, fall back to num_dos match (already handled above);
      // otherwise do nothing — results will be dossiers only.
    }

    // project only needed fields to reduce payload
    pipeline.push({
      $project: {
        num_dos: 1,
        date_depo: 1,
        notes: 1,
        remark: 1,
        id_demandeur: 1,
        id_conjoin: 1,
        demandeur: {
          _id: "$demandeur._id",
          nom_fr: "$demandeur.nom_fr",
          prenom_fr: "$demandeur.prenom_fr",
          nom: "$demandeur.nom",
          prenom: "$demandeur.prenom",
          date_n: "$demandeur.date_n",
          stuation_f: "$demandeur.stuation_f",
        },
        conjoin: {
          _id: "$conjoin._id",
          nom_fr: "$conjoin.nom_fr",
          prenom_fr: "$conjoin.prenom_fr",
        },
      },
    });

    // sort
    const [sortFieldRaw, sortDirRaw] = sortParam.split(",");
    const sortDir = sortDirRaw === "asc" ? 1 : -1;
    const sortFieldMap = {
      notes: "notes",
      date_depo: "date_depo",
      nom: "demandeur.nom_fr",
      prenom: "demandeur.prenom_fr",
    };
    const sortField = sortFieldMap[sortFieldRaw] || "notes";
    const sortStage = { $sort: { [sortField]: sortDir } };
    pipeline.push(sortStage);

    // facet for paged results + total
    pipeline.push({
      $facet: {
        metadata: [{ $count: "total" }],
        data: [{ $skip: (page - 1) * limit }, { $limit: limit }],
      },
    });

    const results = await dossier.aggregate(pipeline).allowDiskUse(true);

    const metadata =
      (results[0].metadata[0] && results[0].metadata[0].total) || 0;
    const data = results[0].data || [];

    // Ensure demandeur is always an object in returned documents
    const safeData = data.map((d) => ({ ...d, demandeur: d.demandeur || {} }));

    res.json({
      error: false,
      total: metadata,
      page,
      limit,
      totalPages: Math.ceil(metadata / limit),
      data: safeData,
    });
  } catch (error) {
    console.error("getDossiersPaged error:", error);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

const getDossierBrothersByFilters = asyncHandler(async (req, res) => {
  try {
    const page = Number(req.query.page) - 1 || 0;
    const limit = Number(req.query.limit) || 20;
    const search = req.query.search || "";
    let Sort = req.query.sort || "notes";
    let fromDate = req.query.fromDate || "";
    let toDate = req.query.toDate || "";
    let p_m_35_dd = req.query.p_m_35_dd || "";
    let p_m_35_de = req.query.p_m_35_de || "";
    let stuation_f = req.query.stuation_f || "";

    // const {
    //   dossiersCount,
    //   numDoss,
    //   nomFr,
    //   prenomFr,
    //   birthDate,

    //   situationFamiliale,
    //   dateEtude,
    //   plusMoin35Value,
    // } = req.body;

    const dossierByNotes = await getFullDossier();

    var keyArray2 = getSimilarityKey(dossierByNotes);

    // var keyArray1 = await keyArray2.map(function (item) {
    //   const demandeur = item.demandeur || {};
    //   const parentKeyMatches = countParentKeyMatches(item, keyArray2);
    //   // if (
    //   //   parentKeyMatches.totalFatherMatches > 0 ||
    //   //   parentKeyMatches.totalMotherMatches > 0
    //   // )
    //   return {
    //     _id: item._id,
    //     num_dos: item.num_dos,
    //     date_depo: item.date_depo,
    //     notes: item.notes,
    //     demandeur: {
    //       ...demandeur, // Spread existing demandeur properties
    //       numberOfFatherBrothers: parentKeyMatches.totalFatherMatches || 0,
    //       numberOfMotherBrothers: parentKeyMatches.totalMotherMatches || 0,
    //       listOfFatherBrothers: parentKeyMatches.fatherMatches || [],
    //       listOfMotherBrothers: parentKeyMatches.motherMatches || [],
    //     },
    //   };
    // });

    // Usage example
    const {
      stats,
      fatherBrothersList: fatherBrothersList,
      motherBrothersList: motherBrothersList,
    } = await segregateBrothersLists(keyArray2);

    // console.log("fatherBrothersList: ", fatherBrothersList[2].brothers);

    // filter by search
    var filterBySearch = keyArray2.filter(function (item) {
      return (
        item.num_dos?.toLowerCase().includes(search?.toLowerCase()) ||
        item.demandeur?.nom_fr?.toLowerCase().includes(search?.toLowerCase()) ||
        item.demandeur?.prenom_fr
          ?.toLowerCase()
          .includes(search?.toLowerCase()) ||
        item.demandeur?.nom?.toLowerCase().includes(search?.toLowerCase()) ||
        item.demandeur?.prenom?.toLowerCase().includes(search?.toLowerCase()) ||
        item.demandeur?.date_n?.toLowerCase().includes(search?.toLowerCase()) ||
        item.notes === parseInt(search?.toLowerCase())
      );
    });

    //filter by plus or moins 35 from date etude
    let p_m_35_de_value = {};
    p_m_35_de = p_m_35_de.split(",");
    p_m_35_de_value = {
      date_etude: p_m_35_de[0],
      type: p_m_35_de[1],
    };

    filterBySearch = filterBySearch.filter((dossier) => {
      if (p_m_35_de_value.type === "m") {
        return (
          new Date(
            convertDateFormat(dossier.demandeur?.date_n).jsDate
          ).getTime() >
          new Date(
            new Date(
              convertDateFormat(p_m_35_de_value.date_etude).jsDate
            ).getFullYear() - 35,
            new Date(
              convertDateFormat(p_m_35_de_value.date_etude).jsDate
            ).getMonth(),
            new Date(
              convertDateFormat(p_m_35_de_value.date_etude).jsDate
            ).getDate()
          ).getTime()
        );
      } else if (p_m_35_de_value.type === "p") {
        return (
          new Date(
            convertDateFormat(dossier.demandeur?.date_n).jsDate
          ).getTime() <=
          new Date(
            new Date(
              convertDateFormat(p_m_35_de_value.date_etude).jsDate
            ).getFullYear() - 35,
            new Date(
              convertDateFormat(p_m_35_de_value.date_etude).jsDate
            ).getMonth(),
            new Date(
              convertDateFormat(p_m_35_de_value.date_etude).jsDate
            ).getDate()
          ).getTime()
        );
      } else {
        return true;
      }
    });
    //filter by plus or moins 35 from date depo
    filterBySearch = filterBySearch.filter((dossier) => {
      if (p_m_35_dd === "m") {
        return (
          new Date(
            convertDateFormat(dossier.demandeur?.date_n).jsDate
          ).getTime() >
          new Date(
            new Date(
              convertDateFormat(dossier.date_depo).jsDate
            ).getFullYear() - 35,
            new Date(convertDateFormat(dossier.date_depo).jsDate).getMonth(),
            new Date(convertDateFormat(dossier.date_depo).jsDate).getDate()
          ).getTime()
        );
      } else if (p_m_35_dd === "p") {
        return (
          new Date(
            convertDateFormat(dossier.demandeur?.date_n).jsDate
          ).getTime() <=
          new Date(
            new Date(
              convertDateFormat(dossier.date_depo).jsDate
            ).getFullYear() - 35,
            new Date(convertDateFormat(dossier.date_depo).jsDate).getMonth(),
            new Date(convertDateFormat(dossier.date_depo).jsDate).getDate()
          ).getTime()
        );
      } else {
        return true;
      }
    });

    //filter by situation familial

    filterBySearch = filterBySearch.filter((dossier) => {
      if (stuation_f !== "")
        return dossier.demandeur?.stuation_f === stuation_f;
      else return true;
    });
    //filter by fromDate and toDate
    filterBySearch = filterBySearch.filter((dossier) => {
      let fdCheck = true;
      let tdCheck = true;

      if (fromDate !== "") {
        fdCheck = !(
          new Date(
            convertDateFormat(dossier.date_depo, "S").jsDate
          ).getTime() <=
          new Date(convertDateFormat(fromDate, "S").jsDate).getTime()
        );
      }
      if (toDate) {
        tdCheck = !(
          new Date(
            convertDateFormat(dossier.date_depo, "S").jsDate
          ).getTime() >=
          new Date(convertDateFormat(toDate, "S").jsDate).getTime()
        );
      }
      return fdCheck && tdCheck;
    });

    // Sort by methode
    let sort = {};
    Sort = Sort.split(",");
    if (Sort[1]) {
      sort.name = Sort[0];
      sort.type = Sort[1];
    } else {
      sort.name = Sort[0];
      sort.type = "desc";
    }
    switch (sort.name) {
      case "nom":
        filterBySearch = filterBySearch.sort(function (a, b) {
          return sortByName(a, b, "nom_fr", sort.type);
        });
        break;

      case "prenom":
        filterBySearch = filterBySearch.sort(function (a, b) {
          return sortByName(a, b, "prenom_fr", sort.type);
        });
        break;

      case "date_n":
        filterBySearch = filterBySearch.sort(function (a, b) {
          // Turn your strings into dates, and then subtract them
          // to get a value that is either negative, positive, or zero.
          if (sort.type === "asc") {
            return (
              new Date(
                convertDateFormat(b.demandeur.date_n, "S").jsDate
              ).getTime() -
              new Date(
                convertDateFormat(a.demandeur.date_n, "S").jsDate
              ).getTime()
            );
          } else if (sort.type === "desc") {
            return (
              new Date(
                convertDateFormat(a.demandeur.date_n, "S").jsDate
              ).getTime() -
              new Date(
                convertDateFormat(b.demandeur.date_n, "S").jsDate
              ).getTime()
            );
          }
        });
        break;

      case "date_depo":
        filterBySearch = filterBySearch.sort(function (a, b) {
          // Turn your strings into dates, and then subtract them
          // to get a value that is either negative, positive, or zero.
          if (sort.type === "asc") {
            return (
              new Date(convertDateFormat(a.date_depo, "S")?.jsDate).getTime() -
              new Date(convertDateFormat(b.date_depo, "S")?.jsDate).getTime()
            );
          } else if (sort.type === "desc") {
            return (
              new Date(convertDateFormat(b.date_depo, "S")?.jsDate).getTime() -
              new Date(convertDateFormat(a.date_depo, "S")?.jsDate).getTime()
            );
          }
        });
        break;

      case "notes":
        filterBySearch = filterBySearch.sort(function (a, b) {
          // Turn your strings into dates, and then subtract them
          // to get a value that is either negative, positive, or zero.
          if (sort.type === "asc") {
            return a.notes - b.notes;
          } else if (sort.type === "desc") {
            return b.notes - a.notes;
          }
          return b.notes - a.notes;
        });
        break;
      case "nombreBrotherF":
        filterBySearch = filterBySearch.sort(function (a, b) {
          // Turn your strings into dates, and then subtract them
          // to get a value that is either negative, positive, or zero.
          if (sort.type === "asc") {
            return (
              a.demandeur?.numberOfFatherBrothers -
              b.demandeur?.numberOfFatherBrothers
            );
          } else if (sort.type === "desc") {
            return (
              b.demandeur?.numberOfFatherBrothers -
              a.demandeur?.numberOfFatherBrothers
            );
          }
          return b.notes - a.notes;
        });
        break;
      case "nombreBrotherM":
        filterBySearch = filterBySearch.sort(function (a, b) {
          // Turn your strings into dates, and then subtract them
          // to get a value that is either negative, positive, or zero.
          if (sort.type === "asc") {
            return (
              a.demandeur?.numberOfMotherBrothers -
              b.demandeur?.numberOfMotherBrothers
            );
          } else if (sort.type === "desc") {
            return (
              b.demandeur?.numberOfMotherBrothers -
              a.demandeur?.numberOfMotherBrothers
            );
          }
          return b.notes - a.notes;
        });
        break;
    }

    // calculate total
    const total = filterBySearch.length;
    var totalArray = filterBySearch.map(function (item) {
      return {
        _id: item._id,
        num_dos: item.num_dos,
        date_depo: item.date_depo,
        notes: item.notes,
        demandeur: {
          nom_fr: item["demandeur"]?.nom_fr,
          prenom_fr: item["demandeur"]?.prenom_fr,
          date_n: item["demandeur"]?.date_n,
          stuation_f: item["demandeur"]?.stuation_f,
          prenom_p_fr: item["demandeur"]?.prenom_p_fr,
          prenom_m_fr: item["demandeur"]?.prenom_m_fr,
          nom_m_fr: item["demandeur"]?.nom_m_fr,
          totalFatherMatches: item["demandeur"]?.numberOfFatherBrothers,
          totalMotherMatches: item["demandeur"]?.numberOfMotherBrothers,
          listOfFatherBrothers: item["demandeur"]?.listOfFatherBrothers,
          listOfMotherBrothers: item["demandeur"]?.listOfMotherBrothers,
        },
      };
    });

    // Skip page * limit and limit
    filterBySearch = filterBySearch.filter((x, i) => {
      if (i > page * limit - 1 && i < page * limit + limit) {
        return true;
      }
    });

    // Skip page * limit and limit
    const motherBrothersList1 = motherBrothersList.filter((x, i) => {
      if (i > page * limit - 1 && i < page * limit + limit) {
        return true;
      }
    });

    // Skip page * limit and limit
    const fatherBrothersList1 = fatherBrothersList.filter((x, i) => {
      if (i > page * limit - 1 && i < page * limit + limit) {
        return true;
      }
    });

    var keyArray = filterBySearch.map(function (item) {
      return {
        _id: item._id,
        num_dos: item.num_dos,
        date_depo: item.date_depo,
        notes: item.notes,
        demandeur: {
          nom_fr: item["demandeur"]?.nom_fr,
          prenom_fr: item["demandeur"]?.prenom_fr,
          date_n: item["demandeur"]?.date_n,
          stuation_f: item["demandeur"]?.stuation_f,
          prenom_p_fr: item["demandeur"]?.prenom_p_fr,
          prenom_m_fr: item["demandeur"]?.prenom_m_fr,
          nom_m_fr: item["demandeur"]?.nom_m_fr,
          totalFatherMatches: item["demandeur"]?.numberOfFatherBrothers,
          totalMotherMatches: item["demandeur"]?.numberOfMotherBrothers,
          listOfFatherBrothers: item["demandeur"]?.listOfFatherBrothers,
          listOfMotherBrothers: item["demandeur"]?.listOfMotherBrothers,
        },
      };
    });

    // define the response
    const response = {
      error: false,
      total,
      page: page + 1,
      limit,
      data: keyArray,
      totalArray: totalArray,
      stats,
      fatherBrothersList: fatherBrothersList1,
      motherBrothersList: motherBrothersList1,
    };

    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: "Internal Server Error2" });
    throw new Error(error.message);
  }
});

// New: paginated brothers endpoint
const getDossierBrothersPaged = asyncHandler(async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 20, 1);
    const search = req.query.search || "";
    let Sort = req.query.sort || "notes";
    let fromDate = req.query.fromDate || "";
    let toDate = req.query.toDate || "";
    let p_m_35_dd = req.query.p_m_35_dd || "";
    let p_m_35_de = req.query.p_m_35_de || "";
    let stuation_f = req.query.stuation_f || "";

    const dossierByNotes = await getFullDossier();
    var keyArray2 = getSimilarityKey(dossierByNotes);

    const {
      stats,
      fatherBrothersList: fatherBrothersList,
      motherBrothersList: motherBrothersList,
    } = await segregateBrothersLists(keyArray2);

    // filter by search
    var filterBySearch = keyArray2.filter(function (item) {
      return (
        item.num_dos?.toLowerCase().includes(search?.toLowerCase()) ||
        item.demandeur?.nom_fr?.toLowerCase().includes(search?.toLowerCase()) ||
        item.demandeur?.prenom_fr
          ?.toLowerCase()
          .includes(search?.toLowerCase()) ||
        item.demandeur?.nom?.toLowerCase().includes(search?.toLowerCase()) ||
        item.demandeur?.prenom?.toLowerCase().includes(search?.toLowerCase()) ||
        item.demandeur?.date_n?.toLowerCase().includes(search?.toLowerCase()) ||
        item.notes === parseInt(search?.toLowerCase())
      );
    });

    // filter plus/minus 35 by dateEtude
    let p_m_35_de_value = {};
    p_m_35_de = p_m_35_de.split(",");
    p_m_35_de_value = {
      date_etude: p_m_35_de[0],
      type: p_m_35_de[1],
    };

    filterBySearch = filterBySearch.filter((dossier) => {
      if (p_m_35_de_value.type === "m") {
        return (
          new Date(
            convertDateFormat(dossier.demandeur?.date_n).jsDate
          ).getTime() >
          new Date(
            new Date(
              convertDateFormat(p_m_35_de_value.date_etude).jsDate
            ).getFullYear() - 35,
            new Date(
              convertDateFormat(p_m_35_de_value.date_etude).jsDate
            ).getMonth(),
            new Date(
              convertDateFormat(p_m_35_de_value.date_etude).jsDate
            ).getDate()
          ).getTime()
        );
      } else if (p_m_35_de_value.type === "p") {
        return (
          new Date(
            convertDateFormat(dossier.demandeur?.date_n).jsDate
          ).getTime() <=
          new Date(
            new Date(
              convertDateFormat(p_m_35_de_value.date_etude).jsDate
            ).getFullYear() - 35,
            new Date(
              convertDateFormat(p_m_35_de_value.date_etude).jsDate
            ).getMonth(),
            new Date(
              convertDateFormat(p_m_35_de_value.date_etude).jsDate
            ).getDate()
          ).getTime()
        );
      } else {
        return true;
      }
    });

    // filter plus/minus 35 by date_depo
    filterBySearch = filterBySearch.filter((dossier) => {
      if (p_m_35_dd === "m") {
        return (
          new Date(
            convertDateFormat(dossier.demandeur?.date_n).jsDate
          ).getTime() >
          new Date(
            new Date(
              convertDateFormat(dossier.date_depo).jsDate
            ).getFullYear() - 35,
            new Date(convertDateFormat(dossier.date_depo).jsDate).getMonth(),
            new Date(convertDateFormat(dossier.date_depo).jsDate).getDate()
          ).getTime()
        );
      } else if (p_m_35_dd === "p") {
        return (
          new Date(
            convertDateFormat(dossier.demandeur?.date_n).jsDate
          ).getTime() <=
          new Date(
            new Date(
              convertDateFormat(dossier.date_depo).jsDate
            ).getFullYear() - 35,
            new Date(convertDateFormat(dossier.date_depo).jsDate).getMonth(),
            new Date(convertDateFormat(dossier.date_depo).jsDate).getDate()
          ).getTime()
        );
      } else {
        return true;
      }
    });

    // filter by situation familiale
    filterBySearch = filterBySearch.filter((dossier) => {
      if (stuation_f !== "")
        return dossier.demandeur?.stuation_f === stuation_f;
      else return true;
    });

    // filter by fromDate and toDate
    filterBySearch = filterBySearch.filter((dossier) => {
      let fdCheck = true;
      let tdCheck = true;

      if (fromDate !== "") {
        fdCheck = !(
          new Date(
            convertDateFormat(dossier.date_depo, "S").jsDate
          ).getTime() <=
          new Date(convertDateFormat(fromDate, "S").jsDate).getTime()
        );
      }
      if (toDate) {
        tdCheck = !(
          new Date(
            convertDateFormat(dossier.date_depo, "S").jsDate
          ).getTime() >=
          new Date(convertDateFormat(toDate, "S").jsDate).getTime()
        );
      }
      return fdCheck && tdCheck;
    });

    // sorting
    let sort = {};
    Sort = Sort.split(",");
    if (Sort[1]) {
      sort.name = Sort[0];
      sort.type = Sort[1];
    } else {
      sort.name = Sort[0];
      sort.type = "desc";
    }
    switch (sort.name) {
      case "nom":
        filterBySearch = filterBySearch.sort(function (a, b) {
          return sortByName(a, b, "nom_fr", sort.type);
        });
        break;
      case "prenom":
        filterBySearch = filterBySearch.sort(function (a, b) {
          return sortByName(a, b, "prenom_fr", sort.type);
        });
        break;
      case "date_n":
        filterBySearch = filterBySearch.sort(function (a, b) {
          if (sort.type === "asc") {
            return (
              new Date(
                convertDateFormat(b.demandeur.date_n, "S").jsDate
              ).getTime() -
              new Date(
                convertDateFormat(a.demandeur.date_n, "S").jsDate
              ).getTime()
            );
          } else if (sort.type === "desc") {
            return (
              new Date(
                convertDateFormat(a.demandeur.date_n, "S").jsDate
              ).getTime() -
              new Date(
                convertDateFormat(b.demandeur.date_n, "S").jsDate
              ).getTime()
            );
          }
        });
        break;
      case "date_depo":
        filterBySearch = filterBySearch.sort(function (a, b) {
          if (sort.type === "asc") {
            return (
              new Date(convertDateFormat(a.date_depo, "S")?.jsDate).getTime() -
              new Date(convertDateFormat(b.date_depo, "S")?.jsDate).getTime()
            );
          } else if (sort.type === "desc") {
            return (
              new Date(convertDateFormat(b.date_depo, "S")?.jsDate).getTime() -
              new Date(convertDateFormat(a.date_depo, "S")?.jsDate).getTime()
            );
          }
        });
        break;
      case "notes":
        filterBySearch = filterBySearch.sort(function (a, b) {
          if (sort.type === "asc") {
            return a.notes - b.notes;
          } else if (sort.type === "desc") {
            return b.notes - a.notes;
          }
          return b.notes - a.notes;
        });
        break;
      case "nombreBrotherF":
        filterBySearch = filterBySearch.sort(function (a, b) {
          if (sort.type === "asc") {
            return (
              a.demandeur?.numberOfFatherBrothers -
              b.demandeur?.numberOfFatherBrothers
            );
          } else if (sort.type === "desc") {
            return (
              b.demandeur?.numberOfFatherBrothers -
              a.demandeur?.numberOfFatherBrothers
            );
          }
          return b.notes - a.notes;
        });
        break;
      case "nombreBrotherM":
        filterBySearch = filterBySearch.sort(function (a, b) {
          if (sort.type === "asc") {
            return (
              a.demandeur?.numberOfMotherBrothers -
              b.demandeur?.numberOfMotherBrothers
            );
          } else if (sort.type === "desc") {
            return (
              b.demandeur?.numberOfMotherBrothers -
              a.demandeur?.numberOfMotherBrothers
            );
          }
          return b.notes - a.notes;
        });
        break;
    }

    const total = filterBySearch.length;
    var totalArray = filterBySearch.map(function (item) {
      return {
        _id: item._id,
        num_dos: item.num_dos,
        date_depo: item.date_depo,
        notes: item.notes,
        demandeur: {
          nom_fr: item["demandeur"]?.nom_fr,
          prenom_fr: item["demandeur"]?.prenom_fr,
          date_n: item["demandeur"]?.date_n,
          stuation_f: item["demandeur"]?.stuation_f,
          prenom_p_fr: item["demandeur"]?.prenom_p_fr,
          prenom_m_fr: item["demandeur"]?.prenom_m_fr,
          nom_m_fr: item["demandeur"]?.nom_m_fr,
          totalFatherMatches: item["demandeur"]?.numberOfFatherBrothers,
          totalMotherMatches: item["demandeur"]?.numberOfMotherBrothers,
          listOfFatherBrothers: item["demandeur"]?.listOfFatherBrothers,
          listOfMotherBrothers: item["demandeur"]?.listOfMotherBrothers,
        },
      };
    });

    // paginate
    const start = (page - 1) * limit;
    const end = start + limit;
    const pagedFilter = filterBySearch.slice(start, end);
    const pagedFather = fatherBrothersList.slice(start, end);
    const pagedMother = motherBrothersList.slice(start, end);

    var keyArray = pagedFilter.map(function (item) {
      return {
        _id: item._id,
        num_dos: item.num_dos,
        date_depo: item.date_depo,
        notes: item.notes,
        demandeur: {
          nom_fr: item["demandeur"]?.nom_fr,
          prenom_fr: item["demandeur"]?.prenom_fr,
          date_n: item["demandeur"]?.date_n,
          stuation_f: item["demandeur"]?.stuation_f,
          prenom_p_fr: item["demandeur"]?.prenom_p_fr,
          prenom_m_fr: item["demandeur"]?.prenom_m_fr,
          nom_m_fr: item["demandeur"]?.nom_m_fr,
          totalFatherMatches: item["demandeur"]?.numberOfFatherBrothers,
          totalMotherMatches: item["demandeur"]?.numberOfMotherBrothers,
          listOfFatherBrothers: item["demandeur"]?.listOfFatherBrothers,
          listOfMotherBrothers: item["demandeur"]?.listOfMotherBrothers,
        },
      };
    });

    const response = {
      error: false,
      total,
      page,
      limit,
      data: keyArray,
      totalArray: totalArray,
      stats,
      fatherBrothersList: pagedFather,
      motherBrothersList: pagedMother,
    };

    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: "Internal Server Error" });
    throw new Error(error.message);
  }
});

const getDossierByBrothers = asyncHandler(async (req, res) => {
  try {
    const fullDossiers = await getFullDossier();

    // Create a map to group persons by their father's name, birth date, and birth location
    const groupedByFather = fullDossiers.reduce((acc, dossier) => {
      // Construct a unique key for the father based on name, birth date, and location
      const fatherKey = `${dossier["demandeur"]?.prenom_p_fr}_${dossier["demandeur"]?.nom_fr}`;

      if (!acc[fatherKey]) {
        acc[fatherKey] = [];
      }
      acc[fatherKey].push(dossier);
      return acc;
    }, {});

    // Convert the grouped data to an array of arrays (each array representing brothers)
    const groupedPersons = Object.values(groupedByFather);

    // Optionally, you can flatten the result into a single array if needed
    // Or return groupedPersons if you need them grouped.
    // define the response
    //  ###
    //  const response = {
    //   error: false,
    //   total,
    //   page: page + 1,
    //   limit,
    //   data: groupedPersons,
    //   totalArray: totalArray,
    // };

    // res.status(200).json(response);
    // ###
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: "Internal Server Error2" });
    throw new Error(error.message);
  }
});

const createDossier = asyncHandler(async (req, res) => {
  const {
    creator,
    id_demandeur,
    id_conjoin,
    date_depo,
    num_dos,
    adress,
    num_conj,
    note_revenue,
    note_habita,
    note_situation_familiale,
    note_anciennete,
    type,
    adress_fr,
    remark,
    saisi_conj,
    scan_dossier,
    notes,
  } = req.body;

  let dossierExists;
  num_dos && num_dos !== ""
    ? (dossierExists = await dossier.findOne({ num_dos: num_dos }))
    : (dossierExists = null);
  if (dossierExists) {
    res.status(400);
    throw new Error("هذا الملف موجود من قبل");
  }

  let conjoinExists;
  id_conjoin && id_conjoin?.length !== 0
    ? (conjoinExists = await id_conjoin.map(async (conjoin) => {
        return await dossier.findOne({ id_demandeur: conjoin });
      }))
    : (conjoinExists = null);
  if (conjoinExists?.length > 0) {
    res.status(400);
    throw new Error("الزوج(ة) يمتلك ملف من قبل");
  }

  let demandeurExists;
  id_demandeur && id_demandeur !== ""
    ? (demandeurExists = await dossier.findOne({ id_demandeur: id_demandeur }))
    : (demandeurExists = null);
  if (demandeurExists) {
    res.status(400);
    throw new Error("الشخص يمتلك ملف من قبل");
  }

  const systemInfo = await system.findOne();

  const dossierToAdd = await dossier.create({
    creator,
    id_commune: systemInfo.communeCode,
    id_demandeur,
    id_conjoin,
    date_depo,
    num_dos,
    adress,
    num_conj,
    note_revenue,
    note_habita,
    note_situation_familiale,
    note_anciennete,
    type,
    adress_fr,
    remark,
    saisi_conj,
    scan_dossier,
    notes,
  });

  if (dossierToAdd) {
    res.status(201).json({
      _id: dossierToAdd._id,
      token: generateToken(dossierToAdd._id),
    });
  } else {
    res.status(400);
    throw new Error("خطء في انشاء ملف جديد");
  }
});

const updateDossier = asyncHandler(async (req, res) => {
  const {
    creator,
    id_demandeur,
    id_conjoin,
    date_depo,
    num_dos,
    adress,
    num_conj,
    note_revenue,
    note_habita,
    note_situation_familiale,
    note_anciennete,
    type,
    adress_fr,
    remark,
    saisi_conj,
    scan_dossier,
    notes,
    id_commune,
  } = req.body;

  const id = req.params.id;
  const dossierToUpdate = await dossier.findById(id);
  const systemInfo = await system.findOne();

  if (!dossierToUpdate) {
    res.status(400);
    throw new Error("هذا الملف غير موجود");
  } else {
    dossierToUpdate.creator = creator || dossierToUpdate.creator;
    dossierToUpdate.id_demandeur = id_demandeur || dossierToUpdate.id_demandeur;
    dossierToUpdate.id_conjoin = id_conjoin || dossierToUpdate.id_conjoin;
    dossierToUpdate.date_depo = date_depo || dossierToUpdate.date_depo;
    dossierToUpdate.num_dos = num_dos || dossierToUpdate.num_dos;
    dossierToUpdate.adress = adress || dossierToUpdate.adress;
    dossierToUpdate.num_conj = num_conj || dossierToUpdate.num_conj;
    dossierToUpdate.note_revenue = note_revenue || dossierToUpdate.note_revenue;
    dossierToUpdate.note_habita = note_habita || dossierToUpdate.note_habita;
    dossierToUpdate.note_situation_familiale =
      note_situation_familiale || dossierToUpdate.note_situation_familiale;
    dossierToUpdate.type = type || dossierToUpdate.type;
    dossierToUpdate.adress_fr = adress_fr || dossierToUpdate.adress_fr;
    dossierToUpdate.note_anciennete =
      note_anciennete || dossierToUpdate.note_anciennete;
    dossierToUpdate.remark = remark || dossierToUpdate.remark;
    dossierToUpdate.saisi_conj = saisi_conj || dossierToUpdate.saisi_conj;
    dossierToUpdate.scan_dossier = scan_dossier || dossierToUpdate.scan_dossier;
    dossierToUpdate.notes = notes || dossierToUpdate.notes;
    dossierToUpdate.id_commune = id_commune || systemInfo.communeCode;

    const updatedDossier = await dossierToUpdate.save();
    res.status(201).json(updatedDossier);
  }
});

const deleteDossier = asyncHandler(async (req, res) => {
  const dossierId = req.params.id;
  const dossierData = await dossier.findById(dossierId);

  const personData = await person.findByIdAndDelete(dossierData.id_demandeur);

  let conjoinData = [];
  if (dossierData.id_conjoin.length > 0) {
    for (let i = 0; i < dossierData.id_conjoin.length; i++) {
      conjoinData[i] = await person.findByIdAndDelete(
        dossierData.id_conjoin[i]
      );
    }
  }

  await dossier.findByIdAndDelete(dossierId);
  if (!dossierData) {
    res.status(400);
    throw new Error("هذا الملف غير موجود");
  } else {
    //do somethink
    res.json({ message: "تم حذف الملف" });
  }
});

module.exports = {
  createDossier,
  getDossiers,
  getDossierById,
  updateDossier,
  deleteDossier,
  getDossierByFilters,
  getDossierByNumDoss,
  getDossierBrothersByFilters,
  getDossierBrothersPaged,
  getDossiersPaged,
};
