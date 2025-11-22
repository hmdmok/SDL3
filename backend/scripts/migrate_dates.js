const { connectDB } = require("../config/db");
const mongoose = require("mongoose");
const Person = require("../models/personModel");
const Dossier = require("../models/dossierModel");

// Simple date parser supporting common formats: yyyy-mm-dd, yyyy/mm/dd, dd/mm/yyyy, dd-mm-yyyy
function parseDateString(dateStr) {
  if (!dateStr) return null;
  const s = String(dateStr).trim();
  if (!s) return null;

  // ISO-like: 2021-05-21 or 2021/05/21
  const isoMatch = /^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/.test(s);
  if (isoMatch) {
    // Replace slashes with dashes to be safe
    const normalized = s.replace(/\//g, "-");
    const d = new Date(normalized);
    if (!isNaN(d.getTime())) return d;
  }

  // dd/mm/yyyy or dd-mm-yyyy
  const dmyMatch = /^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/.exec(s);
  if (dmyMatch) {
    const day = parseInt(dmyMatch[1], 10);
    const month = parseInt(dmyMatch[2], 10) - 1; // zero-based
    const year = parseInt(dmyMatch[3], 10);
    const d = new Date(year, month, day);
    if (!isNaN(d.getTime())) return d;
  }

  // fallback: try Date constructor
  const fallback = new Date(s);
  if (!isNaN(fallback.getTime())) return fallback;

  return null;
}

async function migratePersons() {
  console.log("Starting persons migration...");
  const cursor = Person.find().cursor();
  let count = 0;
  let updated = 0;
  for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
    count++;
    try {
      const dateStr = doc.date_n;
      const parsed = parseDateString(dateStr);
      if (parsed) {
        // only update if different
        if (!doc.date_n_dt || doc.date_n_dt.getTime() !== parsed.getTime()) {
          doc.date_n_dt = parsed;
          await doc.save();
          updated++;
        }
      }
    } catch (err) {
      console.error("Error migrating person", doc._id, err.message);
    }
  }
  console.log(`Persons processed: ${count}, updated: ${updated}`);
}

async function migrateDossiers() {
  console.log("Starting dossiers migration...");
  const cursor = Dossier.find().cursor();
  let count = 0;
  let updated = 0;
  for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
    count++;
    try {
      const dateStr = doc.date_depo;
      const parsed = parseDateString(dateStr);
      if (parsed) {
        if (
          !doc.date_depo_dt ||
          doc.date_depo_dt.getTime() !== parsed.getTime()
        ) {
          doc.date_depo_dt = parsed;
          await doc.save();
          updated++;
        }
      }
    } catch (err) {
      console.error("Error migrating dossier", doc._id, err.message);
    }
  }
  console.log(`Dossiers processed: ${count}, updated: ${updated}`);
}

async function run() {
  try {
    await connectDB();
    console.log("DB connected - starting migration");
    await migratePersons();
    await migrateDossiers();
    console.log("Migration finished");
    process.exit(0);
  } catch (err) {
    console.error("Migration failed", err);
    process.exit(1);
  }
}

run();
