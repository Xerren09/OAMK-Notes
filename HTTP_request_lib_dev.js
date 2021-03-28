const sendHTTP = {
	rGET: function (requestURL, authorizationToken) { 
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				let requestResponseData = JSON.parse(this.responseText);
				return requestResponseData;
			}
		};
		xhttp.open("GET", requestURL, true);
		xhttp.setRequestHeader("authToken", authorizationToken);
		xhttp.send();
	},
	rPOST: function (requestURL, authorizationToken, requestBody) { 
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				let requestResponseData = JSON.parse(this.responseText);
				return requestResponseData;
			}
		};
		xhttp.open("POST", requestURL, true);
		xhttp.setRequestHeader("Content-Type", "application/json");
		xhttp.setRequestHeader("authToken", authorizationToken);
		let json = JSON.stringify(requestBody);
		xhttp.send(json);
	}
};