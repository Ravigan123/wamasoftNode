const express = require("express");
const router = express.Router();
const QualityController = require("../controllers/QualityController");

router.get("/", QualityController.index);
router.get("/list-html", QualityController.show);
router.get("/data", QualityController.data);

module.exports = router;
