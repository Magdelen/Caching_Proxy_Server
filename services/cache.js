const redis = require("redis");
const client = redis.createClient({ url: process.env.REDIS_URL });

client.connect();

client.on("error", err => console.error("Redis Error:", err));

module.exports = {
  async get(key) {
    return await client.get(key);
  },
  async set(key, value, ttl = process.env.CACHE_TTL) {
    await client.setEx(key, ttl, value);
  },
  async del(key) {
    await client.del(key);
  },
    async getAllKeys() {
    return await client.keys('*');
  },
  async getTTL(key) {
    return await client.ttl(key);
  },
    incrementHit: async (key) => {
    await client.incr(getHitKey(key));
  },

  incrementMiss: async (key) => {
    await client.incr(getMissKey(key));
  },

  getStats: async (key) => {
    const [hits, misses] = await Promise.all([
      client.get(getHitKey(key)),
      client.get(getMissKey(key))
    ]);

    return {
      hits: parseInt(hits) || 0,
      misses: parseInt(misses) || 0
    };
  }
};
