allowAttempt()

function allowAttempt() {
    var attempt_button = document.querySelector('#attemptButton')
    var attempt_button_id = attempt_button.dataset.id
    var courseID = parseInt(attempt_button_id)
    var attemptedQuestionsList = []
    var allready_attempted = {}
    fetch(`http://127.0.0.1:8000/addCourse/${courseID}`)
        .then(response => response.json())
        .then(taken => {
            check_course = taken['taking']
            if (check_course === true) {
                show_button = attempt_button.style.display = 'block'
                attempt_button.addEventListener('click', () => {
                    if (attempt_button.innerHTML === "Attempt") {
                        attempt_button.innerHTML = "Stop Attempt"
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
                        var tracker = 0
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

                            //console.log(`Correct Clicks: ${correct},\nQuestion ID: ${question_id},\nTotal Attempts: ${attempts},\nCourse: ${course},\nTopic: ${topic}\n`)
                            if (allready_attempted[`${question}`] === undefined || allready_attempted[`${question}`] !== attempts) {
                                allready_attempted[`${question}`] = attempts
                                console.log(`Correct Clicks: ${correct},\nQuestion ID: ${question_id},\nTotal Attempts: ${attempts},\nCourse: ${course},\nTopic: ${topic}\n`)
                            }
                            attempt_button.innerHTML = "Attempt"
                        })
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