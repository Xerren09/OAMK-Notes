function subjectCaret() {
  var toggler = document.getElementsByClassName("caret");
  var i;

  for (i = 0; i < toggler.length; i++) {
    toggler[i].addEventListener("click", function() {
      this.parentElement.querySelector(".nested").classList.toggle("active");
      this.classList.toggle("caret-down");
    });
  }
}

subjectCaret();

function generalNotes() {
    let genralNotesButton = document.querySelector('.generalNotes');
    let generalNotesObject = JSON.parse(sessionStorage.getItem('generalNotes'));
    genralNotesButton.id = generalNotesObject.subjectID;
    sessionStorage.setItem('subjectName', generalNotesObject.subjectName);
    sessionStorage.setItem('subjectId', genralNotesButton.id);
    let courseName = document.querySelector('#courseName');
    displaySubjectNotes(genralNotesButton.id);
    genralNotesButton.onclick = () => {
        courseName.innerHTML = generalNotesObject.subjectName;
        displaySubjectNotes(genralNotesButton.id);
        sessionStorage.setItem('subjectName', generalNotesObject.subjectName);
        sessionStorage.setItem('subjectId', genralNotesButton.id);
    };
};

function subjectTreeBuild(subjects) {
    for (let i = 0; i < 4; i ++) {
        let year = subjects[i+1];
        for(let l = 0; l < 4; l ++) {
            let period = year[l+1];
            for(let k = 0; k < period.length; k ++){
                let subject = period[k];
                let yearPeriod = document.querySelector('#year'+(i+1)+'Period'+(l+1));
                let li = document.createElement('li');
                let subjectButton = document.createElement('button');
                subjectButton.innerHTML = subject.subjectName;
                subjectButton.id = subject.subjectID;
                li.append(subjectButton);
                yearPeriod.append(li);
                let courseName = document.querySelector('#courseName');
                subjectButton.onclick = () => {
                  courseName.innerHTML = subject.subjectName;
                  displaySubjectNotes(subjectButton.id);
                  sessionStorage.setItem('subjectId', subjectButton.id);
                  sessionStorage.setItem('subjectName', subject.subjectName);
                }
            };
        };
    };
};

function displaySubjectNotes(subjectId) {
  let frontPageContent = JSON.parse(sessionStorage.getItem('frontPageContent'));
  let noteHolder = document.querySelector('.noteHolder');
  console.log(frontPageContent);
  noteHolder.innerHTML = '';
  let addNoteDiv = document.createElement('div');
  addNoteDiv.classList.add('addNewNote');
  let addNoteButton = document.createElement('button');
  addNoteButton.innerHTML = 'New Note<br>+';
  addNoteButton.onclick = () => {
      sessionStorage.setItem('noteText', '');
      sessionStorage.setItem('noteName', '');
      window.location.href = './noteEditor.html';
  }
  addNoteDiv.append(addNoteButton);
  noteHolder.append(addNoteDiv);
  for (let i = 0; i < frontPageContent.length; i ++) {
      if(frontPageContent[i].subjectID == subjectId) {
          let noteId = frontPageContent[i].noteID;
          let noteDiv = document.createElement('div');
          noteDiv.classList.add('newNote');
          let noteButton = document.createElement('button');
          let noteTable = document.createElement('table');
          let noteTitle = document.createElement('tr');
          noteTitle.classList.add('noteTitle');
          let h1 = document.createElement('h1');
          h1.innerHTML = frontPageContent[i].noteName;
          noteTitle.append(h1);
          let noteText = document.createElement('tr');
          noteText.classList.add('noteText');
          let p1 = document.createElement('p');
          p1.innerHTML = frontPageContent[i].noteDescription;
          noteText.append(p1);
          let noteDate = document.createElement('tr');
          noteDate.classList.add('noteDate');
          let p2 = document.createElement('p');
          let timestamp = frontPageContent[i].noteDate;
          let date = new Date(timestamp);
          p2.innerHTML = date.getDate()+
                      "."+(date.getMonth()+1)+
                      "."+date.getFullYear()+
                      " "+date.getHours()+
                      ":"+date.getMinutes()+
                      ":"+date.getSeconds();
          noteDate.append(p2);
          noteTable.append(noteTitle, noteText, noteDate);
          noteButton.append(noteTable);
          noteDiv.append(noteButton);
          noteHolder.append(noteDiv);
          noteButton.onclick = () => {
              let payload = {
                  "noteid" : noteId
              }
              xrequest.POST("http://xerrendev01uni.azurewebsites.net/note/getNote", token, payload, function(response){
                  console.log(response);
                  sessionStorage.setItem('noteText', response.data[0].noteText);
                  sessionStorage.setItem('noteName', response.data[0].noteName);
                  window.location.href = './noteEditor.html';
              });
          }
      };
  };
};

