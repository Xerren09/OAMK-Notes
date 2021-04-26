let addHbutton = document.getElementById('newAssignmentBtn');

newAssignmentBtn.onclick = () => {
    addHbutton.style.display = 'none';
    let newHWInject = document.getElementById('homeworkTarget');
    newHWInject
    addHomeworkView();
}

function addHomeworkView(){
    document.getElementById('homeworkTarget').innerHTML +=`
        <div class="newNoteContainerHW">
            <div class="homeworkWrite">
                <input type="text" class="inputFieldHW" placeholder="Click here to add text">
            </div>
            <h3>Deadline:<input type="date"></h3>
            <h3>Important:<input type="checkbox"></h3>
            <div id="borderForAssignment">
                <button class="submitNoteButton">Add assignment</button>
            </div>
        </div>
    `;}