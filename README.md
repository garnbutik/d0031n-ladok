# d0031n-ladok
Course work writing a REST api

## Endpoins
### Grade
`POST /ladok/v1/grade`
#### Request body
Accepts a JSON with structure:
```
{
	"grade": "VG",
	"examinationNumber": "00222",
	"student": XXXXXXXXXX,
	"courseCode": "LTU-27001"
}
```
### Grades
`POST /ladok/v1/grades`
#### Request body
Accepts a JSON with structure:
```
    "course": "LTU-27001",
    "examinations": [
    	  {
        	"code": "0004",
        	"studentGrades": [
            	{
                	"pnr": "XXXXXXXXXX",
                	"grade": "G"
            	},
            	{
                	"pnr": "11",
                	"grade": "VG"
            	}
        	]
    	  }
      ]
    }
```
