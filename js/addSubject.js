let addSubjectPlusButton = document.querySelector('.fa-plus');
let addSubjectContainer = document.querySelector('#addSubjectContainer');
let addSubjectButton = document.querySelector('#addSubjectButton');
 
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

addSubjectButton.onclick = () => {
    addSubjectButton.style.transform = 'scale(0.98)' ;
    setTimeout( function() {
        addSubjectButton.style.transform = 'scale(1)' ;
    }, 50 ) ;
    addSubjectPlusButton.style.transform = 'rotate(0deg)' ;
    addSubjectContainer.classList.add('hidden');
    addSubjectContainer.style.top = '96%';
}