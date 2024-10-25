import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";

/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */

const agg = [
  {
    $match: {
      product: new ObjectId("6719a4c326e77ade6f97fcb0"),
    },
  },
  {
    $group: {
      _id: null,
      averageRating: {
        $avg: "$rating",
      },
      numOfReviews: {
        $sum: 1,
      },
    },
  },
];

const client = await MongoClient.connect(
  "mongodb+srv://bobbyugbebor:yNXnwKbQrqHDsSi8@cluster0.bi2k9.mongodb.net/E-Commerce?retryWrites=true&w=majority&appName=Cluster0"
);
const coll = client.db("E-Commerce").collection("reviews");
const cursor = coll.aggregate(agg);
const result = await cursor.toArray();
await client.close();
