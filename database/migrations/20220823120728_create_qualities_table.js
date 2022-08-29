/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
	return knex.schema.createTable("qualities", (table) => {
		table.increments("id").primary();
		table.integer("server_titles_id").unsigned().notNullable();
		table.foreign("server_titles_id").references("server_titles.id");
		table.dateTime("date").notNullable();
		table.integer("code").notNullable();
		table.integer("worth").notNullable();
		table.timestamps(false, true);
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
	return knex.schema.dropTableIfExists("qualities");
};
