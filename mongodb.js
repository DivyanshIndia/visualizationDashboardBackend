const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://lusizhao9:TrsQLkx6n1yPlwfD@stocksdata.wbsw5ht.mongodb.net/?retryWrites=true&w=majority&appName=stocksData";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    const db = client.db("crpto_data");
    const collection = db.collection("BTCUSD");
    const result = await collection.find({}).limit(50).toArray();
    console.log(result);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
