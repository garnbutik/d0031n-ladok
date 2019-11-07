const db = require("../db/db");
const queries = require("../db/queries");
const validator = require("../config/config").validator;
const utils = require("util");

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

function validateOneGradeObject(){
    return (req, res, next) => {
        const neededKeys = validator.requestParamsForSingleGrade;
        const isValid = neededKeys.every(key => Object.keys(req.body).includes(key));
        if (!isValid){
            return res.status(400).send("Bad request");
        }
        next();
    }
}

module.exports.validateOneGradeObject = validateOneGradeObject;
module.exports.addGrades = addGrades;
module.exports.addGrade = addGrade;