const express = require("express");
const cors = require("cors");
const axios = require("axios");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
  res.status(200).send(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;

  const comments = commentsByPostId[req.params.id] || [];

  comments.push({ id: commentId, content, status: "pending" });

  commentsByPostId[req.params.id] = comments;

  await axios.post("http://event-bus-srv:2005/events", {
    type: "CommentCreated",
    data: { id: commentId, content, status: "pending", postId: req.params.id },
  });

  res.status(201).send(comments);
});

app.post("/events", async (req, res) => {
  const { type, data } = req.body;

  if (type === "CommentModerated") {
    const { id, postId, status } = data;

    const comments = commentsByPostId[postId];

    const commnt = comments.find((comment) => comment.id === id);
    commnt.status = status;

    await axios.post("http://event-bus-srv:2005/events", {
      type: "CommentUpdated",
      data: {
        ...commnt,
        postId,
      },
    });
  }

  res.send();
});

app.listen(1999, console.log("Listening on 1999"));
