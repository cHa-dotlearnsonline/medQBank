allowAttempt()

function allowAttempt() {
    var attempt_button = document.querySelector('#attemptButton')
    var attempt_button_id = attempt_button.dataset.id
    var courseID = parseInt(attempt_button_id)
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
                                
                                var questionID = parseInt(answer.dataset.questionid)
                                var questionNumber = document.querySelector(`#question${questionID}`)
                                console.log(answer.dataset.clicked)
                                if (parseInt(answer.dataset.clicked) === 0) {
                                    questionNumber.dataset.attempts = parseInt(questionNumber.dataset.attempts) + 1  
                                }
                                answer.dataset.clicked = 1
                                
                                var trueness = answer.dataset.correctness
                                var button2 = document.querySelector('#attemptButton')
                                console.log(questionNumber.dataset.attempts)
                                if (button2.innerHTML === "Stop Attempt" && trueness === "True") {
                                    answer.style.color ="green"
                                } else if (button2.innerHTML === "Stop Attempt" && trueness ==="False") {
                                    answer.style.color = "red"
                                }
                            })

                        }

                    })

                } else if (attempt_button.innerHTML === "Stop Attempt") {
                    attempt_button.innerHTML = "Attempt"
                }
            })
        } else {
           messenger = document.querySelector('#messenger')
           messenger.innerText = "Add the course First Before you can attempt"
           messenger.style.color ="red"
           messenger.style.fontWeight = "bold"
            attempt_button.style.display = 'none'
        }
    })
}