const express = require("express");
const utils = require("util");

const db = require("./db/db");
const queries = require("./db/queries")

const port = 3000;

const app = express();
const router = express.Router();
app.use(express.json());
app.use("/ladok/v1", router);


/*
Not implemented
 */
router.get("/student", function (req, res) {
    res.send();
});


/*
Accepts one student and inserts the grade
 */
router.post("/grade", async (req, res) => {
    try {
        const dbQuery = await db.query(queries.sql.insert.insertGrades,
            [
                req.body.grade,
                req.body.examinationNumber,
                req.body.student,
                req.body.courseCode
            ]
        );
        res.status(201).send(JSON.stringify({
            "status": 201,
            "error": null,
            "ID": dbQuery.insertId
        }));
    } catch (e) {
        res.status(400).send("Fel: " + e);
    }
});


/*
Inserts one student
 */
router.post("/student", function (req, res) {
    db.query(queries.sql.insert.insertStudent, [req.body.pnr, req.body.name], function (error, results, fields) {
        if (error) {
            db.rollback();
            res.status(400).send(error.toString());
        } else res.status(201).send(JSON.stringify({
            "status": 201,
            "error": null,
            "response": utils.format("Student %s created", req.body.name)}))
    })
});

/*
Accepts a list of grades on several examinations on one course
 */
router.post("/grades", async function (req, res) {
    const examinations = req.body.examinations; //extracts a list of each examination
    const courseCode = req.body.course; //extracts the course code
    let listOfError = []; //initializes a list to push not inserted students
    let insertedGrades = []; // initializes a list to push successful inserts

    /*
    Looping requestbodyn and "bulk inserts" into db.
      */
    for (let i = 0; i < examinations.length; i++) {
        const studentGrades = examinations[i].studentGrades; //extracts the grades from a specific examination

        for (let j = 0; j < studentGrades.length; j++) {
            try {
                await db.query(queries.sql.insert.insertGrades,
                    [
                        studentGrades[j].grade,
                        examinations[i].code,
                        studentGrades[j].pnr,
                        courseCode
                    ]
                );
                insertedGrades.push({
                    "grade": studentGrades[j].grade,
                    "student": studentGrades[j].pnr,
                    "examination": examinations[i].code,
                    "courseCode": courseCode,
                })
            } catch (e) {
                listOfError.push(utils.format("Error, could not insert: %s. %s", e.code, e.message));
            }
        }
    }
    res.send({
        "failedInserts": listOfError,
        "insertedGrades": insertedGrades
    });
});


app.listen(port, () => console.log(utils.format("Server listening on %s", port)));