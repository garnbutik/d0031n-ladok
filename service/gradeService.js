const db = require("../db/db");
const queries = require("../db/queries");
const schema = require("../config/jsonSchema");
const validator = require("../config/config").validator;
const utils = require("util");
const Ajv = require("ajv");

const ajv = Ajv({removeAdditional: "all", verbose: true, allErrors: true});

async function addGrade(gradingObject){
    const resultFromDB = await db.query(queries.sql.insert.insertGrades, [
        gradingObject.grade,
        gradingObject.examinationNumber,
        gradingObject.student,
        gradingObject.courseCode,
        gradingObject.date
    ]);
    return resultFromDB.affectedRows;
}

async function addGrades(gradingObject){
    const courseCode = gradingObject.courseCode;
    const examinationNumber = gradingObject.examination;
    const date = gradingObject.date;
    let listOfError = []; //initializes a list to push not inserted students

    for (const grade of gradingObject.listOfGrades){
        try {
            const resultFromInsert =
                await db.query(
                    queries.sql.insert.insertGrades,
                    [
                        grade.grade,
                        examinationNumber,
                        grade.student,
                        courseCode,
                        date
                    ]);
        } catch (error) {
            listOfError.push(
                utils.format("Could not insert student: %s. Error: %s", grade.student, error.message)
            );
        }
    }
    return listOfError;
}

let validateOneGradeObject = () => {
    return (req, res, next) => {
        let validate = ajv.compile(schema.oneGrade);
        const isValid = validate(req.body);
        if (!isValid){
            return res.status(400).send({
                "status": 400,
                "message": "Bad request. Please check your request and try again",
                "errors": ajv.errorsText(validate.errors)
            });
        }
        next();
    }
};

let validateRequest = () => {
    return (req, res, next) => {

        //Compiles the correct schema to validate
        let validate = ajv.compile(schema.multipleGrades);

        //Validates the request
        const isValid = validate(req.body);

        //return 400 response if request doesn't fulfill contract
        if (!isValid) {
            return res.status(400).send({
                "status": 400,
                "message": "Bad request. Please check your request and try again",
                "errors": ajv.errorsText(validate.errors)
            });
        }

        //if valid go to next
        next();
    }
};

module.exports.validateRequest = validateRequest;
module.exports.validateOneGradeObject = validateOneGradeObject;
module.exports.addGrades = addGrades;
module.exports.addGrade = addGrade;