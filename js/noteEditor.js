function noteEditor() {
    let userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    let userNameHeader = document.querySelector('#userNameHeader');
    let groupNameHeader = document.querySelector('#groupNameHeader');
    userNameHeader.innerHTML = userInfo[0].userName;
    groupNameHeader.innerHTML = userInfo[0].userGroup;
    let courseName = document.querySelector('#courseName');
    courseName.innerHTML = sessionStorage.getItem('subjectName');
    let noteTitle = document.querySelector('#addTitle');
    noteTitle.value = sessionStorage.getItem('noteName');
    let xEditor = document.querySelector('#XEditor');
    xEditor.innerHTML = sessionStorage.getItem('noteText');
};
window.onload = noteEditor;