allowAttempt()

function allowAttempt() {
    const csrftoken = getCookie('csrftoken')
    var attempt_button = document.querySelector('#attemptButton')
    var attempt_button_id = attempt_button.dataset.id
    var courseID = parseInt(attempt_button_id)
    var attemptedQuestionsList = []
    var allready_attempted = {}
    fetch(`/addCourse/${courseID}`)
        .then(response => response.json())
        .then(taken => {
            check_course = taken['taking']
            if (check_course === true) {
                show_button = attempt_button.style.display = 'block'
                attempt_button.addEventListener('click', () => {
                    if (attempt_button.innerHTML === "Attempt") {
                        attempt_button.innerHTML = "Stop Attempt"
                        attempt_button.classList.add("btn-success")
                        attempt_button.classList.remove("btn-secondary")
                        answer_set = document.querySelectorAll(".answer")
                        answer_set.forEach(answer => {
                            var clickedness = answer.dataset.clicked
                            clickedness = parseInt(clickedness)
                            if (clickedness === 0) {
                                answer.addEventListener('click', () => {
                                    isStillAttempting = document.querySelector("#attemptButton").innerHTML
                                    if (isStillAttempting === "Stop Attempt") {
                                        var questionID = parseInt(answer.dataset.questionid)
                                        var questionNumber = document.querySelector(`#question${questionID}`)
                                        if (!attemptedQuestionsList.includes(`question${questionID}`)) {
                                            attemptedQuestionsList.push(`question${questionID}`)
                                        }
                                        if (parseInt(answer.dataset.clicked) === 0) {
                                            questionNumber.dataset.attempts = parseInt(questionNumber.dataset.attempts) + 1
                                        }
                                        answer.dataset.clicked = 1
                                        var trueness = answer.dataset.correctness
                                        var button2 = document.querySelector('#attemptButton')
                                        if (button2.innerHTML === "Stop Attempt" && trueness === "True") {
                                            answer.style.color = "green"
                                            answer.dataset.correctClick = "yes"
                                            questionNumber.dataset.correct = 1
                                        } else if (button2.innerHTML === "Stop Attempt" && trueness === "False") {
                                            answer.style.color = "red"
                                        }

                                    }
                                })

                            }

                        })

                    } else if (attempt_button.innerHTML === "Stop Attempt") {
                        attemptedQuestionsList.forEach(question => {
                            var questionDetails = document.querySelector(`#${question}`)
                            var correctAnswerClicked = questionDetails.dataset.correct
                            if (correctAnswerClicked === undefined) {
                                var correct = 0
                            } else {
                                var correct = parseInt(questionDetails.dataset.correct)
                            }
                            var question_id = parseInt(questionDetails.dataset.questionid)
                            var attempts = parseInt(questionDetails.dataset.attempts)
                            var course = questionDetails.dataset.course
                            var topic = questionDetails.dataset.topic

                            if (allready_attempted[`${question}`] === undefined || allready_attempted[`${question}`] !== attempts) {
                                allready_attempted[`${question}`] = attempts
                                console.log(`Correct Clicks: ${correct},\nQuestion ID: ${question_id},\nTotal Attempts: ${attempts},\nCourse: ${course},\nTopic: ${topic}\n`)
                                fetch('/attempts', {
                                    method: 'POST',
                                    body: JSON.stringify({
                                        question: question_id,
                                        attempts: attempts,
                                        correct: correct,
                                        course: course,
                                        topic: topic
                                    }),
                                    headers: { 'X-CSRFToken': csrftoken },
                                    mode: 'same-origin'
                                })
                            }
                        })
                        attempt_button.innerHTML = "Attempt"
                        attempt_button.classList.add("btn-secondary")
                        attempt_button.classList.remove("btn-success")
                    }

                })
            } else {
                messenger = document.querySelector('#messenger')
                messenger.innerText = "Add the course First Before you can attempt"
                messenger.style.color = "red"
                messenger.style.fontWeight = "bold"
                attempt_button.style.display = 'none'
            }
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