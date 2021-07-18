const express = require("express");
const cors = require("cors");
const axios = require("axios");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const events = [{}];

app.post("/events", (req, res) => {
  const event = req.body;
  events.push(event);

  axios.post("http://posts-clusterip-srv:1998/events", event).catch((err) => {
    console.log(err);
  });
  axios.post("http://comments-srv:1999/events", event).catch((err) => {
    console.log(err);
  });
  axios.post("http://query-srv:2000/events", event).catch((err) => {
    console.log(err);
  });
  axios.post("http://moderation-srv:2001/events", event).catch((err) => {
    console.log(err);
  });

  res.status(200).send({ status: "ok" });
});

app.get("/events", (req, res) => {
  res.send(events);
});

app.listen(2005, console.log("Listening on 2005"));
