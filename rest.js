const express = require("express");
const utils = require("util");
const gradeService = require("./service/gradeService");
const cors = require('cors');

const rest = express();
const router = express.Router();
rest.use(express.json());
rest.use(cors());
rest.use("/ladok/v1", router);
router.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Pass to next layer of middleware
    next();
});

/*
Accepts one student and inserts the grade
 */
router.post("/grade", gradeService.validateOneGradeObject(), async (req, res) => {
    try {
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
    } catch (error) {
        res.status(500).send({
            "status": 500,
            "message": error.message
        });
    }

});

/*
Accepts a list of grades on several examinations on one course
 */
router.post("/grades", gradeService.validateRequest(), async (req, res) => {
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

router.post('*', (req, res) => {
    res.status(400).send({
        "Status": "400",
        "Message": "Bad request"
    });
});


module.exports = rest;