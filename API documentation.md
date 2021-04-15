# OAMK Notes API documentation

The OAMK Notes API is the main underlying system powering the OAMK Notes webapplication. This is a documentation of all the API calls and responses the system provides.

The host domain of the API is at [http://xerrendev01uni.azurewebsites.net/](http://xerrendev01uni.azurewebsites.net). All url fragments detailed here can be directly appended to the url.

All of the API responses follow the following format:

```json
{
    "status": "fail / error / success",
    "data": {
        "type": "fail / error message if applicable",
        "other field name": "other content"
    }
}
```
Note that `type` is only present in a fail or error status, otherwise `data` only contains the server response in key-value pairs.
The system can return these type codes:
###### `internal_database`
Only occurs if the internal database has encountered an error or if the Azure App Service could not communicate with the database. Generally it is not the user's fault, but signals a service distruption.
###### `credentials_unknown`
The main authentication error, returned when the `authToken` used has expired or does not exists. If the token is still in it's refresh period, the request will be served as normal, and a new token will be returned with the response.
###### `credentials_exist` 
The most specific authentication error, only used during user registration. If this error is returned the given user identifier is already in use.

## /users/

The `/users/` url provides functions related to the system's users, such as registration, authentication and queries.

#### /users/login - `POST`
Sending a `POST` request to the above url with the following body will run the `UserAuthorization` function:
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
For security reasons, the while encountering authentication errors the server never specifies the exact issue, and responds with either `unknown_credentials`, `existing_credentials`, or `asd...` error type.

After a successful authentication, the `authToken` returned by the server (128 character long string) can be used for further requests without providing the password again. For every `GET` or `POST` request, append the returned value to a header named `authtoken`:
```javascript
xhttp.setRequestHeader("authToken", authorizationToken);
```
Note however, that each `authToken` has a lifespan of 6 hours (21600000ms) after which it enters a 2 hour (3600000ms) refresh grace-period. During this time any request will automatically refresh the token without requiring the user to log in again. However, if the application has been closed during this time, the user is required to log in again to acquire a new `authToken`.
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
Sending a `POST` request to the above url with the following body is used to register new users:
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
If an user already exists under the given email address, the server will throw back an `existing_credentials` error, in which case the application should tell the user that the provided user information is already in use.
```json
{
    "status": "fail",
    "data": {
        "type": "existing_credentials"
    }
}
```
#### /users/getUserInfo - `GET`
This can be used to retreive based user information. Note that the password is always hidden, and the API only returns 12 `*` symbols in its place. `userID` is the internal ID of the user, this can be used for debugging purposes.
```json
{
    "status": "success",
    "data": {
        "userName": "Example",
        "userEmail": "01example@students.oamk.fi",
        "userGroup": "Example",
        "userPassword": "************",
        "userID": 1
    }
}
```
## /note/
The `/note/` section provides functions mainly related to the users' notes*.

*may touch on other sections' functionalities too.
#### /note/frontPage - `GET`
Sending a request with authentication will return a response with basic user information (name, and groupcode), all the added subjects (categorized by year and period, `subjectID` included), and the first 57 characters of every note along with basic information about them which can be used to generate a list of notes (`noteid` included):
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
Sending a request with the following body will return the entire note with the specified ID, if the user has access to it. `noteid` is accessible from `/note/frontPage`.
```json
{
    "noteid": 10
}
```
Response:
```json
{
    "status": "success",
    "data": {
        "dbResult": [
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
#### /note/addNote - `POST`
After a note has been written, sending the following data to this address will save the note to the database. `subjectid` should be passed down from subject category selector (unclided in `/note/frontPage`'s response). The server response will be a simple `status: success` without any payload.
```json
{
    "subjectid": 1,
    "notename": "note3",
    "notedate": 1618506858941,
    "noteimportance": 0,
    "notetext": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam non tincidunt lacus..."
}
```
## /subject/
The `/subject/` section provides functions related to managing subjects added by the user.

#### /subject/addNew - `POST`
Adding a new subject can be done by sending the following body:
```json
{
    "subjectname": "subject03",
    "subjectyear": 2021,
    "subjectperiod": 1
}
```
As a response the server will return the new ordered list of subjects:
```json
{
    "status": "success",
    "data": {
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
```

# REVISION - DEPRECATED
#### /users/refreshToken
~~This is used to refresh the user's `authToken` if it has expired, by sending the body below. This should be used after a request that should have yielded a valid answer returned an authentication error. After the server provided a new `authToken`, the previous request should be automatically repeated with the updated credentials.~~
```json
{
    "authToken": "51e620608c9be8ccb607182bf4c992aef0144fd35cd6735c14afe976a01e4a997fd87b56b754408ba02863d0b4a51abcd3deb82492440b4b61873748f5d44512"
}
```
~~In case the token has expired, the server will issue a new one to the user:~~
```json
{
    "authAlive": false,
    "authToken": "1a1d6cde1cf0869b4e916561605dac8169e5c7a82eb05014d963c9135213423759e0dbba934259a1bc9946a7b4b1274fdb4f8b737fbbbf36592a6cd9100e7393"
}
```
~~Or if the `authToken` is still valid:~~
```json
{
    "authAlive": true,
}
```