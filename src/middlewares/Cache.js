// src/middlewares/Cache
const redis = require("redis");

class Cache {
  constructor() {
    this.client = redis
      .createClient({
        host: process.env.REDIS_LINK,
        port: process.env.REDIS_PORT,
      })
      .on("connect", () => {
        console.info(
          "REDIS: Connected on",
          process.env.REDIS_LINK,
          process.env.REDIS_PORT
        );
      })
      .on("error", (err) => {
        console.error("REDIS: Error connecting:", err);
      })
      .on("close", (err) => {
        console.error("REDIS: Closed connection:", err);
      });
  }

  static getInstance() {
    if (!Cache.instance) {
      Cache.instance = new Cache();
    }
    return Cache.instance;
  }

  async connect() {
    return new Promise(async (resolve, reject) => {
      this.client.connect();
      this.client.once("connect", () => {
        console.info(
          "REDIS: Connected on:",
          process.env.REDIS_LINK,
          process.env.REDIS_PORT
        );
        resolve();
      });

      this.client.once("error", (err) => {
        reject(err);
      });
    });
  }

  session() {}

  get(key) {
    return async (req, res, next) => {
      const { userId = "" } = req.params;
      const redisId = key + userId;
      const data = await this.client.get(redisId);
      if (data !== null) {
        res.status(200).json(JSON.parse(data));
      } else {
        console.log(`REDIS: Error getting cache: ${key}`);
        next();
      }
    };
  }

  set(key, data, expirationInSeconds) {
    return async () => {
      const storedData = this.client.set(key, data, expirationInSeconds);
      if (!storedData) {
        console.error("REDIS: Storing cache error with id ${key}", err);
        next();
      } else {
        console.log(`REDIS: Stored cache: ${key}`);
        next();
      }
    };
  }
}

module.exports = Cache;
