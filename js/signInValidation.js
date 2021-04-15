let correctEmail = false;
let correctPassLength = false;
let matchingPasswords = false;
let correctUserName = false;
let correctGroupCode = false;

function registerValidation() {
    userPassword.oninput = () => {
        let passLength = userPassword.value.length ;
        if (passLength <=7 && logRegState == 'register') {
            userPassword.style.borderColor = errorBorder;
            errorMessage.innerHTML = shortPassword;
            logRegContainer.append(br, errorMessage);
            logRegContainer.style.height = '335px';
            correctPassLength = false;
            setTimeout(() => {
                errorMessage.style.opacity = '1';
            }, 200);
        } else if (logRegState == 'login') {
            userPassword.style.borderColor = normalBorder;
            br.remove();
            errorMessage.remove();
        } else {
            userPassword.style.borderColor = approvedBorder;
            br.remove();
            errorMessage.remove();
            logRegContainer.style.height = '315px';
            correctPassLength = true;
        };
    };

    userPasswordRepeat.oninput = () => {
        let regPassword = userPassword.value;
        let regPasswordRepeat = userPasswordRepeat.value;
        if (regPasswordRepeat != regPassword) {
            userPasswordRepeat.style.borderColor = errorBorder;
            errorMessage.innerHTML = notMachingRegPasswords;
            logRegContainer.append(br, errorMessage);
            logRegContainer.style.height = '335px';
            matchingPasswords = false;
            setTimeout(() => {
                errorMessage.style.opacity = '1';
            }, 200);
        } else {
            userPasswordRepeat.style.borderColor = approvedBorder;
            br.remove();
            errorMessage.remove();
            logRegContainer.style.height = '315px';
            matchingPasswords = true;
        };
    };

    userEmail.oninput = () => {
        let emailString = userEmail.value;
        if (emailString.match(/^[a-zA-Z0-9_.+-]+@students\.oamk\.fi$/) && logRegState == 'register') {
            userEmail.style.borderColor = approvedBorder;
            br.remove();
            errorMessage.remove();
            logRegContainer.style.height = '315px';
            correctEmail = true;
        } else if (logRegState == 'login') {
            userEmail.style.borderColor = normalBorder;
            br.remove();
            errorMessage.remove();
        } else {
            userEmail.style.borderColor = errorBorder;
            errorMessage.innerHTML = oamkEmail;
            logRegContainer.append(br, errorMessage);
            logRegContainer.style.height = '335px';
            correctEmail = false;
            setTimeout(() => {
                errorMessage.style.opacity = '1';
            }, 200);
        };
    };

    userName.oninput = () => {
        let userNameString = userName.value;
        if (userNameString.length > 0) {
            userName.style.borderColor = approvedBorder;
            correctUserName = true;
        } else {
            userName.style.borderColor = errorBorder;
            correctUserName = false;
        };
    };

    userGroupCode.oninput = () => {
        let groupCodeeString = userGroupCode.value;
        if (groupCodeeString.length > 0) {
            userGroupCode.style.borderColor = approvedBorder;
            correctGroupCode = true;
        } else {
            userGroupCode.style.borderColor = errorBorder;
            correctGroupCode = false;
        };
    };
};
registerValidation();

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
    /*
    errorMessage.innerHTML = notMachingRegPasswords;
    logRegContainer.append(br, errorMessage);
    logRegContainer.style.height = '335px';
    setTimeout(() => {
        errorMessage.style.opacity = '1';
    }, 200);
    */
    registerButton.style.transform = 'scale(0.95)' ;
    setTimeout( function() {
        registerButton.style.transform = 'scale(1)' ;
    }, 30 ) ;
   if (correctEmail && correctPassLength && matchingPasswords && correctUserName && correctGroupCode){
       console.log('All fields are valid');
   };
};