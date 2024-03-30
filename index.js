const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

const port = 8080;
const uri = process.env.MONGODB_URI;

// Connect to MongoDB
const connectToMongoDB = async () => {
  try {
    const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    await client.connect();
    const db = client.db("crpto_data");
    console.log("Connected to MongoDB");

    return db;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

// Define routes
const defineRoutes = (db) => {
  app.get("/", (req, res) => {
    res
      .status(200)
      .send("Crypto Data server is connected to your frontend application!");
  });

  app.get("/btcusd", async (req, res) => {
    try {
      const collection = db.collection("BTCUSD");
      const data = await collection.find({}).toArray();
      if (data.length === 0) {
        res.status(404).json({ message: "No data found for BTCUSD" });
      } else {
        res.status(200).json(data);
      }
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/eurusd", async (req, res) => {
    try {
      const collection = db.collection("EURUSD");
      const data = await collection.find({}).toArray();
      if (data.length === 0) {
        res.status(404).json({ message: "No data found for EURUSD" });
      } else {
        res.status(200).json(data);
      }
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });
};

// Start server
const startServer = async () => {
  try {
    const db = await connectToMongoDB();
    defineRoutes(db);
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Server startup error:", error);
    process.exit(1);
  }
};

startServer();

// Handle MongoDB disconnection on app termination
process.on("SIGINT", () => {
  client.close().then(() => {
    console.log("MongoDB disconnected on app termination");
    process.exit(0);
  });
});
