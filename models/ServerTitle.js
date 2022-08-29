const { Model } = require("objection");
const knex = require("../config/database");
const Title = require("./Title");
const Quality = require("./Quality");
Model.knex(knex);

class ServerTitle extends Model {
	static tableName = "server_titles";

	static relationMappings = {
		qualities: {
			relation: Model.HasManyRelation,
			modelClass: Quality,
			join: {
				from: "server_titles.id",
				to: "qualities.server_titles_id",
			},
		},
	};
}

module.exports = ServerTitle;
