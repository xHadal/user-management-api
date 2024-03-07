// src/server.js
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 4000;
const UserRoutes = require("./routes/UserRoutes");
const dbInit = require("./dbInit");
const Cache = require("./middlewares/Cache");

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("maxSockets", 1000);

dbInit().then(async () => {
  const redisCache = Cache.getInstance();
  await redisCache.connect().then(() => {
    const routes = UserRoutes.getInstance();
    app.use("/api/users", routes.getUsersRouter());
  });
});

app.listen(port, () => {
  console.info(`SERVER: listening in port ${port}`);
});

/* import { createServer } from 'node:http';
import { client } from './redis.js';

createServer(async (req, res) => {
  try {
    res.end(await client.get('key'));
  } catch (err) {
    console.error(err);
    res.end('Internal Server Error');
  }
}).listen(3000);
 import cors from 'cors';
const corsConfig = {
  origin: process.env.CORS_ORIGIN
}
app.use(cors(corsConfig)) import cors from 'cors';
const corsConfig = {
  origin: process.env.CORS_ORIGIN
}
app.use(cors(corsConfig)) */
