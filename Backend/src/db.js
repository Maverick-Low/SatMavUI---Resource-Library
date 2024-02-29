import { MongoClient } from "mongodb";

let db;


async function connectToDb(cb) {

    // Connect to MongoDB
    const client = new MongoClient('mongodb://127.0.0.1:27017');
    await client.connect();

    // Update the upvotes in the database
    db = client.db('satmav-db'); 
    cb();
}

export {
    db,
    connectToDb,
}