const mongoose = require("mongoose");
const { connectDB } = require("../config/db");
const Dossier = require("../models/dossierModel");

async function run() {
  await connectDB();

  console.log(
    "Starting conversion of id_demandeur/id_conjoin to ObjectId fields..."
  );

  const cursor = Dossier.find().cursor();
  let processed = 0;
  let updated = 0;

  for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
    processed++;
    const updates = {};

    try {
      // convert id_demandeur
      if (
        doc.id_demandeur &&
        typeof doc.id_demandeur === "string" &&
        doc.id_demandeur.length === 24
      ) {
        updates.id_demandeur_obj = mongoose.Types.ObjectId(doc.id_demandeur);
      }

      // convert id_conjoin array
      if (Array.isArray(doc.id_conjoin) && doc.id_conjoin.length > 0) {
        const mapped = doc.id_conjoin
          .filter((s) => typeof s === "string" && s.length === 24)
          .map((s) => mongoose.Types.ObjectId(s));
        updates.id_conjoin_obj = mapped;
      }

      if (Object.keys(updates).length > 0) {
        await Dossier.updateOne({ _id: doc._id }, { $set: updates });
        updated++;
      }
    } catch (err) {
      console.error("Error converting doc", doc._id, err.message);
    }
  }

  console.log(`Processed: ${processed}, Updated: ${updated}`);
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
