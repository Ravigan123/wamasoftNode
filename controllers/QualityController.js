const Server = require("../models/Server");
const Title = require("../models/Title");
const ServerTitle = require("../models/ServerTitle");
const Quality = require("../models/Quality");

class QualityController {
	async index(req, res) {
		res.render("index");
	}

	async show(req, res) {
		let checkTime = 0;
		let result = [];
		let dateTime = new Date().getTime();

		const timeMinus = new Date(dateTime - req.query["time"] * 60 * 1000);
		if (req.query["time"]) checkTime = 1;

		const servers = await Server.query()
			.select("name", "req_date")
			.orderBy("name");

		const titles = await Title.query().select("name_title");

		for (const server of servers) {
			if (checkTime == 1) {
				if (timeMinus < server.req_date)
					await addToShow(server, titles, result);
			} else await addToShow(server, titles, result);
		}
		res.render("list", { result: result });
	}

	async data(req, res) {
		if (!req.query.server)
			res.json({ Status: "Error", Message: "Podaj serwer" });

		const now = new Date().toLocaleString("se-SE", {
			timeZone: "Europe/Warsaw",
		});

		const requestString = JSON.stringify(req.query);

		const check_server = await Server.query()
			.select("*")
			.where("name", req.query.server);

		if (check_server.length == 0) {
			const newServer = await Server.query().insert({
				name: req.query.server,
				request: requestString,
				req_date: now,
			});
		} else {
			const serverUpdate = await Server.query()
				.patch({
					request: requestString,
					req_date: now,
				})
				.where("name", req.query["server"]);
		}

		let keys = [];
		for (var key in req.query) {
			if (key != "server") keys.push(key);
		}

		const checkTitle = await Title.query().select("name_title");

		let titles = [];

		for (const key of keys) {
			for (let i = 0; i < checkTitle.length; i++) {
				titles.push(checkTitle[i].name_title);
			}

			if (!titles.includes(key)) {
				const newTitle = await Title.query().insert({
					name_title: key,
				});
			}
			await save(key, req.query[key], req.query["server"], now);
		}
		res.json({ Status: "OK" });
	}
}

module.exports = new QualityController();

async function save(request_key, request_value, server_name, date) {
	let part = "";
	part = request_value.split(",");
	let tab = [];
	for (let i = 0; i < part.length; i++) {
		await createServerTitle(request_key, server_name);
		tab = [];
		const index = part[i].indexOf("-");
		const code = part[i].substring(0, index);
		tab.push(code);
		const value = part[i].substring(index + 1);
		tab.push(value);
		// await delay(100);
		await createQuality(request_key, server_name, tab, date);
	}
}

async function createServerTitle(request_key, server_name) {
	const getServerTitles = await Server.query()
		.select("server_titles.id")
		.innerJoin("server_titles", "servers.id", "server_titles.server_id")
		.innerJoin("titles", "server_titles.title_id", "titles.id")
		.where("titles.name_title", request_key)
		.where("servers.name", server_name);

	if (getServerTitles.length == 0) {
		const serverId = await Server.query()
			.select("id")
			.where("name", server_name);
		const titleId = await Title.query()
			.select("id")
			.where("name_title", request_key);

		const newServerTitle = await ServerTitle.query().insert({
			server_id: serverId[0].id,
			title_id: titleId[0].id,
		});
	}
}

function delay(milliseconds) {
	return new Promise((resolve) => {
		setTimeout(resolve, milliseconds);
	});
}

async function createQuality(request_key, server_name, tab, date) {
	const serverTitle = await Server.query()
		.select("server_titles.id")
		.innerJoin("server_titles", "servers.id", "server_titles.server_id")
		.innerJoin("titles", "server_titles.title_id", "titles.id")
		.where("titles.name_title", request_key)
		.where("servers.name", server_name);

	const newQuality = await Quality.query().insert({
		server_titles_id: serverTitle[0].id,
		date: date,
		code: tab[0],
		worth: tab[1],
	});
}

async function addToShow(server, titles, result) {
	const date = new Date(server.req_date).toLocaleString("se-SE", {
		timeZone: "Europe/Warsaw",
	});

	let tab = new Object();
	tab["server"] = server.name;
	tab["date"] = date;
	for (const title of titles) {
		const getServerTitles = await Server.query()
			.select("qualities.code", "qualities.worth")
			.innerJoin("server_titles", "servers.id", "server_titles.server_id")
			.innerJoin("titles", "server_titles.title_id", "titles.id")
			.innerJoin("qualities", "qualities.server_titles_id", "server_titles.id")
			.where("qualities.date", date)
			.where("servers.name", server.name)
			.where("titles.name_title", title.name_title);

		let value = "";
		if (getServerTitles.length != 0) {
			for (let i = 0; i < getServerTitles.length; i++) {
				value += getServerTitles[i].code;
				value += " - ";
				value += getServerTitles[i].worth;
				if (i != getServerTitles.length - 1) value += ", ";
			}
		}
		const nameTitle = title.name_title;
		tab[nameTitle] = value;
	}
	result.push(tab);
}
