const utils = require("util");

let databaseErrorHandler = (error, grade, courseCode) => {
  switch (error.errno) {
      case 1062: {
          return {
              "felkod": 1062,
              "meddelande": utils.format("Kunde inte spara betyget på grund av att betyget redan finns registrerat på aktuellt kurstillfälle",
                  grade.student),
              "objekt": {
                  "student": grade.student,
                  "kurs": courseCode,
                  "betyg": grade.grade
              }
          }
      }
      case 1048: {
          return {
              "felkod": 1048,
              "meddelande": utils.format("Kunde inte spara betyget då %s inte kunde hittas i Ladok",
                  studentOrGrade(error.sqlMessage)),
              "objekt": {
                  "student": grade.student,
                  "kurs": courseCode,
                  "betyg": grade.grade
              }
          }
      }
      default: {
          return {
              "felkod": error.errno,
              "meddelande": "Kunde inte spara uppgiften, kontakta service desk",
              "objekt": {
                  "student": grade.student,
                  "kurs": courseCode,
                  "betyg": grade.grade
              }
          }
      }
  }

};

function studentOrGrade(messageString) {
    if(messageString.includes("studentID")){
        return "studenten";
    } else {
        return "kursen";
    }
}

module.exports.databaseerrorHandler = databaseErrorHandler;