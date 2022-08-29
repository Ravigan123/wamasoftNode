const { Model } = require("objection");
require("objection");
const knex = require("../config/database");
Model.knex(knex);

class Quality extends Model {
	static tableName = "qualities";
}

module.exports = Quality;
