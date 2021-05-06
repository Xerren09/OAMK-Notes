let token = sessionStorage.getItem('token');
let userNameHeader = document.querySelector('#userNameHeader');
let groupNameHeader = document.querySelector('#groupNameHeader');
let userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
userNameHeader.innerHTML = userInfo[0].userName;
groupNameHeader.innerHTML = userInfo[0].userGroup;
let userEmail = document.querySelector('#userEmail');
let userName = document.querySelector('#userName');
let groupCodeTarget = document.querySelector('#groupCodeTarget');
let userPasswordTarget = document.querySelector('#userPasswordTarget');
let changeGroup = document.querySelector('#groupButton');
let changePassword = document.querySelector('#passwordButton');
let userEmailString = '';

function userInfoGet(authtoken) {
    xrequest.GET("xerrendev01uni.azurewebsites.net/users/getUserInfo", authtoken, function(response) {
        let userInfo = response.data;
        userEmail.innerHTML = userInfo.userEmail;
        userEmailString = userInfo.userEmail;
        userName.innerHTML = userInfo.userName;
        groupCodeTarget.innerHTML = userInfo.userGroup;
        userPasswordTarget.innerHTML = userInfo.userPassword;
        changeGroup.innerHTML = 'Change Group';
        changePassword.innerHTML = 'Change Password';
        changeGroup.onclick = groupChange;
        changePassword.onclick = passwordChange;
    });
};
userInfoGet(sessionStorage.getItem('token'));

function groupChange() {
    let inputGroup = document.createElement('input');
    inputGroup.id = 'inputGroup'
    groupCodeTarget.innerHTML = '';
    groupCodeTarget.append(inputGroup);
    changeGroup.innerHTML = 'Save';
    changeGroup.onclick = groupSave;
}
function groupSave() {
    let inputGroup = document.querySelector('#inputGroup');
    let payload = {
        "userGroup": inputGroup.value
    };
    xrequest.POST('xerrendev01uni.azurewebsites.net/users/updateGroupCode', token, payload, function(response) {
        userInfoGet(sessionStorage.getItem('token'));
    });
}

function passwordChange() {
    let newPassword = document.createElement('input');
    newPassword.id = 'newPassword';
    newPassword.type = 'password';
    let newPasswordRepeat = document.createElement('input');
    newPasswordRepeat.id = 'newPasswordRepeat';
    newPasswordRepeat.type = 'password';
    userPasswordTarget.innerHTML = '';
    userPasswordTarget.append(newPassword, newPasswordRepeat);
    changePassword.innerHTML = 'Save';
    changePassword.onclick = passwordSave;
}

function passwordSave() {
    let newPassword = document.querySelector('#newPassword');
    let newPasswordRepeat = document.querySelector('#newPasswordRepeat');
    let br = document.createElement('br');
    let error = document.createElement('p1');
    error.classList.add('passwordChangeError');
    error.innerHTML = 'Passwords do not match!';
    let error2 = document.createElement('p1');
    error2.classList.add('passwordChangeError');
    error2.innerHTML = 'Use at least 8 characters!';
    let success = document.createElement('p1');
    success.classList.add('success');
    success.innerHTML = 'Password saved!';
    if (newPassword.value && newPassword.value.length > 7 && newPassword.value == newPasswordRepeat.value) {
        let payload = {
            "userPassword": newPassword.value,
            "userEmail": userEmailString
        }
        xrequest.POST('xerrendev01uni.azurewebsites.net/users/updatePassword', token, payload, function(response) {
            if (response.status == "success") {
                let token = response.data.token;
                sessionStorage.setItem('token', token);
                userPasswordTarget.innerHTML = '';
                userPasswordTarget.append(success);
                setTimeout(() => {userInfoGet(token)}, 2000);
            };
        });
    } else if (newPassword.value.length < 8) {
        userPasswordTarget.innerHTML = '';
        userPasswordTarget.append(newPassword, newPasswordRepeat, br, error2);
    } else if (newPassword.value.length > 7 && newPassword.value != newPasswordRepeat.value) {
        userPasswordTarget.innerHTML = '';
        userPasswordTarget.append(newPassword, newPasswordRepeat, br, error);
    };
};
