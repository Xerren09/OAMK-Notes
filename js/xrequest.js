const xrequest = {
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
		let protocol = "https://";
		let fullUrl = (protocol+requestURL);
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
		let protocol = "https://";
		let fullUrl = (protocol+requestURL);
		xhttp.open("POST", requestURL, true);
		xhttp.setRequestHeader("Content-Type", "application/json");
		xhttp.setRequestHeader("authToken", authorizationToken);
		let json = JSON.stringify(requestBody);
		xhttp.send(json);
	}
}