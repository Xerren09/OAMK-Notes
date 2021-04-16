function getData() { 
	let payload = {
		userPassword: document.getElementById("password").value,
		userEmail: document.getElementById("username").value
	}
	xrequest.POST("http://xerrendev01uni.azurewebsites.net/users/login", "0000", payload, function(response) {	
		//do stuff with the info
		console.log(response);
		let token = response.data.token;
		sessionStorage.setItem('token', token);
	});
}

function getUserInfo() {
	xrequest.GET("http://xerrendev01uni.azurewebsites.net/users/getUserInfo", sessionStorage.getItem("token"), function(response) {
		console.log(response);
	});
}

function getFrontPage() {
	xrequest.GET("http://xerrendev01uni.azurewebsites.net/note/frontPage", sessionStorage.getItem("token"), function(response) {
		console.log(response);
	});
}