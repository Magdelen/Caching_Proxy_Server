const express = require('express');
const axios = require('axios');
const cache = require('../services/cache');

const router = express.Router();

router.get('/proxy', async (req, res) => {
  const { url } = req.query;

  if (!url) return res.status(400).json({ error: "Missing `url` query param" });

  try {
    const cached = await cache.get(url);
    if (cached) {
      return res.json({ source: "cache", data: JSON.parse(cached) });
    }

    const response = await axios.get(url);
    await cache.set(url, JSON.stringify(response.data));
    return res.json({ source: "api", data: response.data });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

router.delete('/cache', async (req, res) => {
  const key = req.query.key;
  if (!key) return res.status(400).json({ error: "Missing cache key" });

  try {
    await cache.del(key);
    res.json({ message: `Cache for '${key}' invalidated.` });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete cache" });
  }
});
router.get('/cache/keys', async (req, res) => {
  const keys = await cache.getAllKeys();
  res.json(keys);
});

// GET TTL for a specific key
router.get('/cache/ttl', async (req, res) => {
  const key = req.query.key;
  if (!key) return res.status(400).json({ error: "Missing key" });
  const ttl = await cache.getTTL(key);
  res.json({ ttl });
});

module.exports = router;
