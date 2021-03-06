let addSubjectPlusButton = document.querySelector('.fa-plus');
let addSubjectContainer = document.querySelector('#addSubjectContainer');
let addSubjectButton = document.querySelector('#addSubjectButton');
let addSubjectError = document.querySelector('#addSubjectError');
let emptyFieldsError = 'Fill all input fields!';
 
addSubjectPlusButton.onclick = () => {
    if (addSubjectContainer.className == 'hidden') {
        addSubjectPlusButton.style.transform = 'rotate(45deg)' ;
        addSubjectContainer.classList.remove('hidden');
        addSubjectContainer.style.top = '80%';
    } else {
        addSubjectPlusButton.style.transform = 'rotate(0deg)' ;
        addSubjectContainer.classList.add('hidden');
        addSubjectContainer.style.top = '96%';
    }
}

function subjectYearValidation() {
    let subjectYear = document.querySelector('#studyYear');
    if (subjectYear.value > 4) {
        subjectYear.value = 4;
    } else if (subjectYear.value < 1) {
        subjectYear.value = "";
    } else {
        subjectYear.value = subjectYear.value;
    };
};

function subjectPeriodValidation() {
    let subjectPeriod = document.querySelector('#studyPeriod');
    if (subjectPeriod.value > 4) {
        subjectPeriod.value = 4;
    } else if (subjectPeriod.value < 1) {
        subjectPeriod.value = "";
    } else {
        subjectPeriod.value = subjectPeriod.value;
    };
}



function addNewSubject() {
    let subjectName = document.querySelector('#subjectName').value;
    let subjectYear = document.querySelector('#studyYear').value;
    let subjectPeriod = document.querySelector('#studyPeriod').value;
    addSubjectButton.style.transform = 'scale(0.98)' ;
    setTimeout( function() {
        addSubjectButton.style.transform = 'scale(1)' ;
    }, 50 ) ;
    if (subjectName && subjectYear && subjectPeriod) {
        let payload = {
            "subjectName": subjectName,
            "subjectYear": subjectYear,
            "subjectPeriod": subjectPeriod
        }
        let authToken = sessionStorage.getItem('token');
        xrequest.POST("xerrendev01uni.azurewebsites.net/subject/addNew", authToken, payload, function(response) {
            sessionStorage.setItem('subjectSelector', JSON.stringify(response.data.subjectselectorcontent));
            let yearPeriod = document.querySelector('#year'+subjectYear+'Period'+subjectPeriod);
            let li = document.createElement('li');
            let subjectButton = document.createElement('button');
            subjectButton.innerHTML = subjectName;
            let subjectsArray = response.data.subjectselectorcontent[subjectYear][subjectPeriod];
            for(let i = 0; i < subjectsArray.length; i ++) {
                if(subjectsArray[i].subjectName == subjectName) {
                    subjectButton.id = subjectsArray[i].subjectID;
                };
            };
            li.append(subjectButton);
            yearPeriod.append(li);
            let courseName = document.querySelector('#courseName');
            if(sessionStorage.getItem('state') == 'notes') {
                subjectButton.onclick = () => {
                    courseHeader.append(removeCourse);
                    courseName.innerHTML = subjectName;
                    displaySubjectNotes(subjectButton.id);
                    sessionStorage.setItem('subjectName', subjectName);
                    sessionStorage.setItem('subjectId', subjectButton.id);
                };
            } else {
                subjectButton.onclick = () => {
                    let courseNameHeader = document.querySelector('#courseNameHeader');
                    courseNameHeader.innerHTML = subjectName;
                    homeworkDisplay(subjectName);
                    sessionStorage.setItem('subjectName', subjectName);
                    sessionStorage.setItem('subjectId', subjectButton.id);
                }
            }
            addSubjectPlusButton.style.transform = 'rotate(0deg)' ;
            addSubjectContainer.classList.add('hidden');
            addSubjectContainer.style.top = '96%';
        } );
    } else {
        addSubjectError.innerHTML = 'Fill all input fields!';
    }
};
addSubjectButton.onclick = addNewSubject;
