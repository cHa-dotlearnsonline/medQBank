add_question()
add_option()

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
            method: 'POST',
            body: JSON.stringify({
                question: question,
                course: course,
                topic: topic,
                courseImage: course_image,
                theOptions: all_options
            }),
            headers:{'X-CSRFToken': csrftoken},
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
        var what_to_add= `<div class="form-group">
                            <input id="option${all_answers+1}" type="text" name="option${all_answers+1}" class="form-control answer" placeholder="Option Number ${all_answers+1}">
                            <input id="correct${all_answers+1}" class="form-check-input" type="checkbox" name="correct${all_answers+1}" value="True">
                            <label  for="correct${all_answers+1}">Marks as Correct</label>
                            </div>`
        extraOptionDiv.insertAdjacentHTML("beforeend", what_to_add)
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