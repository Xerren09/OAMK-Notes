function XEditorCommandPalette(cmdID) {
    switch(cmdID)
    {
        case "i":   //italic
            document.execCommand('italic', false, null);
            break;
        case "b":   //bold
            document.execCommand('bold', false, null);
            break; 
        case "u":   //underline
            document.execCommand('underline', false, null);
            break;
        case "s":   //strikethrough
            document.execCommand('strikethrough', false, null);
            break;
        case "al":  //align left
            document.execCommand('justifyLeft', false, null);
            break;
        case "ac":  //align center
            document.execCommand('justifyCenter', false, null);
            break;
        case "ar":  //align right
            document.execCommand('justifyRight', false, null);
            break;
        case "ul":  //unordered list
            document.execCommand('insertOrderedList', false, null);
            break;
        case "cc":  //change color
            let selectedcolor = String(document.getElementById("XEditorColorSelector").value);
            document.execCommand('foreColor', false, selectedcolor);
            break;
        case "cf":  //change font
            let selectedFont = String(document.getElementById("XEditorFontSelector").value);
            document.execCommand('fontName', false, selectedFont);
            break;
        case "cs":  //change size
            let selectedSize = String(document.getElementById("XEditorSizeSelector").value);
            document.execCommand('fontSize', false, selectedSize);
            break;
        case "exps": //export to string
            let editorArea = document.getElementById("XEditor");
            let htmlstr = editorArea.innerHTML.toString();
            let noteTitle = document.querySelector('#addTitle').value.toString();
            let noteId = sessionStorage.getItem('noteId');
            let important = document.querySelector('#important');
            var isImportant;
            if(important.checked) {
                isImportant = 1;
            } else {
                isImportant = 0;
            };
            let timestamp = Date.now();
            let newNoteUrl = 'xerrendev01uni.azurewebsites.net/note/addNew';
            let updateUrl = 'xerrendev01uni.azurewebsites.net/note/updateNote';
            if (noteId == 'newNote') {
                let payload = {
                    "subjectID": sessionStorage.getItem('subjectId'),
                    "noteName": noteTitle,
                    "noteDate": timestamp,
                    "noteImportance": isImportant,
                    "noteText": htmlstr
                };
                xrequest.POST(newNoteUrl, sessionStorage.getItem("token"), payload, function(response){
                    console.log(response);
                    window.location.href = './notes.html';
                    console.log(isImportant);
                });
            } else {
                let payload = {
                    "noteID": noteId,
                    "noteText": htmlstr
                };
                xrequest.POST(updateUrl, sessionStorage.getItem("token"), payload, function(response){
                    //console.log(response);
                    window.location.href = './notes.html';
                });
            }
            break;
        default:    //escape for invalid code
            break;
    }
}