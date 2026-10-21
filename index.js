
const mineflayer = require("mineflayer");
const express = require("express");

const app = express();
app.use(express.json());

let bot;
let status = "Offline";

app.get("/", (req, res) => {
  res.send("Project Sathaxu is running! Status: " + status);
});

app.get("/status", (req, res) => {
  res.json({ name: "Sathaxu", status });
});

app.post("/start", (req, res) => {
  if (bot) {
    return res.send("Sathaxu already started.");
  }

  const host = process.env.SERVER_HOST;
  const port = Number(process.env.SERVER_PORT || 25565);

  if (!host) {
    return res.status(400).send("Set SERVER_HOST first.");
  }

  status = "Connecting";

  try {
    bot = mineflayer.createBot({
      host,
      port,
      username: process.env.BOT_USERNAME || "Sathaxu",
      version: false
    });

    bot.once("spawn", () => {
      status = "Online";
      console.log("Sathaxu joined the server!");
      bot.chat("Hello! Mu Sathaxu 🤖");
    });

    bot.on("end", () => {
      status = "Offline";
      bot = null;
    });

    bot.on("error", (err) => {
      status = "Error: " + err.message;
      console.log(status);
    });
  } catch (err) {
    status = "Error: " + err.message;
    bot = null;
  }

  res.send("Sathaxu connection started.");
});

app.post("/stop", (req, res) => {
  if (bot) bot.quit("Stopped by owner");
  bot = null;
  status = "Offline";
  res.send("Sathaxu stopped.");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Sathaxu dashboard ready");
});
