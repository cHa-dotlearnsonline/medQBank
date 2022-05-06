allowAttempt()

function allowAttempt() {
    const csrftoken = getCookie('csrftoken')
    var attempt_button = document.querySelector('#attemptButton')
    var attempt_button_id = attempt_button.dataset.id
    var courseID = parseInt(attempt_button_id)
    correctSet = document.querySelectorAll('.correct-answer')
    correctSet.forEach(indicator => {
        indicator.style.display = 'none'
    })
    wrongSet = document.querySelectorAll('.wrong-answer')
    wrongSet.forEach(wrong => {
        wrong.style.display = 'none'
    })
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
                            var questionID = parseInt(answer.dataset.questionid)
                            var questionNumber = document.querySelector(`#question${questionID}`)
                            var clickedness = questionNumber.dataset.clicked
                            var isStillAttempting = document.querySelector("#attemptButton").innerHTML
                            clickedness = parseInt(clickedness)
                            if (clickedness === 0 && isStillAttempting === "Stop Attempt") {
                                console.log(questionNumber.dataset.clicked)
                                answer.addEventListener('click', () => {
                                    
                                    if (isStillAttempting === "Stop Attempt" && parseInt(questionNumber.dataset.clicked) === 0) {
                                        if (parseInt(answer.dataset.clicked) === 0) {
                                            questionNumber.dataset.attempts = parseInt(questionNumber.dataset.attempts) + 1
                                        }
                                        answer.dataset.clicked = 1
                                        var trueness = answer.dataset.correctness
                                        var button2 = document.querySelector('#attemptButton')
                                        var correctIndicator = document.querySelector(`#correct-answer${questionID}`)
                                        var wrongIndicator = document.querySelector(`#wrong-answer${questionID}`)
                                        if (button2.innerHTML === "Stop Attempt" && trueness === "True") {
                                            answer.style.color = "green"
                                            answer.dataset.correctClick = "yes"
                                            questionNumber.dataset.correct = 1
                                            correctIndicator.insertAdjacentHTML("beforeend", "CORRECT")
                                            correctIndicator.style.display = 'block'
                                        } else if (button2.innerHTML === "Stop Attempt" && trueness === "False") {
                                            answer.style.color = "red"
                                            questionNumber.dataset.correct = 0
                                            wrongIndicator.insertAdjacentHTML("beforeend", "WRONG")
                                            wrongIndicator.style.display = 'block'
                                            all_question_answers = document.querySelectorAll(`.answer${questionID}`)
                                            all_question_answers.forEach(option => {
                                                truthfulness = option.dataset.correctness 
                                                if (truthfulness === "True") {
                                                    option.style.color = 'green'
                                                    option.insertAdjacentHTML("beforeend", `<i class="fi fi-bs-check"></i>`)
                                                }
                                            })
                                        }
                                        fetch('/attempts',{
                                            method: 'POST',
                                            body: JSON.stringify({
                                                question:questionID,
                                                attempts:questionNumber.dataset.attempts,
                                                correct:questionNumber.dataset.correct,
                                                course:questionNumber.dataset.course,
                                                topic:questionNumber.dataset.topic,
                                                }),
                                                headers: { 'X-CSRFToken': csrftoken},
                                                mode: 'same-origin'
                                            })
                                    }
                                    questionNumber.dataset.clicked = 1
                                })

                            }

                        })

                    } else if (attempt_button.innerHTML === "Stop Attempt") {                                                                                                                              
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