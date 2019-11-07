# d0031n-ladok
Course work writing a REST api

## Endpoints
### Grade
`POST /ladok/v1/grade`
#### Request body
Accepts a JSON with structure:
```json
{
	"grade": "VG",
	"examinationNumber": "00222",
	"student": "XXXXXXXXXX",
	"courseCode": "LTU-27001", 
        "date": "2019-10-17"
}
```
### Grades
`POST /ladok/v1/grades`
#### Request body
Accepts a JSON with structure:
```json
    {
        "courseCode": "LTU-27001",
        "examination": "0008",
        "date": "2019-10-17",
        "listOfGrades": [
            {
                "student": "XXXXXXXXXX",
                "grade": "G"
            },
            {
                "student": "XXXXXXXXXX",
                "grade": "VG"
            }
        ]
    }
```
