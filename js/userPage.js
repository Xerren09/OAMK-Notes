groupButton.onclick = () => {
    let userGroupChange = document.getElementById('groupCodeTarget');
    let userGroupButton = document.getElementById('groupButton');
    userGroupChange.innerHTML = `<input type="text" class="inputFieldHW" placeholder="Group code">`;
    userGroupButton.innerHTML = `Save`;
        /*groupButton.onclick = () => {
    }*/
}

passwordButton.onclick = () => {
    let passwordChange = document.getElementById('userPasswordTarget');
    let userPassButton = document.getElementById('passwordButton');
    passwordChange.innerHTML = `<div id="passwordChange">
                                    <input type="password" class="inputFieldHW" placeholder="New password">
                                    <input type="password" class="inputFieldHW" placeholder="Retype your password">
                                </div>`;
    userPassButton.innerHTML = `Save`;
    /*passwordButton.onclick = () => {
    }*/
}