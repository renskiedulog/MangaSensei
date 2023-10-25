const express = require("express");
const axios = require("axios");
const app = express();
const port = 4000; // Choose a port for your proxy server

const mangaDexApiBaseUrl = "https://api.mangadex.org";

// Enable CORS on your proxy server to allow requests from your front-end
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get("/proxy", async (req, res) => {
  try {
    const { endpoint } = req.query;
    console.log("Received request for endpoint:", endpoint); // Add this line
    const response = await axios.get(`${mangaDexApiBaseUrl}${endpoint}`);
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while making the request." });
  }
});

app.listen(port, () => {
  console.log(`Proxy server is running on port ${port}`);
});
