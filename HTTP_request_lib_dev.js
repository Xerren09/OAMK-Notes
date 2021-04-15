const XerrenDevHTTPComm = {
	GET: function (requestURL, authorizationToken, callback) { 
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				let requestResponseData = JSON.parse(this.responseText);
				if (requestResponseData.data.token != undefined)
				{
					sessionStorage.setItem("token", requestResponseData.data.token);
				}
				callback(requestResponseData);
			}
		};
		xhttp.open("GET", requestURL, true);
		xhttp.setRequestHeader("authToken", authorizationToken);
		xhttp.send();
	},
	POST: function (requestURL, authorizationToken, requestBody, callback) { 
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				let requestResponseData = JSON.parse(this.responseText);
				if (requestResponseData.data.token != undefined)
				{
					sessionStorage.setItem("token", requestResponseData.data.token);
				}
            	callback(requestResponseData);
			}
		};
		xhttp.open("POST", requestURL, true);
		xhttp.setRequestHeader("Content-Type", "application/json");
		xhttp.setRequestHeader("authToken", authorizationToken);
		let json = JSON.stringify(requestBody);
		xhttp.send(json);
	}
};

//Example code:

let userAuthToken = "a35ab69f0b57e1cbb96d5defa043e41841b0f8e03fde3b31568a3e7a0aefeb749ce048fca3a7ded9290675431d50f1427ecfd2d213652df1b485a9d11300a57a";
let userAllNotes = XerrenDevHTTPComm.GET("http://localhost:3000/note/getAll", userAuthToken);


const authToken = "";

function test () {
   	// collect all the data
	let loginEmail = "";
	let loginPass  = "";

   	let payload = {
   	   userEmail: loginEmail,
   	   userPassword: loginPass
   	}

	   XerrenDevHTTPComm.POST("users/login", "0000", payload, function(response) {
   	    if (response.authSuccess == true)
  	    {  
        	sessionStorage.setItem("token", response.authToken);
      	}
      	else 
      	{
         	console.log("You have entered an invalid username or password.");
      	}
   	});
}



XerrenDevHTTPComm.POST("users/login", "0000", payload, function(response) {
   	sessionStorage.setItem("token", response.authToken);
});

localAuthToken = sessionStorage.getItem("token");

XerrenDevHTTPComm.POST("users/getUserInfo", sessionStorage.getItem("token"), payload, function(response) {
   	//
});



function getAllNotes() {
	XerrenDevHTTPComm.GET("/note/getAll", sessionStorage.getItem("token"), function(response) {

	});
}