const { Model } = require("objection");
const knex = require("../config/database");
const Server = require("./Server");
Model.knex(knex);

class Title extends Model {
	static tableName = "titles";

	static relationMappings = {
		movies: {
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
}

module.exports = Title;
