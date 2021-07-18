const express = require("express");
const cors = require("cors");
const axios = require("axios");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post("/events", async (req, res) => {
  const { type, data } = req.body;

  if (type === "CommentCreated") {
    const status = data.content.toLowerCase().includes("orange")
      ? "rejected"
      : "approved";

    await axios.post("http://event-bus-srv:2005/events", {
      type: "CommentModerated",
      data: { ...data, status },
    });
  }

  res.send();
});

app.listen(2001, console.log("Listening on 2001"));
