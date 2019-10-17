const express = require("express");
const utils = require("util");

const db = require("./db/db");
const queries = require("./db/queries")

const port = 3000;

const app = express();
const router = express.Router();
app.use(express.json());
app.use("/ladok/v1", router);


router.get("/student", function (req, res) {
    db.query(queries.sql.selectAllFromStudent, function (error, results, fields) {
        if (error) {
            throw error;
        } else {
            res.send(results);
        }
    })
});

router.post("/student", function (req, res) {
    db.query(queries.sql.insertStudent, [req.body.pnr, req.body.name], function (error, results, fields) {
        if (error) {
            db.rollback();
            res.status(409).send(error.toString());
        } else res.status(201).send(JSON.stringify({
            "status": 201,
            "error": null,
            "response": utils.format("Student %s created", req.body.name)}))
    })
});


app.listen(port, () => console.log(utils.format("Server listening on %s", port)));