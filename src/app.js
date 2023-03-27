const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();

app.use(morgan("common"));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/api/og", (req, res) => {
	if (!req.query.url) {
		res.status(400).json({
			status: "Bad Request",
			code: 400,
			data: { msg: "?url can't be empty" },
		});
	}

	axios
		.get(req.query.url)
		.then((html) => {
			const $ = cheerio.load(html.data);

			const image = $('meta[property="og:image"]').attr("content");
			const title = $('meta[property="og:title"]').attr("content");
			const description = $('meta[property="og:description"]').attr("content");

			res.status(200).json({
				status: "OK",
				code: 200,
				data: { og: { image, title, description } },
			});
		})
		.catch((e) => {
			res.status(400).json({
				status: "Bad Request",
				code: 400,
				data: { msg: "Can't parse the HTML from the given URL" },
			});
		});
});

const port = 8080 || process.env.PORT;

app.listen(port, () => {
	console.log(`Listen on port ${port}....`);
});
