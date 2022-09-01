const { Model } = require("objection");
const knex = require("../config/database");
const Server = require("./Server");
const Alert = require("./Alert");
Model.knex(knex);

class Title extends Model {
	static tableName = "titles";

	static relationMappings = {
		servers: {
			relation: Model.ManyToManyRelation,
			modelClass: Server,
			join: {
				from: "title.id",
				through: {
					// persons_movies is the join table.
					from: "server_titles.serverId",
					to: "server_titles.titleId",
				},
				to: "server.id",
			},
		},
	};
	static relationMappings = {
		alerts: {
			relation: Model.HasManyRelation,
			modelClass: Alert,
			join: {
				from: "titles.id",
				to: "alerts.id_title",
			},
		},
	};
}

module.exports = Title;
