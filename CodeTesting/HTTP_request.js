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

function getData() { 
	let payload = {
		userPassword: document.getElementById("password").value,
		userEmail: document.getElementById("username").value
	}
	XerrenDevHTTPComm.POST("http://xerrendev01uni.azurewebsites.net/users/login", "0000", payload, function(response) {	
		//do stuff with the info
		console.log(response);
		let token = response.data.token;
		sessionStorage.setItem('token', token);
	});
}

function getUserInfo() {
	XerrenDevHTTPComm.GET("http://xerrendev01uni.azurewebsites.net/users/getUserInfo", sessionStorage.getItem("token"), function(response) {
		console.log(response);
	});
}