let token = sessionStorage.getItem('token');
xrequest.GET("xerrendev01uni.azurewebsites.net/note/frontPage", token, function(response) {
    if (response.status == 'success') {
        console.log(response);
        let userInfo = response.data.userinfo;
        sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
        userInfoo = userInfo;
        let subjectSelector = response.data.subjectselectorcontent;
        sessionStorage.setItem('subjectSelector', JSON.stringify(subjectSelector));
        let frontPageContent = response.data.frontpagecontent;
        sessionStorage.setItem('frontPageContent', JSON.stringify(frontPageContent));
        sessionStorage.setItem('generalNotes', JSON.stringify(subjectSelector[0][0][0]));
        let userNameHeader = document.querySelector('#userNameHeader');
        let groupNameHeader = document.querySelector('#groupNameHeader');
        userNameHeader.innerHTML = userInfo[0].userName;
        groupNameHeader.innerHTML = userInfo[0].userGroup;
        sessionStorage.setItem('state', 'notes');
        generalNotes();
        subjectTreeBuild(subjectSelector);
    }
});
