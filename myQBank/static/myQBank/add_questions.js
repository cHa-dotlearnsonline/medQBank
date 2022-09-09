add_question()
add_option()
hideForms()
addSubquestion()
addEssayQuestion()
function add_question() {
    const csrftoken = getCookie('csrftoken')
    document.querySelector('#submitbutton').onclick = () => {
        var question = document.querySelector("#question1").value
        var course = document.querySelector("#courseName").value
        var topic = document.querySelector("#topicName").value
        var course_image = document.querySelector("#courseImage").value
        var all_answers = document.querySelectorAll(".answer")
        var total_number_answers = all_answers.length
        var option_tracker = 1
        var all_options = []

        if (question.length < 1 || course.length < 1 || topic.length < 1 || course_image.length < 1) {
            alert("Make sure to fill in all the fields in the form")
        }
        all_answers.forEach(answer => {
            // increament the option_tracker by one at the end of each loop
            var get_answer = answer.value
            var is_correct = document.querySelector(`#correct${option_tracker}`).checked
            document.querySelector(`#option${option_tracker}`).value = ''
            document.querySelector(`#correct${option_tracker}`).checked = false
            option_tracker++
            var answer_object = {}
            answer_object[`${get_answer}`] = is_correct
            all_options.push(answer_object)
            console.log(get_answer)

        })
        fetch('/addQuestions', {
            method: 'PUT',
            body: JSON.stringify({
                question: question,
                course: course,
                topic: topic,
                courseImage: course_image,
                theOptions: all_options
            }),
            headers: { 'X-CSRFToken': csrftoken },
            mode: 'same-origin'
        })
        document.querySelector("#question1").value = ''
        document.querySelector("#courseName").value = ''
        document.querySelector("#topicName").value = ''
        course_image = document.querySelector("#courseImage").value = ''
        document.querySelector('#extra-option').innerHTML = ''
        console.log(all_options)
        console.log("all has gone well")
    }
}
function add_option() {
    document.querySelector('#addOption').addEventListener('click', () => {
        var extraOptionDiv = document.querySelector('#extra-option')
        var all_answers = document.querySelectorAll(".answer").length
        var what_to_add = `<div class="form-group">
                            <input id="option${all_answers + 1}" type="text" name="option${all_answers + 1}" class="form-control answer" placeholder="Option Number ${all_answers + 1}">
                            <input id="correct${all_answers + 1}" class="form-check-input" type="checkbox" name="correct${all_answers + 1}" value="True">
                            <label  for="correct${all_answers + 1}">Marks as Correct</label>
                            </div>`
        extraOptionDiv.insertAdjacentHTML("beforeend", what_to_add)
    })
}

function hideForms() {
    let mcqForm = document.querySelector('#question-form')
    mcqForm.style.display = 'none'
    let essayForm = document.querySelector('.essayQuestion')
    essayForm.style.display = 'none'
    // add event listeners to the two buttons so that clicking them will diplay one form and hide the other
    let essayButton = document.querySelector('#essayButton')
    let mcqButton = document.querySelector('#mcqButton')
    essayButton.addEventListener('click', () => {
        essayForm.style.display = 'block'
        mcqForm.style.display = 'none'
    })
    mcqButton.addEventListener('click', () => {
        essayForm.style.display = 'none'
        mcqForm.style.display = 'block'
    })
}
function addSubquestion() {
    document.querySelector('#addSubQ').addEventListener('click', () => {
        let subQuestionDiv = document.querySelector('#subquestion')
        let all_subqs = parseInt(subQuestionDiv.dataset["totalsubqs"])
        let new_sub_q = `<div class="form-group">
        <div><textarea id="subQuestion${all_subqs + 1}" type="text", class="form-control subq" placeholder="Type subquestion here"></textarea></div>
        </div>
        <div class="form-group">
        <div><textarea id="subQuestionAns${all_subqs + 1}" type="text", class="form-control subqans" placeholder="Type subquestion Answer here"></textarea></div>
        </div>
        `
        subQuestionDiv.insertAdjacentHTML("beforeend", new_sub_q)
        subQuestionDiv.dataset["totalsubqs"] = all_subqs + 1
    })
}
// function addEssayQuestion() {
//     const csrftoken = getCookie('csrftoken')
//     // TODO: find the main Question
//     document.querySelector('#submitbutton2').addEventListener('click', () => {
//         let mainQuestion = document.querySelector('#mainQuestion').value
//         let courseImage2 = document.querySelector('#courseImage2').value
//         let mainQuestionImage = document.querySelector('#mainQuestionImage').value
//         let mainQuestionAnswer = document.querySelector('#mainQuestionAnswer').value
//         let essayCourseName = document.querySelector('#essayCourseName').value
//         let essayTopicName = document.querySelector('#essayTopicName').value
//         let totalSubQs = parseInt(document.querySelector('#subquestion').dataset['totalsubqs']) + 1
//         let subQAnswerArray = []
//         if (totalSubQs > 0) {
//             for (let i=1; i < totalSubQs; i++) {
//                 let ans_obj = {}
//                 console.log(i)
//                 let subQuestion = document.querySelector(`#subQuestion${i}`).value 
//                 let subQuestionAns = document.querySelector(`#subQuestionAns${i}`).value
//                 ans_obj[subQuestion] = subQuestionAns
//                 subQAnswerArray.push(ans_obj)
//             }
//         }

//         fetch('/addQuestions', {
//             method: 'PUT', 
//             body: JSON.stringify({
//                 question: mainQuestion,
//                 image: mainQuestionImage,
//                 mainAnswer: mainQuestionAnswer,
//                 course: essayCourseName,
//                 topic: essayTopicName,
//                 subquestions: subQAnswerArray,
//                 courseImage: courseImage2
//             }),
//             headers:{'X-CSRFToken': csrftoken},
//             mode: 'same-origin'
//         })
//         console.log(`${mainQuestion},${mainQuestionImage},${essayCourseName},${essayTopicName}`)
//         document.querySelector('#mainQuestion').value = ''
//         document.querySelector('#courseImage2').value =''
//         document.querySelector('#mainQuestionImage').value =''
//         document.querySelector('#mainQuestionAnswer').value =''
//         document.querySelector('#essayCourseName').value =''
//         document.querySelector('#essayTopicName').value =''
//         document.querySelector('#subquestion').dataset['totalsubqs'] = 0
//         document.querySelector("#subquestion").innerHTML=''

       
//     })
//     //TODO: find the subquestions and the answers(use objects here)
// }
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