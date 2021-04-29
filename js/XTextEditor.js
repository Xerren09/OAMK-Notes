const xresponse = require("../xresponse");

function XEditorCommandPalette(cmdID, textcontent=undefined) {
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
            xrequest.POST("http://xerrendev01uni.azurewebsites.net/note/addNew", sessionStorage.getItem("token"), htmlstr, function(response){
                //error handling here!
            });
            break;
        case "imps": //import from string
        textcontent = "<div><b>asd so this is also bold.</b> this is no longer bold.</div><div>&lt;script&gt; let randomtext=\"011101\"; console.log(randomtext); &lt;/script&gt;<br></div>";
            xrequest.POST("http://xerrendev01uni.azurewebsites.net/note/getNote", sessionStorage.getItem("token"), {noteid: sessionStorage.getItem("redirectnoteid")}, function(response){
                let editorArea = document.getElementById("XEditor");    
                editorArea.innerHTML = textcontent;
                //error handling here!
            }); 
            break;
        default:    //escape for invalid code
            break;
    }
}