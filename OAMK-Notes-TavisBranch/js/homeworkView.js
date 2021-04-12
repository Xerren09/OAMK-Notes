
function addHomeworkView(){
document.getElementById('homeWorkTarget').innerHTML +=`
<head>
<title>Homework</title>
<meta charset="UTF-8">
<link rel="stylesheet" href="css/style.css">
<link rel="stylesheet" href="css/dropMenu.css">
<link rel="stylesheet" href="css/sideMenu.css">
<link rel="stylesheet" href="css/addSubject.css">
<link rel="stylesheet" href="css/homeworkView.css">
<link rel="stylesheet" href="fontawesome-free-5.15.1-web/css/all.css">
<link rel="preconnect" href="https://fonts.gstatic.com/%22%3E">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=PT+Sans+Narrow:wght@400;700&display=swap" rel="stylesheet">
</head>
<body>

    <div class="newNoteContainerHW">
        <h3>Add homework</h3>
        <h2><input type="text" class="inputFieldHW" placeholder="Click here to edit the title"></h2>
        <div class="homeworkWrite"><input type="text" class="inputFieldHW" placeholder="Click here to add text"></div>
        <h3>Important:<input type="checkbox"></h3>
        <div><button class="submitNoteButton">Save</button></div>
    </div>
</div>
<script src="./js/addSubject.js"></script>
<script src="./js/subjectTree.js"></script>
</body>
`;}