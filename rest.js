const express = require("express");
const utils = require("util");
const gradeService = require("./service/gradeService");

const db = require("./db/db");
const queries = require("./db/queries");

const port = 3000;

const rest = express();
const router = express.Router();
rest.use(express.json());
rest.use("/ladok/v1", router);

/*
Accepts one student and inserts the grade
 */
router.post("/grade", gradeService.validateOneGradeObject(), async (req, res) => {
        const resFromDB = await gradeService.addGrade(req.body);
        if (resFromDB > 0) {
            res.status(201).send({
                "status": "201",
                "message": utils.format("Grade %s added for student %s in course %s",
                    req.body.grade,
                    req.body.student,
                    req.body. courseCode
                ),
                "resource": null
            });
        }
});

/*
Accepts a list of grades on several examinations on one course
 */
router.post("/grades", async  (req, res) => {
    //gradeService.validateMultipleGradeObject(req.body);
    const obj = await gradeService.addGrades(req.body);
    if (obj.length > 0){
        res.status(200).send(
            {
                "errors": obj
            }
        );
    } else {
        res.status(201).send("All grades added");
    }
});

router.get('*', (req, res) => {
    res.status(404).send({
        "Status": "404",
        "Message": "Resource not found"
    });
});


module.exports = rest;