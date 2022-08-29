require("dotenv").config();
const express = require("express");
const app = express();
const router = require("./routes/route");
const bodyParser = require("body-parser");
const path = require("path");

process.env.TZ = "Europe/Amsterdam";

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

//parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", router);

app.listen(process.env.PORT, function () {
	console.log("slucha" + process.env.PORT);
});
