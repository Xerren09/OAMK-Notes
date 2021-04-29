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
    
    console.log('asdasd');
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
    console.log(sessionStorage.getItem("token"));
    addSubjectButton.style.transform = 'scale(0.98)' ;
    setTimeout( function() {
        addSubjectButton.style.transform = 'scale(1)' ;
    }, 50 ) ;
    if (subjectName && subjectYear && subjectPeriod) {
        let payload = {
            "subjectname": subjectName,
            "subjectyear": subjectYear,
            "subjectperiod": subjectPeriod
        }
        let authToken = sessionStorage.getItem('token');
        xrequest.POST("http://xerrendev01uni.azurewebsites.net/subject/addNew", authToken, payload, function(response) {
            console.log(response);
            let yearPeriod = document.querySelector('#year'+subjectYear+'Period'+subjectPeriod);
            let li = document.createElement('li');
            let subjectButton = document.createElement('button');
            subjectButton.innerHTML = subjectName;
            let subjectsArray = response.data[subjectYear][subjectPeriod];
            for(let i = 0; i < subjectsArray.length; i ++) {
                if(subjectsArray[i].subjectName == subjectName) {
                    subjectButton.id = subjectsArray[i].subjectID;
                };
            };
            li.append(subjectButton);
            yearPeriod.append(li);
            let courseName = document.querySelector('#courseName');
            subjectButton.onclick = () => {
                courseName.innerHTML = subjectName;
              };
            addSubjectPlusButton.style.transform = 'rotate(0deg)' ;
            addSubjectContainer.classList.add('hidden');
            addSubjectContainer.style.top = '96%';
        } );
    } else {
        addSubjectError.innerHTML = 'Fill all input fields!';
    }
};
addSubjectButton.onclick = addNewSubject;
