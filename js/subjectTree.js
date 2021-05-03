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

let courseHeader = document.querySelector('.courseHeader');
let removeCourse = document.createElement('button');
removeCourse.id = 'removeCourse';
removeCourse.innerHTML = 'Remove Course';
removeCourse.onclick = () => {
    deleteSubject();
};

function deleteSubject() {
    let userConfirm = confirm('Are you sure you want to delete the selected subject?');
    if (userConfirm) {
        let payload = {
            "subjectID": sessionStorage.getItem('subjectId')
        };
        xrequest.POST("http://xerrendev01uni.azurewebsites.net/subject/remove", token, payload, function(response){
            console.log(response);
            sessionStorage.setItem('subjectSelector', JSON.stringify(response.data.subjectselectorcontent));
            if (response.status == 'success') {
                let removedSubject = document.getElementById(sessionStorage.getItem('subjectId'));
                removedSubject.remove();
                generalNotes();
            } else {
                alert('The selected course has saved notes or homeworks, and can\'t be deleted!');
            };
        });
    };
};

function generalNotes() {
    let genralNotesButton = document.querySelector('.generalNotes');
    let generalNotesObject = JSON.parse(sessionStorage.getItem('generalNotes'));
    genralNotesButton.id = generalNotesObject.subjectID;
    sessionStorage.setItem('subjectName', generalNotesObject.subjectName);
    sessionStorage.setItem('subjectId', genralNotesButton.id);
    let courseName = document.querySelector('#courseName');
    courseName.innerHTML = generalNotesObject.subjectName;
    displaySubjectNotes(genralNotesButton.id);
    removeCourse.remove();
    genralNotesButton.onclick = () => {
        courseName.innerHTML = generalNotesObject.subjectName;
        displaySubjectNotes(genralNotesButton.id);
        removeCourse.remove();
        sessionStorage.setItem('subjectName', generalNotesObject.subjectName);
        sessionStorage.setItem('subjectId', genralNotesButton.id);
    };
};

function subjectTreeBuild(subjects) {
    for (let i = 0; i < 4; i ++) {
        let year = subjects[i+1];
        if(year) {
            for(let l = 0; l < 4; l ++) {
                let period = year[l+1];
                if(period) {
                    for(let k = 0; k < period.length; k ++){
                        let subject = period[k];
                        let yearPeriod = document.querySelector('#year'+(i+1)+'Period'+(l+1));
                        let li = document.createElement('li');
                        let subjectButton = document.createElement('button');
                        subjectButton.innerHTML = subject.subjectName;
                        subjectButton.id = subject.subjectID;
                        li.append(subjectButton);
                        yearPeriod.append(li);
                        subjectButton.onclick = () => {
                            courseHeader.append(removeCourse);
                            courseName.innerHTML = subject.subjectName;
                            displaySubjectNotes(subjectButton.id);
                            sessionStorage.setItem('subjectId', subjectButton.id);
                            sessionStorage.setItem('subjectName', subject.subjectName);
                        };
                    };
                };
            };
        };
    };
};

function displaySubjectNotes(subjectId) {
  let frontPageContent = JSON.parse(sessionStorage.getItem('frontPageContent'));
  let noteHolder = document.querySelector('.noteHolder');
  //console.log(frontPageContent);
  noteHolder.innerHTML = '';
  let addNoteButton = document.createElement('button');
  addNoteButton.id = 'addNewNote';
  addNoteButton.innerHTML = 'New Note<br>+';
  addNoteButton.onclick = () => {
      sessionStorage.setItem('noteText', '');
      sessionStorage.setItem('noteName', '');
      sessionStorage.setItem('noteId', 'newNote');
      window.location.href = './noteEditor.html';
  }
  noteHolder.append(addNoteButton);
  for (let i = 0; i < frontPageContent.length; i ++) {
      if(frontPageContent[i].subjectID == subjectId) {
          let noteId = frontPageContent[i].noteID;
          let noteDiv = document.createElement('div');
          noteDiv.classList.add('newNote');
          //let noteButton = document.createElement('button');
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
          let noteBtn = document.createElement('tr');
          noteBtn.classList.add('noteBtn');
          let openNote = document.createElement('button');
          openNote.classList.add('openNote');
          openNote.innerHTML = '<i class="far fa-edit fa-2x"></i>';
          let openNoteRemove = document.createElement('button');
          openNoteRemove.classList.add('removeNote');
          openNoteRemove.innerHTML = '<i class="fas fa-trash fa-2x"></i>';
          noteBtn.append(openNote, openNoteRemove);
          noteTable.append(noteTitle, noteText, noteDate, noteBtn);
          //noteButton.append(noteTable);
          noteDiv.append(noteTable);
          noteHolder.append(noteDiv);
          if(frontPageContent[i].noteImportance == 1) {
              noteDiv.classList.add('newNoteImportant');
          }
          openNote.onclick = () => {
              noteOpen(noteId);
          };
          openNoteRemove.onclick = () => {
              noteRemove(noteId);
          };
      };
  };
};

function noteOpen(noteId) {
    let payload = {
        "noteID" : noteId
    }
    xrequest.POST("http://xerrendev01uni.azurewebsites.net/note/getNote", token, payload, function(response){
        console.log(response);
        sessionStorage.setItem('noteText', response.data[0].noteText);
        sessionStorage.setItem('noteName', response.data[0].noteName);
        sessionStorage.setItem('noteId', response.data[0].noteID);
        window.location.href = './noteEditor.html';
    });
};

function noteRemove(noteId) {
    let userConfirm = confirm('Are you sure you want to delete this note?');
    if (userConfirm) {
        console.log('ok');
        let payload = {
            "noteID": noteId
        };
        xrequest.POST("http://xerrendev01uni.azurewebsites.net/note/remove", token, payload, function(response){
            console.log(response);
            sessionStorage.setItem('frontPageContent', JSON.stringify(response.data.frontpagecontent));
            displaySubjectNotes(sessionStorage.getItem('subjectId'));
        });
    };
};