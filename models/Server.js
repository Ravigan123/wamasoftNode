const { Model } = require("objection");
const knex = require("../config/database");
const Title = require("./Title");
const Alert = require("./Alert");
Model.knex(knex);

class Server extends Model {
	static tableName = "servers";

	static relationMappings = {
		titles: {
			relation: Model.ManyToManyRelation,
			modelClass: Title,
			join: {
				from: "servers.id",
				through: {
					// persons_movies is the join table.
					from: "server_titles.serverId",
					to: "server_titles.titleId",
				},
				to: "title.id",
			},
		},
	};
	static relationMappings = {
		alerts: {
			relation: Model.HasManyRelation,
			modelClass: Alert,
			join: {
				from: "server.id",
				to: "alerts.id_server",
			},
		},
	};
}

module.exports = Server;
