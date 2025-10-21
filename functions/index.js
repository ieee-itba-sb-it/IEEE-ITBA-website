const { onRequest } = require("firebase-functions/v2/https");
const { spawn } = require("child_process");
const path = require("path");

exports.scrapeIeeextreme = onRequest((req, res) => {
  const scriptPath = path.join(__dirname, "scrapper", "ieeextreme_scraper.py");

  const process = spawn("python", [scriptPath]);

  let output = "";
  process.stdout.on("data", (data) => {
    output += data.toString();
  });

  process.stderr.on("data", (data) => {
    console.error(data.toString());
  });

  process.on("close", (code) => {
    if (code === 0) {
      res.status(200).send(`Scraper ejecutado correctamente:\n${output}`);
    } else {
      res.status(500).send(`Error ejecutando el scraper (code ${code})`);
    }
  });
});
