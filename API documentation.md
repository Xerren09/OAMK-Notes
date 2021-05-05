# OAMK Notes API documentation

The OAMK Notes API is the main underlying system powering the OAMK Notes web application. This is a documentation of all the API calls and responses the system provides.

The host domain of the API is at [http://xerrendev01uni.azurewebsites.net/](http://xerrendev01uni.azurewebsites.net). All URL fragments detailed here can be directly appended to the URL.

All the API responses follow the following format:
```json
{
    "status": "fail / error / success",
    "data": {
        "type": "fail / error message if applicable",
        "other field name": "other content"
    }
}
```
Note that `type` is only present in a failure or error status, otherwise `data` only contains the server response in key-value pairs.
The system can return these type codes:
###### `internal_database`
Only occurs if the internal database has encountered an error or if the Azure App Service could not communicate with the database. Generally, it is not the user's fault, but signals a service disruption.
###### `credentials_unknown`
The main authentication error returned when the `authToken` used has expired or does not exists. If the token is still in its refresh period, the request will be served as normal, and a new token will be returned with the response.
###### `credentials_exist` 
The most specific authentication error, only used during user registration. If this error is returned the given user identifier is already in use.
###### `key_inuse`
This fail type code only appears when attempting to delete subjects that are in use (referenced either as for a homework or note). The user should be told that the subject is in use, therefor it cannot be deleted.

## /users/

The `/users/` URL provides functions related to the system's users, such as registration, authentication and queries.

#### /users/login - `POST`
Sending a `POST` request to the above URL with the following body will run the `UserAuthorization` function:
```json
{
    "userEmail": "example@students.oamk.fi",
    "userPassword": "password123"
}
```
On successful authentication, the server response should be the following:
```json
{
    "status": "success",
    "data": {
        "authToken": "51e620608c9be8ccb607182bf4c992aef0144fd35cd6735c14afe976a01e4a997fd87b56b754408ba02863d0b4a51abcd3deb82492440b4b61873748f5d44512"
    }
}
```
Or, if the provided credentials are incorrect:
```json
{
    "status": "fail",
    "data": {
        "type": "unknown_credentials"
    }
}
```
For security reasons, the while encountering authentication errors the server never specifies the exact issue and responds with either `unknown_credentials` or `existing_credentials` error type.

After a successful authentication, the `authToken` returned by the server (128-character long string) can be used for further requests without providing the password again. For every `GET` or `POST` request, append the returned value to a header named `authtoken`:
```javascript
xhttp.setRequestHeader("authToken", authorizationToken);
```
Note however, that each `authToken` has a lifespan of 6 hours (21600000ms) after which it enters a 2-hour (3600000ms) refresh grace-period. During this time, any request will automatically refresh the token without requiring the user to log in again. However, if the application has been closed during this time, the user is required to log in again to acquire a new `authToken`.
The new token will be sent out along with the expected server response, in the `data` object:
```json
{
    "status": "success",
    "data": {
        "authToken": "51e620608c9be8ccb607182bf4c992aef0144fd35cd6735c14afe976a01e4a997fd87b56b754408ba02863d0b4a51abcd3deb82492440b4b61873748f5d44512",
        "other_response_data": "other_response_data"
    }
}
```

#### /users/register - `POST`
Sending a `POST` request to the above URL with the following body is used to register new users:
```json
{
    "userName": "Example",
    "userPassword": "password123",
    "userEmail": "example@students.oamk.fi",
    "userGroup": "EXAMPLE"
}
```
If the given user information is not already present in the database, the server returns an `authToken` and a status message:
```json
{
    "status": "success",
    "data": {
        "authToken": "00b7ebf56b9fe7a9a2d47187a1120fc6142286150956b88f67ef7daa8858d940ba24b43753bcafa860037c9ebf8ce1734de5aeb08092f35f7eb12e2761f066f9"
    }
}
```
If a user already exists under the given email address, the server will throw back an `existing_credentials` error, in which case the application should tell the user that the provided user information is already in use.
```json
{
    "status": "fail",
    "data": {
        "type": "existing_credentials"
    }
}
```
#### /users/getUserInfo - `GET`
This can be used to retrieve based user information. Note that the password is always hidden, and the API only returns 12 `*` symbols in its place. `userID` is the internal ID of the user, this can be used for debugging purposes.
```json
{
    "status": "success",
    "data": {
        "userName": "Example",
        "userEmail": "example@students.oamk.fi",
        "userGroup": "Example",
        "userPassword": "************",
        "userID": 1
    }
}
```

#### /users/updatePassword - `POST`
This can be used to change the user password. The password should only be sent, if the user has passed the standard 2 try typo check.
```json
{
    "userPassword": "newpassword12",
    "userEmail": "example@students.oamk.fi"
}
```
The updated password will be saved, and a new authorization token will be sent out, essentially treating this as a new login session.
```json
{
    "status": "success",
    "data": {
        "token": "00b7ebf56b9fe7a9a2d47187a1120fc6142286150956b88f67ef7daa8858d940ba24b43753bcafa860037c9ebf8ce1734de5aeb08092f35f7eb12e2761f066f9"
    }
}
```

#### /users/updateGroupCode - `POST`
Used to change the user's group code, by sending the new code to in the request body.
```json
{
    "userGroup": "Example"
}
```
As a confirmation, the server response will return the code:
```json
{
    "status": "success",
    "data": {
        "userGroup": "Example"
    }
}
```

## /note/
The `/note/` section provides functions mainly related to the users' notes*.

*may touch on other sections' functionalities too.
#### /note/frontPage - `GET`
Sending a request with authentication will return a response with basic user information (name, and group code), all the added subjects (categorized by year and period, `subjectID` included), and the first 57 characters of every note along with basic information about them which can be used to generate a list of notes (`noteID` included.). Note that ever timestamp is in Unix ms format.
```json
{
    "status": "success",
    "data": {
        "userinfo": [
            {
                "userName": "05",
                "userGroup": "DIN20SP"
            }
        ],
        "sidebarcontent": {
            "2021": {
                "1": [
                    {
                        "subjectID": 19,
                        "subjectName": "subject03"
                    },
                    {
                        "subjectID": 16,
                        "subjectName": "subject05"
                    },
                ],
                "2": [
                    {
                        "subjectID": 13,
                        "subjectName": "subject03"
                    }
                ],
                "3": [
                    {
                        "subjectID": 14,
                        "subjectName": "subject03"
                    },
                ]
            }
        },
        "frontpagecontent": [
            {
                "subjectID": 1,
                "noteID": 1,
                "noteName": "note01",
                "noteDate": 1616891799684,
                "noteImportance": 0,
                "noteDescription": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. "
            },
            {
                "subjectID": 1,
                "noteID": 2,
                "noteName": "note02",
                "noteDate": 1616891799765,
                "noteImportance": 0,
                "noteDescription": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. "
            }
        ]
    }
}
```
#### /note/getNote - `POST`
Sending a request with the following body will return the entire note with the specified ID, if the user has access to it. `noteID` is accessible from `/note/frontPage`.
```json
{
    "noteID": 10
}
```
Response:
```json
{
    "status": "success",
    "data": {
        "noteData": [
            {
                "subjectID": 1,
                "subjectName": "subject01",
                "noteID": 10,
                "noteName": "note01",
                "noteDate": 1618506858941,
                "noteImportance": 0,
                "noteText": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam non tincidunt lacus..."
            }
        ]
    }
}
```
#### /note/addNew - `POST`
After a note has been written, sending the following data to this address will save the note to the database. `subjectID` should be passed down from subject category selector (included in `/note/frontPage`'s response). The server response will be a simple `status: success` without any payload.
```json
{
    "subjectID": 1,
    "noteName": "note3",
    "noteDate": 1618506858941,
    "noteImportance": 0,
    "noteText": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam non tincidunt lacus..."
}
```
#### /note/updateNote - `POST`
If a note is edited and saved, sending the following data to this address will update the note's contents. The server response will be a simple `status: success` without any payload.
```json
{
    "noteID": 10,
    "noteText": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam non tincidunt lacus..."
}
```
#### /note/remove - `POST`
Used to delete notes by providing the appropriate `noteID` in the request body:
```json
{
    "noteID": 1
}
```
In response the server will return the new array of note details, that can be used to re-build the note cards on the frontpage:
```json
{
    "status": "success",
    "data": {
        "frontpagecontent": [
            {
                "subjectID": 1,
                "noteID": 2,
                "noteName": "note02",
                "noteDate": 1616891799765,
                "noteImportance": 0,
                "noteDescription": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. "
            },
        ]
    }
}
```
## /subject/
The `/subject/` section provides functions related to managing subjects added by the user.

#### /subject/addNew - `POST`
Adding a new subject can be done by sending the following body:
```json
{
    "subjectName": "subject03",
    "subjectYear": 2021,
    "subjectPeriod": 1
}
```
As a response the server will return the new ordered list of subjects:
```json
{
    "status": "success",
    "data": {
        "subjectselectorcontent": {
            "2021": {
                "1": [
                    {
                        "subjectID": 19,
                        "subjectName": "subject03"
                    },
                    {
                        "subjectID": 2,
                        "subjectName": "subject02"
                    },
                    {
                        "subjectID": 1,
                        "subjectName": "subject01"
                    }
                ],
            }
        }
    }
}
```
#### /subject/remove - `POST`
Used to delete subjects by providing the appropriate `subjectID` in the request body:
```json
{
    "subjectID": 2
}
```
If the subject has not been associated with any notes or assignments, the server will return the new ordered array of all subjects:
```json
{
    "status": "success",
    "data": {
        "subjectselectorcontent": {
            "2021": {
                "1": [
                    {
                        "subjectID": 1,
                        "subjectName": "subject01"
                    }
                ],
            }
        }
    }
}
```
However, if the subject has been already referenced, the server will return a `key_inuse` fail error.
## /homework/
The `/homework/` section provides functions related to managing assignments added by the user.

#### /homework/getAll - `GET`
Sending a `getAll` request will return all assignments added by the user, along with the associated subject, and `homeworkID`:
```json
{
    "status": "success",
    "data": {
        "assignmentlist": [
            {
                "homeworkID": 1,
                "subjectName": "subject01",
                "homeworkName": "Homework1",
                "homeworkDate": 1616891799684
            },
            {
                "homeworkID": 2,
                "subjectName": "subject02",
                "homeworkName": "Homework2",
                "homeworkDate": 1616891799684
            }
        ]
    }
}
```
#### /homework/addNew - `POST`
Adding a new assignment can be done by sending the following body:
```json
{
    "subjectID": 1,
    "homeworkName": "Testname",
    "homeworkDate": 64284,
}
```
The server will return the updated list of all homeworks:
```json
{
    "status": "success",
    "data": {
        "assignmentlist": [
            {
                "homeworkID": 2,
                "subjectName": "subject02",
                "homeworkName": "Homework2",
                "homeworkDate": 1616891799684
            },
            {
                "homeworkID": 3,
                "subjectName": "subject01",
                "homeworkName": "Homework2",
                "homeworkDate": 1616891799684
            }
        ]
    }
}
```
#### /homework/remove - `POST`
Used to delete assignments by providing the appropriate `homeworkID` in the request body:
```json
{
    "homeworkID": 1,
}
```
The server will respond with an updated list of all homeworks:
```json
{
    "status": "success",
    "data": {
        "assignmentlist": [
            {
                "homeworkID": 2,
                "subjectName": "subject02",
                "homeworkName": "Homework2",
                "homeworkDate": 1616891799684
            }
        ]
    }
}
```
## /api/
#### /api/status - `GET`
This can be used to check the service status. `AppServiceStatus` will always return `alive` if a response is received, while `DatabaseServiceStatus`  will return `down` if it is unavailable, otherwise it will respond with `alive`.
```json
{
    "status": "success",
    "data": {
        "AppServiceStatus": "alive",
        "DatabaseServiceStatus": "alive",
        "Check": {
            "encode": "base64",
            "content1": "aHR0cHM6Ly90aW55dXJsLmNvbS9qaXdvb25pc2JpZ3BvZw==",
        }
    }
}
```
