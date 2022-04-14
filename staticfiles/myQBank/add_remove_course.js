
add_course()

function add_course() {
    const csrftoken = getCookie('csrftoken')
    // let's get all the buttons which reference a course
    const profilePage = document.querySelector('#profile-checker')
    courseNameNodeList = document.querySelectorAll(".available-course")
    courseNameNodeList.forEach(course => {
        var idCourseName = course.getAttribute('id')
        var courseID = parseInt(idCourseName.replace('course', ''))



        fetch(`/addCourse/${courseID}`)
        .then(response => response.json())
        .then(taken => {
            check_course = taken['taking']
            if (check_course === true) {
                var show_state = document.querySelector(`#course${courseID}`)
                show_state.innerHTML = "Remove"
            }
        })

        var inputCourseID = course.getAttribute('name')
        course.addEventListener('click', () => {
            fetch(`/addCourse/${courseID}`, {
                method: 'POST',
                body: JSON.stringify({
                    courseID: inputCourseID
                }),
                headers:{'X-CSRFToken': csrftoken},
                mode: 'same-origin'
            })
            courseButton = document.querySelector(`#course${courseID}`)
            if (profilePage !== null && courseButton.innerHTML === "Remove") {
                stop_showing = document.querySelector(`#card${courseID}`)
                stop_showing.style.display = 'none'
                courseButton.innerHTML = "Remove"
            } else if(profilePage == null && courseButton.innerHTML === "Add") {
                courseButton.innerHTML = "Remove"
            }
             else if (profilePage == null && courseButton.innerHTML === "Remove") {
                courseButton.innerHTML = "Add"
            }

        })
    }) 
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break
            }
        }
    }
    return cookieValue;
}

