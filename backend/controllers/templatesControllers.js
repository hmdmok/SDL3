const getImportationFichierTemplate = (req, res) => {
  const { creator } = req.body;

  if (creator) {
    res.download("./sourceEnq/TemplateImportationFichier.xlsx");
  } else {
    res.status(400);
    throw new Error("لا توجد ملفات");
  }
};

module.exports = {
  getImportationFichierTemplate,
};
