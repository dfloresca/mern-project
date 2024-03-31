import express from "express"

// This will help us to connect to the database
import db from "../db/connection.js";

// this help convert the id from string to ObjectId for the _id
import { ObjectId } from "mongodb";

// router is an instance of the express router
// We us it to define our routes
// The router will be added as a middleware and will take control of requests starting with path record.
const router = express.Router();

//this section will help get a list of all the records.
router.get("/", async (req, res) => {
    let collection = await db.collection("records");
    let results = await collection.find({}).toArray();
    res.send(results).status(200);
});

// this section will help you get a single record by id
router.get("/:id", async (req, res) => {
    let collection = await db.collection("records");
    let query = { _id: new ObjectId(req.params.id) };
    let result = await collection.findOne(query);

    if(!result) res.send("Not found").status(404);
    else res.send(result).status(200);
});

// This section will help you create a new record
router.post("/" async (req, res) => {
    try {
        let newDocument = {
            name: req.body.name,
            position: req.body.position,
            level: req.body.level,
        };
        let collection = await db.collection("records");
        let result = await collection.insertOne(newDocument);
        res.send(result).status(204);
    } catch(err) {
        console.error(err);
        res.status(500).send("Error adding record");
    }
});

// This section will help update a record by id.