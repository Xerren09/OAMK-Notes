function subjectCaret() {
  var toggler = document.getElementsByClassName("caret");
  var i;

  for (i = 0; i < toggler.length; i++) {
    toggler[i].addEventListener("click", function() {
      this.parentElement.querySelector(".nested").classList.toggle("active");
      this.classList.toggle("caret-down");
    });
  }
}

subjectCaret();

function subjectTreeBuild(subjects) {
    for (let i = 0; i < 4; i ++) {
        let year = subjects[i+1];
        for(let l = 0; l < 4; l ++) {
            let period = year[l+1];
            for(let k = 0; k < period.length; k ++){
                let subject = period[k];
                let yearPeriod = document.querySelector('#year'+(i+1)+'Period'+(l+1));
                let li = document.createElement('li');
                let subjectButton = document.createElement('button');
                subjectButton.innerHTML = subject.subjectName;
                subjectButton.id = subject.subjectID;
                li.append(subjectButton);
                yearPeriod.append(li);
                let courseName = document.querySelector('#courseName');
                subjectButton.onclick = () => {
                  courseName.innerHTML = subject.subjectName;
                  displaySubjectNotes(subjectButton.id);
                  sessionStorage.setItem('subjectId', subjectButton.id);
                  //console.log(sessionStorage.getItem('subjectId'));
                  sessionStorage.setItem('subjectName', subject.subjectName);
                  //console.log(sessionStorage.getItem('subjectName'));
                }
            };
        };
    };
};


