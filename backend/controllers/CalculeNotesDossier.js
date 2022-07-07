function calculate(
  dossier,
  salairDemandeur,
  salairConjoin,
  situationF,
  tableNote
) {
  let noteEnci1 = 0,
    noteEnci2 = 0,
    noteEnci3 = 0,
    noteEnci4 = 0,
    noteRev1 = 0,
    noteRev2 = 0,
    noteRev3 = 0,
    kidNote = 0,
    garageNote = 0,
    legem1Note = 0,
    legem2Note = 0,
    legem3Note = 0,
    locaNote = 0,
    foncNote = 0,
    no_celiNote = 0,
    celi_chNote = 0,
    patrNote = 0,
    endiNote = 0;
  let note = 0;

  const curentYear = new Date().getFullYear();
  const currentDate = new Date();
  let encienteDossier = 0,
    conditionHebergement = 0,
    situationFamiliale = 0,
    situationPersonele = 0,
    revenue = 0;

  tableNote.map((noteElement) => {
    if (noteElement.code === "rev1") {
      noteRev1 = parseInt(noteElement.notes);
    }
    if (noteElement.code === "rev2") {
      noteRev2 = parseInt(noteElement.notes);
    }
    if (noteElement.code === "rev3") {
      noteRev3 = parseInt(noteElement.notes);
    }
    if (noteElement.code === "enci1") {
      noteEnci1 = parseInt(noteElement.notes);
    }
    if (noteElement.code === "enci2") {
      noteEnci2 = parseInt(noteElement.notes);
    }
    if (noteElement.code === "enci3") {
      noteEnci3 = parseInt(noteElement.notes);
    }
    if (noteElement.code === "enci4") {
      noteEnci4 = parseInt(noteElement.notes);
    }

    if (noteElement.code === "enfant") {
      kidNote = parseInt(noteElement.notes);
    }

    if (noteElement.code === "garage") {
      garageNote = parseInt(noteElement.notes);
    }

    if (noteElement.code === "legem_1") {
      legem1Note = parseInt(noteElement.notes);
    }

    if (noteElement.code === "legem2") {
      legem2Note = parseInt(noteElement.notes);
    }
    if (noteElement.code === "legem_3") {
      legem2Note = parseInt(noteElement.notes);
    }
    if (noteElement.code === "loca") {
      locaNote = parseInt(noteElement.notes);
    }
    if (noteElement.code === "fonc") {
      foncNote = parseInt(noteElement.notes);
    }
    if (noteElement.code === "no_celi") {
      no_celiNote = parseInt(noteElement.notes);
    }
    if (noteElement.code === "celi_ch") {
      celi_chNote = parseInt(noteElement.notes);
    }
    if (noteElement.code === "patr") {
      patrNote = parseInt(noteElement.notes);
    }
    if (noteElement.code === "endi") {
      endiNote = parseInt(noteElement.notes);
    }
  });
  const enciAns = curentYear - parseInt(dossier.date_depo.split("-")[0]) || 0;

  if (enciAns >= 5 && enciAns < 8) {
    encienteDossier = noteEnci1;
  } else if (enciAns >= 8 && enciAns < 10) {
    encienteDossier = noteEnci2;
  } else if (enciAns >= 10 && enciAns < 15) {
    encienteDossier = noteEnci3;
  } else if (enciAns >= 15) {
    encienteDossier = noteEnci4;
  }

  const salairTotal = parseInt(salairDemandeur) + parseInt(salairConjoin) || 0;

  if (salairTotal <= 12000) {
    revenue = noteRev1;
  } else if (salairTotal > 12000 && salairTotal <= 18000) {
    revenue = noteRev2;
  } else if (salairTotal > 18000 && salairTotal <= 24000) {
    revenue = noteRev3;
  }

  if (dossier.stuation_d === "garage") {
    conditionHebergement = garageNote;
  } else if (dossier.stuation_d === "legem_1") {
    conditionHebergement = legem1Note;
  } else if (dossier.stuation_d === "legem2") {
    conditionHebergement = legem2Note;
  } else if (dossier.stuation_d === "legem_3") {
    conditionHebergement = legem3Note;
  } else if (dossier.stuation_d === "loca") {
    conditionHebergement = locaNote;
  } else if (dossier.stuation_d === "fonc") {
    conditionHebergement = foncNote;
  }

  let numb_p = parseInt(dossier.numb_p) || 0,
    num_enf = parseInt(dossier.num_enf) || 0;

  if (situationF === "m") {
    situationFamiliale += 10;
  } else if (numb_p > 0) {
    situationFamiliale += 8;
  }
  if ((numb_p + num_enf) * kidNote > 8) {
    situationFamiliale += 8;
  } else {
    situationFamiliale += (num_enf + numb_p) * kidNote;
  }

  if (dossier.stuation_s_avec_d.toString() === "true") {
    situationPersonele += 30;
  }

  if (dossier.stuation_s_andicap.toString() === "true") {
    situationPersonele += 30;
  }

  note =
    encienteDossier +
    conditionHebergement +
    situationFamiliale +
    situationPersonele +
    revenue;

  return note;
}

module.exports = { calculate };
