/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
	return knex.schema.createTable("server_titles", (table) => {
		table.increments("id").primary();
		table.integer("server_id").unsigned().notNullable();
		table.foreign("server_id").references("servers.id");
		table.integer("title_id").unsigned().notNullable();
		table.foreign("title_id").references("titles.id");
		table.timestamps(false, true);
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
	return knex.schema.dropTableIfExists("server_titles");
};
