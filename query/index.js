const express = require("express");
const cors = require("cors");
const axios = require("axios");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

const handleEvents = (type, data) => {
  if (type === "PostCreated") {
    const { id, title } = data;

    posts[id] = { id, title, comments: [] };
  }

  if (type === "CommentCreated") {
    const { id, content, status, postId } = data;

    const post = posts[postId];
    post.comments.push({ id, content, status });
  }

  if (type === "CommentUpdated") {
    const { id, content, status, postId } = data;
    const post = posts[postId];

    const commentIndex = post.comments.findIndex(
      (comment) => comment.id === id
    );

    post.comments[commentIndex] = { id, content, status };
  }
};

app.get("/posts", (req, res) => {
  res.status(200).send(posts);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;

  handleEvents(type, data);

  res.send();
});

app.listen(2000, async () => {
  console.log("Listening onn 2000");
  try {
    const res = await axios.get("http://event-bus-srv:2005/events");

    res.data.forEach(({ type, data }) => {
      console.log("processing");
      handleEvents(type, data);
    });
  } catch (error) {
    console.log(error);
  }
});
