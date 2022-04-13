checkStats()

function checkStats() {
    const csrftoken = getCookie('csrftoken')
    statsButton = document.querySelectorAll(".subjectStats")
    statsButton.forEach(button => {
        button.addEventListener('click', () => {
            course_id = parseInt(button.dataset["course"])
            fetch('http://127.0.0.1:8000/attempts', {
                method: 'PUT',
                body: JSON.stringify({
                    course: course_id
                }),
                headers:{'X-CSRFToken': csrftoken},
                mode: 'same-origin'
            })
            .then(response => response.json())
            .then(stats => {
                if (stats["Total Attempts"] !== undefined) {
                    var total_attempts = `Total Attempts: ${stats["Total Attempts"]}<br>`
                    var total_correct  = `Total Correct: ${stats["Total Correct"]}<br>`
                    var pass_percentage  = `Pass Percentage: ${stats["Pass Percentage"]}%`
                    var courseID = parseInt(stats["Course ID"])
                    console.log(`${total_attempts}\n${total_correct}\n${pass_percentage}%`)
                    let viewStats = document.querySelector(`#display-stats${courseID}`)
                    viewStats.innerHTML = total_attempts + total_correct + pass_percentage

                }

                else if (stats["error"] !== undefined) {
                    var courseID = parseInt(stats["Course ID"])
                    let viewStats = document.querySelector(`#display-stats${courseID}`)
                    viewStats.innerHTML = stats["error"]
                }
            })
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