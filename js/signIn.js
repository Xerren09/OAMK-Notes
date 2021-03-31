let pageContainer = document.querySelector('#pageContainer');
let signInHeaderButton = document.querySelector("#signInHeaderButton");
let logRegContainer = document.querySelector('#logRegContainer');
let userEmail = document.querySelector('#userEmail');
let userPassword = document.querySelector('#userPassword');

let signInButton = document.createElement('button');
    signInButton.innerHTML = 'Sign-in';
    signInButton.id = 'signInButton';
    signInButton.classList.add('logRegButton', 'signInButton')

let newUserButton = document.createElement('button');
    newUserButton.innerHTML = 'New user?';
    newUserButton.id = 'newUserButton';
    newUserButton.classList.add('logRegButton')

let br = document.createElement('br') ;
let errorMessage = document.createElement('p1');
    errorMessage.id = 'errorMessage';
    errorMessage.style.color = 'red';
    errorMessage.style.opacity = '0';
    let wrongUserPassCombo = 'Wrong user/password combination!';
    let emailInUse = 'There is an account with that email!';
    let notMachingRegPasswords = 'Entered passwords do not match!';

let userPasswordRepeat = document.createElement('input');
    userPasswordRepeat.id = 'userPasswordRepeat';
    userPasswordRepeat.classList.add('logRegInput');
    userPasswordRepeat.type = 'password';
    userPasswordRepeat.placeholder = 'repeat password';
    userPasswordRepeat.style.opacity = '0';

let userName = document.createElement('input');
    userName.id = 'userName';
    userName.classList.add('logRegInput');
    userName.type = 'text';
    userName.placeholder = 'user name';
    userName.style.opacity = '0';

let userGroupCode = document.createElement('input');
    userGroupCode.id = 'userGroupCode';
    userGroupCode.classList.add('logRegInput');
    userGroupCode.type = 'text';
    userGroupCode.placeholder = 'group code';
    userGroupCode.style.opacity = '0';

let registerButton = document.createElement('button');
    registerButton.classList.add('logRegButton', 'signInButton');
    registerButton.id = 'registerButton';
    registerButton.innerHTML = 'Register';
    registerButton.style.opacity = '0';

let haveAccountButton = document.createElement('button');
    haveAccountButton.classList.add('logRegButton');
    haveAccountButton.id = 'haveAccountButton';
    haveAccountButton.innerHTML = 'Have account?';
    haveAccountButton.style.opacity = '0';


signInHeaderButton.onclick = () => {
    signInHeaderButton.remove();
    logRegContainer.append(signInButton, newUserButton);
    logRegContainer.style.top = '30%';
    pageContainer.style.filter = 'blur(5px)';
};

newUserButton.onclick = () => {
    newUserButton.style.transform = 'scale(0.95)' ;
    setTimeout( function() {
        newUserButton.style.transform = 'scale(1)' ;
    }, 30 ) ;
    signInButton.style.opacity = '0';
    newUserButton.style.opacity = '0';
    errorMessage.style.opacity = '0';
    setTimeout(() => {
        logRegContainer.style.height = '315px';
        signInButton.remove();
        newUserButton.remove();
        errorMessage.remove();
        br.remove();
        logRegContainer.append(userPasswordRepeat, userName, userGroupCode, registerButton, haveAccountButton);
        setTimeout(() => {
            userName.style.opacity = '1';
            userGroupCode.style.opacity = '1';
            userPasswordRepeat.style.opacity = '1';
            registerButton.style.opacity = '1';
            haveAccountButton.style.opacity = '1';
        }, 300);
    }, 600) ;
};

haveAccountButton.onclick = () => {
    haveAccountButton.style.transform = 'scale(0.95)' ;
    setTimeout( function() {
        haveAccountButton.style.transform = 'scale(1)' ;
    }, 30 ) ;
    userName.style.opacity = '0';
    userGroupCode.style.opacity = '0';
    userPasswordRepeat.style.opacity = '0';
    registerButton.style.opacity = '0';
    haveAccountButton.style.opacity = '0';
    errorMessage.style.opacity = '0';
    setTimeout(() => {
        logRegContainer.style.height = '170px';
        userName.remove();
        userGroupCode.remove();
        registerButton.remove();
        haveAccountButton.remove();
        userPasswordRepeat.remove();
        errorMessage.remove();
        br.remove();
        logRegContainer.append(signInButton, newUserButton);
        setTimeout(() => {
            signInButton.style.opacity = '1';
            newUserButton.style.opacity = '1';
        }, 300);
    }, 600);
};

signInButton.onclick = () => {
    signInButton.style.transform = 'scale(0.95)' ;
    setTimeout( function() {
        signInButton.style.transform = 'scale(1)' ;
    }, 30 ) ;
    errorMessage.innerHTML = wrongUserPassCombo;
    logRegContainer.append(br, errorMessage);
    logRegContainer.style.height = '190px';
    setTimeout(() => {
        errorMessage.style.opacity = '1';
    }, 200);
};

registerButton.onclick = () => {
    registerButton.style.transform = 'scale(0.95)' ;
    setTimeout( function() {
        registerButton.style.transform = 'scale(1)' ;
    }, 30 ) ;
    errorMessage.innerHTML = notMachingRegPasswords;
    logRegContainer.append(br, errorMessage);
    logRegContainer.style.height = '335px';
    setTimeout(() => {
        errorMessage.style.opacity = '1';
    }, 200);
};