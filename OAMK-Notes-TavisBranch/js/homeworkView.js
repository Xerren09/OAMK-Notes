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
            <h2><input type="text" class="inputFieldHW" placeholder="Click here to edit the title"></h2>
            <div class="homeworkWrite"><input type="text" class="inputFieldHW" placeholder="Click here to add text"></div>
            <h3>Deadline:<input type="date"></h3>
            <h3>Important:<input type="checkbox"></h3>
            <div id="borderForAssignment"><button class="submitNoteButton">Add assignment</button></div>
        </div>
    `;}
    
        /* 
        need to limit this to only add one div, maybe have the new assignment 
        button removed once pressed and return once a new homework has been saved 
        */
