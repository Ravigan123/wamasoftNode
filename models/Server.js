const { Model } = require("objection");
const knex = require("../config/database");
const Title = require("./Title");
Model.knex(knex);

class Server extends Model {
	static tableName = "servers";

	static relationMappings = {
		movies: {
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
}

module.exports = Server;
