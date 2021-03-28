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


//Example code:

let userAuthToken = "a35ab69f0b57e1cbb96d5defa043e41841b0f8e03fde3b31568a3e7a0aefeb749ce048fca3a7ded9290675431d50f1427ecfd2d213652df1b485a9d11300a57a";
let userAllNotes = sendHTTP.rGET("http://localhost:3000/note/getAll", userAuthToken);

//Example contents of userAllNotes:
[
   {
      "subjectName":"subject01",
      "studyPeriod":1,
      "studyYear":2021,
      "noteName":"note01",
      "noteDate":1616891799684,
      "noteImportance":0,
      "noteText":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean eget accumsan dolor, sed hendrerit diam."
   },
   {
      "subjectName":"subject01",
      "studyPeriod":1,
      "studyYear":2021,
      "noteName":"note04",
      "noteDate":1616891799684,
      "noteImportance":0,
      "noteText":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean eget accumsan dolor, sed hendrerit diam."
   },
   {
      "subjectName":"subject01",
      "studyPeriod":1,
      "studyYear":2021,
      "noteName":"note05",
      "noteDate":1616891799684,
      "noteImportance":0,
      "noteText":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean eget accumsan dolor, sed hendrerit diam."
   },
   {
      "subjectName":"subject02",
      "studyPeriod":1,
      "studyYear":2021,
      "noteName":"note02",
      "noteDate":1616891799684,
      "noteImportance":0,
      "noteText":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean eget accumsan dolor, sed hendrerit diam."
   },
   {
      "subjectName":"subject02",
      "studyPeriod":1,
      "studyYear":2021,
      "noteName":"note03",
      "noteDate":1616891799684,
      "noteImportance":0,
      "noteText":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean eget accumsan dolor, sed hendrerit diam."
   }
]

//Getting the first entry:
let note = userAllNotes[0];
console.debug(note.subjectName);
console.debug(note.noteText);
//Or
console.debug(userAllNotes[0].subjectName);
console.debug(userAllNotes[0].noteText);