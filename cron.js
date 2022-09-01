const cron = require("node-cron");
const http = require("http");
const Server = require("./models/Server");
const Alert = require("./models/Alert");

function Telegram(params) {
	cron.schedule("* * * * *", async function telegram(params) {
		const alerts = await Alert.query()
			.select(
				"alerts.id",
				"servers.name",
				"servers.req_date",
				"titles.name_title",
				"alerts.type",
				"alerts.action",
				"alerts.alert_worth",
				"alerts.telegram_user",
				"alerts.id_chat"
			)
			.innerJoin("servers", "servers.id", "alerts.id_server")
			.innerJoin("titles", "alerts.id_title", "titles.id");

		for (const alert of alerts) {
			const values = await Server.query()
				.select("qualities.code", "qualities.worth")
				.innerJoin("server_titles", "servers.id", "server_titles.server_id")
				.innerJoin("titles", "server_titles.title_id", "titles.id")
				.innerJoin(
					"qualities",
					"qualities.server_titles_id",
					"server_titles.id"
				)
				.where("qualities.date", alert.req_date)
				.where("servers.name", alert.name)
				.where("titles.name_title", alert.name_title);

			if (alert.action == "suma") {
				let suma = 0;
				for (const value of values) {
					suma += value.worth;
				}
				if (suma > alert.alert_worth) {
					const message =
						alert.name +
						" " +
						alert.name_title +
						": " +
						suma +
						" " +
						alert.type +
						" " +
						alert.alert_worth;

					let part = "";
					const str = alert.id_chat.replace(/\s/g, "");
					part = str.split(",");
					for (const chat of part) {
						http
							.get(
								"http://pikora.wamasof2.vot.pl/config/message?user=DOWOLNANAZWA&sender=" +
									alert.telegram_user +
									"&message=" +
									message +
									"&receiver=" +
									chat,
								async (resp) => {
									// const delAlert = await Alert.query().deleteById(alert.id);
								}
							)
							.on("error", (err) => {
								console.log("Error: " + err.message);
							});
					}
				}
			} else if (alert.action == "pojedynczo") {
				let flag = 0;
				let tab = "";
				const count = values.length;
				for (const value of values) {
					if (value.worth > alert.alert_worth) {
						tab += value.code;
						tab += " - ";
						tab += value.worth;
						tab += ", ";
						flag = 1;
					}
				}
				if (flag == 1) {
					const message =
						alert.name +
						" " +
						alert.name_title +
						": " +
						tab +
						" " +
						alert.type +
						" " +
						alert.alert_worth;

					let part = "";
					part = alert.id_chat.split(",");
					for (const chat of part) {
						http
							.get(
								"http://pikora.wamasof2.vot.pl/config/message?user=DOWOLNANAZWA&sender=" +
									alert.telegram_user +
									"&message=" +
									message +
									"&receiver=" +
									chat,
								async (resp) => {
									// const delAlert = await Alert.query().deleteById(alert.id);
								}
							)
							.on("error", (err) => {
								console.log("Error: " + err.message);
							});
					}
				}
			}
		}
	});
}

module.exports = Telegram();
