
function addHomeworkView(){
document.getElementById('homeworkTarget').innerHTML +=`
    <div class="newNoteContainerHW">
        <h2><input type="text" class="inputFieldHW" placeholder="Click here to edit the title"></h2>
        <div class="homeworkWrite"><input type="text" class="inputFieldHW" placeholder="Click here to add text"></div>
        <h3>Important:<input type="checkbox"></h3>
        <div><button class="submitNoteButton">Add homework</button></div>
    </div>
`;}