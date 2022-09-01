const { Model } = require("objection");
require("objection");
const knex = require("../config/database");
Model.knex(knex);

class Alert extends Model {
	static tableName = "alerts";
}

module.exports = Alert;
