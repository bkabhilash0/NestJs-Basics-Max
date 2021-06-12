// /api/new-meetup
// Only Post request to this route
// "mongodb://localhost:27017/MyDb"

import { MongoClient } from "mongodb";

const DBURL = "mongodb://localhost:27017/React-Meetups";

const handler = async (req, res) => {
  if (req.method === "POST") {
    const data = req.body;

    const client = await MongoClient.connect(DBURL);
    const db = client.db();

    const meetupsCollection = db.collection("meetups");
    const result = await meetupsCollection.insertOne(data);
    console.log(result);
    client.close();

    res.status(201).json({
      status: "success",
      message: "Meetup Inserted",
    });
  }
};

export default handler;
