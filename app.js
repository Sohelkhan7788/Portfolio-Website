const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
const uri = "mongodb://localhost:27017"; // <--- change this if you're using MongoDB Atlas
const client = new MongoClient(uri);

let contactCollection;

async function connectDB() {
  try {
    await client.connect();
    const db = client.db("portfolio");
    contactCollection = db.collection("contact_form");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

// Test route
app.get("/", (req, res) => {
  res.send("Portfolio Backend Running");
});

// Contact form endpoint
app.post("/contact", async (req, res) => {
  const data = req.body;
  try {
    await contactCollection.insertOne(data);
    res.status(200).json({ message: "Your message has been sent successfully" });
  } catch (error) {
    console.error("Insert error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});
