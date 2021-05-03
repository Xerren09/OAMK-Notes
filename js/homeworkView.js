let token = sessionStorage.getItem('token');
xrequest.GET("http://xerrendev01uni.azurewebsites.net/homework/getAll", token, function(response) {
    console.log(response);
    sessionStorage.setItem('assignmentList', JSON.stringify(response.data.assignmentlist));
});

let userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
let userNameHeader = document.querySelector('#userNameHeader');
let groupNameHeader = document.querySelector('#groupNameHeader');
userNameHeader.innerHTML = userInfo[0].userName;
groupNameHeader.innerHTML = userInfo[0].userGroup;

subjectTreeBuild(JSON.parse(sessionStorage.getItem('subjectSelector')));

let courseNameHeader = document.querySelector('#courseNameHeader');

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
                            courseNameHeader.innerHTML = subject.subjectName;
                            homeworkDisplay(subject.subjectName);
                            //displaySubjectNotes(subjectButton.id);
                            sessionStorage.setItem('subjectId', subjectButton.id);
                            sessionStorage.setItem('subjectName', subject.subjectName);
                        };
                    };
                };
            };
        };
    };
};

function homeworkDisplay(subjectName) {
    let assigmentList = JSON.parse(sessionStorage.getItem('assignmentList'));
    let homeworkTarget = document.querySelector('#homeworkTarget');
    homeworkTarget.innerHTML = '';
    let homeworkContainer = document.querySelector('.homeworkContainer')
    let newHomeworkContainer = document.querySelector('#newHomeworkContainer');
    newHomeworkContainer.innerHTML = '';
    let homeworkHeader = document.querySelector('.homeworkHeader');
    let h2 = document.createElement('h2');
    h2.innerHTML = 'Current Assignments';
    let newAssignementBtn = document.createElement('button');
    newAssignementBtn.id = 'newAssignmentBtn';
    newAssignementBtn.innerHTML = 'New Assignment +';
    newAssignementBtn.onclick = addHomeworkMenu;
    homeworkHeader.innerHTML = '';
    homeworkHeader.append(h2, newAssignementBtn);
    //homeworkContainer.prepend(homeworkHeader);
    if(assigmentList) {
        for (let i = 0; i < assigmentList.length; i ++) {
            if(assigmentList[i].subjectName == subjectName) {
                let newHomework = document.createElement('div');
                newHomework.classList.add('newHomework');
                let newAssignment = document.createElement('button');
                newAssignment.classList.add('newAssignment')
                let assignmentLayout = document.createElement('table');
                assignmentLayout.classList.add('assignmentLayout');
                let td1 = document.createElement('td');
                td1.classList.add('courseName');
                td1.innerHTML = assigmentList[i].subjectName;
                let td2 = document.createElement('td');
                td2.classList.add('homeworkText');
                td2.innerHTML = assigmentList[i].homeworkName;
                let td3 = document.createElement('td');
                td3.classList.add('homeworkDeadline');
                let timestamp = assigmentList[i].homeworkDate;
                let now = new Date().getTime();
                let deadLineString = new Date(timestamp).toDateString();
                td3.innerHTML = deadLineString;
                let td4 = document.createElement('td');
                let removeButton = document.createElement('button');
                removeButton.classList.add('homeworkRemoveBtn');
                removeButton.innerHTML = `<i class="far fa-trash-alt"></i>`;
                td4.append(removeButton);
                if ((timestamp - now) < 172800000) {
                    let td5 = document.createElement('td');
                    td5.classList.add('homeworkImportant');
                    td5.innerHTML = '<i class="fas fa-exclamation"></i>'
                    assignmentLayout.append(td1, td2, td3, td5, td4);
                } else{
                    assignmentLayout.append(td1, td2, td3, td4);
                }
                newAssignment.append(assignmentLayout);
                newHomework.append(newAssignment);
                newHomeworkContainer.append(newHomework);
            };
        };
    };
};

function addHomeworkMenu() {
    let homeworkHeader = document.querySelector('.homeworkHeader');
    let menuButton = document.querySelector('#newAssignmentBtn');
    menuButton.remove();
    let homeworkTarget = document.querySelector('#homeworkTarget');
    let newNoteContainerHW = document.createElement('div');
    newNoteContainerHW.classList.add('newNoteContainerHW');
    let homeworkWrite = document.createElement('div');
    homeworkWrite.classList.add('homeworkWrite');
    let inputFieldHW = document.createElement('input');
    inputFieldHW.classList.add('inputFieldHW');
    inputFieldHW.type = 'text';
    inputFieldHW.placeholder = "Click here to add text";
    homeworkWrite.append(inputFieldHW);
    let h3 = document.createElement('h3');
    h3.innerHTML = 'Deadline: ';
    let dateInput = document.createElement('input');
    dateInput.classList.add('dateInput');
    dateInput.type = 'date';
    h3.append(dateInput);
    let borderForAssignment = document.createElement('div');
    borderForAssignment.id = 'borderForAssignment';
    let submitNoteButton = document.createElement('button');
    submitNoteButton.classList.add('submitNoteButton');
    submitNoteButton.innerHTML = 'Add assignment';
    borderForAssignment.append(submitNoteButton);
    newNoteContainerHW.append(homeworkWrite, h3, borderForAssignment);
    homeworkTarget.append(newNoteContainerHW);
    submitNoteButton.onclick = () => {
        let dateString = dateInput.value;
        let dotString = dateString.replaceAll('-', '.');
        let timestamp = new Date(dotString).getTime();
        let payload = {
            "subjectID": sessionStorage.getItem('subjectId'),
            "homeworkName": inputFieldHW.value,
            "homeworkDate": timestamp
        }
        xrequest.POST('http://xerrendev01uni.azurewebsites.net/homework/addNew', token, payload, function(response){
            sessionStorage.setItem('assignmentList', JSON.stringify(response.data.assignmentlist)); 
            console.log(response);
            homeworkDisplay(sessionStorage.getItem('subjectName'));
        })
    }
}
