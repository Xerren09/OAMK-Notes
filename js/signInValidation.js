//function validation() {
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
            console.log(matchingPasswords);
            setTimeout(() => {
                errorMessage.style.opacity = '1';
            }, 200);
        } else {
            userPasswordRepeat.style.borderColor = approvedBorder;
            br.remove();
            errorMessage.remove();
            logRegContainer.style.height = '315px';
            matchingPasswords = true;
            console.log(matchingPasswords);
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

function register() {
    registerButton.disabled = true;
    haveAccountButton.disabled = true;
    if (correctEmail && correctPassLength && matchingPasswords && correctUserName && correctGroupCode) {
        let payload = {
            userPassword: document.getElementById("userPassword").value,
            userEmail: document.getElementById("userEmail").value,
            userName: document.getElementById("userName").value,
            userGroup: document.getElementById("userGroupCode").value
        }
        xrequest.POST("http://xerrendev01uni.azurewebsites.net/users/register", "0000", payload, function(response) {	
            console.log(response);
            if (response.status == "success")
            {
                let token = response.data.token;
                sessionStorage.setItem('token', token);
                let payload = {
                    "subjectname" : "General Notes",
                    "subjectyear" : 0,
                    "subjectperiod" : 0
                }
                xrequest.POST("http://xerrendev01uni.azurewebsites.net/subject/addNew", token, payload, function(response) {
                console.log(response);
                window.location.href = "/notes.html";
            })
                //redirect!
                //window.location.href = "/notes.html";
            }             
            else if (response.status == "fail" && response.data.type == "credentials_exist")
            {
                errorMessage.innerHTML = "The provided email address is already in use.";
                logRegContainer.append(br, errorMessage);
                logRegContainer.style.height = '335px';
                setTimeout(() => {
                    errorMessage.style.opacity = '1';
                }, 200);
                document.getElementById("registerButton").disabled = false;
                document.getElementById("haveAccountButton").disabled = false;
            }
            else if (response.status == "error" && response.data.type == "internal_database")
            {
                errorMessage.innerHTML = "Internal error, please try again later.";
                logRegContainer.append(br, errorMessage);
                logRegContainer.style.height = '190px';
                setTimeout(() => {
                    errorMessage.style.opacity = '1';
                }, 200);
                document.getElementById("registerButton").disabled = false;
                document.getElementById("haveAccountButton").disabled = false;
            }
        });
    } else {
        errorMessage.innerHTML = "Please check all input fields!";
                logRegContainer.append(br, errorMessage);
                logRegContainer.style.height = '335px';
                setTimeout(() => {
                    errorMessage.style.opacity = '1';
                }, 200);
                document.getElementById("registerButton").disabled = false;
                document.getElementById("haveAccountButton").disabled = false;
    }
}

registerButton.onclick = register;

function login() {
    document.getElementById("signInButton").disabled = true;
    document.getElementById("newUserButton").disabled = true;
    let payload = {
        userPassword: document.getElementById("userPassword").value,
        userEmail: document.getElementById("userEmail").value
    }
    xrequest.POST("http://xerrendev01uni.azurewebsites.net/users/login", "0000", payload, function(response) {	
        console.log(response);
        if (response.status == "success")
        {
            let token = response.data.token;
            sessionStorage.setItem('token', token);
            //redirect!
            window.location.href = "/notes.html";
        }
        else if (response.status == "fail" && response.data.type == "credentials_unknown")
        {
            errorMessage.innerHTML = "You have entered an invalid username or password.";
            logRegContainer.append(br, errorMessage);
            logRegContainer.style.height = '190px';
            setTimeout(() => {
                errorMessage.style.opacity = '1';
            }, 200);
            document.getElementById("signInButton").disabled = false;
            document.getElementById("newUserButton").disabled = false;
        }
        else if (response.status == "error" && response.data.type == "internal_database")
        {
            errorMessage.innerHTML = "Internal error, please try again later.";
            logRegContainer.append(br, errorMessage);
            logRegContainer.style.height = '190px';
            setTimeout(() => {
                errorMessage.style.opacity = '1';
            }, 200);
            document.getElementById("signInButton").disabled = false;
            document.getElementById("newUserButton").disabled = false;
        }
    });
}

signInButton.onclick = login;
//};
//window.onload = validation;