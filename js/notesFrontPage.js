let token = sessionStorage.getItem('token');
xrequest.GET("http://xerrendev01uni.azurewebsites.net/note/frontPage", token, function(response) {
    if (response.status == 'success') {
        let userInfo = response.data.userinfo;
        sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
        userInfoo = userInfo;
        let subjectSelector = response.data.subjectselectorcontent;
        sessionStorage.setItem('subjectSelector', JSON.stringify(subjectSelector));
        let frontPageContent = response.data.frontpagecontent;
        sessionStorage.setItem('frontPageContent', JSON.stringify(frontPageContent));
        //console.log(userInfo);
        console.log(subjectSelector);
        console.log(frontPageContent);
        let userNameHeader = document.querySelector('#userNameHeader');
        let groupNameHeader = document.querySelector('#groupNameHeader');
        userNameHeader.innerHTML = userInfo[0].userName;
        groupNameHeader.innerHTML = userInfo[0].userGroup;
        //console.log(subjectSelector[1][1].length);
        subjectTreeBuild(subjectSelector);
    }
});


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
        window.location.href = '/noteEditor.html';
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
                });
            }
        };
    };
  };