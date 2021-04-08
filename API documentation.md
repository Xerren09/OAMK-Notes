# OAMK Notes API documentation

The OAMK Notes API is the main underlying system powering the OAMK Notes webapplication. This is a documentation of all the API calls and responses the system provides.

## /users/

The `/users/` url provides functions related to the system's users, such as registration, authentication and queries.

#### /users/login
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
    "authSuccess": true,
    "authToken": "51e620608c9be8ccb607182bf4c992aef0144fd35cd6735c14afe976a01e4a997fd87b56b754408ba02863d0b4a51abcd3deb82492440b4b61873748f5d44512"
}
```
Or, if the provided credentials did not match:
```json
{
    "authSuccess": false
}
```
After a successful authentication, the `authToken` returned by the server can be used for further requests without providing the password again. For every `GET` or `POST` request, append the returned value to a header named `authtoken`:
```javascript
xhttp.setRequestHeader("authToken", authorizationToken);
```
Note however, that each `authToken` has a lifespan of 6 hours (21600000ms) after which the next any request will automatically refresh it without requiring the user to log in again. However, if the application has been closed during this time, the user is required to log in again to acquire a new `authToken`.

#### /users/register
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
    "valid": true,
    "authToken": "00b7ebf56b9fe7a9a2d47187a1120fc6142286150956b88f67ef7daa8858d940ba24b43753bcafa860037c9ebf8ce1734de5aeb08092f35f7eb12e2761f066f9"
}
```
If an user already exists under the given email address, the server will throw back an error:
```json
{
    "valid": false
}
```
In this case the application will tell the user that the provided user information is already in use.
#### /users/refreshToken
This is used to refresh the user's `authToken` if it has expired, by sending the body below. This should be used after a request that should have yielded a valid answer returned an authentication error. After the server provided a new `authToken`, the previous request should be automatically repeated with the updated credentials.
```json
{
    "authToken": "51e620608c9be8ccb607182bf4c992aef0144fd35cd6735c14afe976a01e4a997fd87b56b754408ba02863d0b4a51abcd3deb82492440b4b61873748f5d44512"
}
```
In case the token has expired, the server will issue a new one to the user:
```json
{
    "authAlive": false,
    "authToken": "1a1d6cde1cf0869b4e916561605dac8169e5c7a82eb05014d963c9135213423759e0dbba934259a1bc9946a7b4b1274fdb4f8b737fbbbf36592a6cd9100e7393"
}
```
Or if the `authToken` is still valid:
```json
{
    "authAlive": true,
}
```