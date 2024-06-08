const getImportationFichierTemplate = (req, res) => {
  const { creator, langue } = req.body;

  if (creator) {
    if (langue === "Ar")
      res.download(
        "./sourceEnq/Template-Ar.xlsx",
        "Template-hhhhhhhhhhhhhh-Ar.xlsx"
      );
    if (langue === "Fr")
      res.download(
        "./sourceEnq/Template-Fr.xlsx",
        "Template-hhhhhhhhhhhhhh-Fr.xlsx"
      );
  } else {
    res.status(400);
    throw new Error("لا توجد ملفات");
  }
};

module.exports = {
  getImportationFichierTemplate,
};
