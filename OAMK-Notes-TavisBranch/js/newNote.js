let rightSideContainer = document.querySelector('#rightSideContainer');
let newNoteContainer = document.querySelector('.newNoteContainer');
let addNewNote = document.querySelector('.addNewNote');
addNewNote.onclick = () => {
    newNoteContainer.style.opacity = '0';
    setTimeout(() => {
        newNoteContainer.remove();
        rightSideContainer.innerHTML = `
        <div class="newNoteContainerWrite">
        <div id="XEditorContainer" >
            <fieldset id="XEditorControls">
                <button id="XEditorItalic" onclick="XEditorCommandPalette('i')"><i class="fa fa-italic"></i></button>
                <button id="XEditorBold" onclick="XEditorCommandPalette('b')"><i class="fa fa-bold"></i></button>
                <button id="XEditorUnderline" onclick="XEditorCommandPalette('u')"><i class="fa fa-underline"></i></button>
                <button id="XEditorStrikethrough" onclick="XEditorCommandPalette('s')"><i class="fa fa-strikethrough"></i></button>
                <fieldset id="XEditorFontGroup">
                    <select id="XEditorFontSelector" onchange="XEditorCommandPalette('cf')">
                        <option value="'PT Sans Narrow', sans-serif">PT Sans Narrow</option>
                        <option value="Arial">Arial</option>
                        <option value="Helvetica">Helvetica</option>
                        <option value="Times New Roman">Times New Roman</option>
                        <option value="Sans serif">Sans serif</option>
                        <option value="Courier New">Courier New</option>
                        <option value="Verdana">Verdana</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Palatino">Palatino</option>
                        <option value="Garamond">Garamond</option>
                        <option value="Comic Sans MS">Comic Sans MS</option>
                        <option value="Arial Black">Arial Black</option>
                        <option value="Tahoma">Tahoma</option>
                        <option value="Comic Sans MS">Comic Sans MS</option>
                    </select>
                    <select id="XEditorSizeSelector" onclick="XEditorCommandPalette('cs')">
                        <option value="1">8</option>			
                        <option value="2">10</option>
                        <option value="3">11</option>
                        <option value="4">14</option>
                        <option value="5">18</option>
                        <option value="6">24</option>
                        <option value="7">36</option>
                    </select>
                </fieldset>
                <input id="XEditorColorSelector" type="color" onchange="XEditorCommandPalette('cc')"> 
                <button id="XEditorAL" onclick="XEditorCommandPalette('al')"><i class="fa fa-align-left"></i></button>
                <button id="XEditorAC" onclick="XEditorCommandPalette('ac')"><i class="fa fa-align-center"></i></button>
                <button id="XEditorAR" onclick="XEditorCommandPalette('ar')"><i class="fa fa-align-right"></i></button>
                <button id="XEditorUL" onclick="XEditorCommandPalette('ul')"><i class="fa fa-list-ul"></i></button>
                <button id="XEditorEX" onclick="XEditorCommandPalette('exps')"><i class="fa fa-file-export"></i></button>		
            </fieldset>
            
        </div>
        <h3><input type="text" placeholder="Add a title"</h3>
        <div id="XEditor" contenteditable="true" data-text="Enter comment....">
    
        </div>
        </div>`;
        setTimeout(() => {
            let newNoteContainerWrite = document.querySelector('.newNoteContainerWrite');
            newNoteContainerWrite.style.top = '0%';
        }, 50);
    }, 510);
}