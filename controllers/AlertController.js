const Server = require("../models/Server");
const Title = require("../models/Title");
const Alert = require("../models/Alert");

class AlertController {
	async show(req, res) {
		const alerts = await Alert.query()
			.select(
				"alerts.id",
				"servers.name",
				"titles.name_title",
				"alerts.type",
				"alerts.action",
				"alerts.alert_worth",
				"alerts.telegram_user",
				"alerts.id_chat"
			)
			.innerJoin("servers", "servers.id", "alerts.id_server")
			.innerJoin("titles", "alerts.id_title", "titles.id");
		res.render("alert-show", { alerts: alerts });
	}

	async create(req, res) {
		const servers = await Server.query().select("id", "name");
		const titles = await Title.query().select("id", "name_title");
		res.render("alert-store", { servers: servers, titles: titles });
	}
	async store(req, res) {
		try {
			if (req.body["worth"] == "") throw new Error("empty value");
			if (req.body["user"] == "") throw new Error("empty user");
			if (req.body["chat"] == "") throw new Error("empty chat");
			const newAlert = await Alert.query().insert({
				id_server: req.body["server"],
				id_title: req.body["title"],
				type: req.body["type"],
				action: req.body["action"],
				alert_worth: req.body["worth"],
				telegram_user: req.body["user"],
				id_chat: req.body["chat"],
			});
			res.redirect("/alert");
		} catch (error) {
			const servers = await Server.query().select("id", "name");
			const titles = await Title.query().select("id", "name_title");
			const er = "Podaj Poprawne dane";
			res.render("alert-store", { servers: servers, titles: titles, er: er });
		}
	}
	async edit(req, res) {
		const idAlert = req.params["id"];
		const alerts = await Alert.query()
			.select(
				"alerts.id",
				"alerts.id_server",
				"servers.name",
				"alerts.id_title",
				"titles.name_title",
				"alerts.type",
				"alerts.action",
				"alerts.alert_worth",
				"alerts.telegram_user",
				"alerts.id_chat"
			)
			.innerJoin("servers", "servers.id", "alerts.id_server")
			.innerJoin("titles", "alerts.id_title", "titles.id")
			.where("alerts.id", req.params["id"]);
		const servers = await Server.query().select("id", "name");
		const titles = await Title.query().select("id", "name_title");
		res.render("alert-edit", {
			alerts: alerts,
			servers: servers,
			titles: titles,
			idAlert: idAlert,
		});
	}
	async update(req, res) {
		const updateAlert = await Alert.query().findById(req.params["id"]).patch({
			id_server: req.body["server"],
			id_title: req.body["title"],
			type: req.body["type"],
			action: req.body["action"],
			alert_worth: req.body["worth"],
			telegram_user: req.body["user"],
			id_chat: req.body["chat"],
		});
		res.redirect("/alert");
	}
	async delete(req, res) {
		const delAlert = await Alert.query().deleteById(req.params["id"]);
		res.redirect("/alert");
	}
}

module.exports = new AlertController();
