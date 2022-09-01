const express = require("express");
const router = express.Router();
const QualityController = require("../controllers/QualityController");
const AlertController = require("../controllers/AlertController");

router.get("/", QualityController.index);
router.get("/list-html", QualityController.show);
router.get("/data", QualityController.data);
router.get("/alert", AlertController.show);
router.get("/alert/create", AlertController.create);
router.post("/alert/store", AlertController.store);
router.get("/alert/edit/:id", AlertController.edit);
router.post("/alert/update/:id", AlertController.update);
router.get("/alert/delete/:id", AlertController.delete);

module.exports = router;
