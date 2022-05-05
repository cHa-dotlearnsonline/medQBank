checkStats()

function checkStats() {
    const csrftoken = getCookie('csrftoken')
    statsButton = document.querySelectorAll(".subjectStats")
    statsButton.forEach(button => {
        var course_id = parseInt(button.dataset["course"])
        let viewStats = document.querySelector(`#display-stats${course_id}`)
        viewStats.style.display = "none"
        button.addEventListener('click', () => {
            var course_id = parseInt(button.dataset["course"])
            
            let viewStats = document.querySelector(`#display-stats${course_id}`)
            var show_stats = parseInt(viewStats.dataset["show"])
            if ( show_stats > 0) {
                viewStats.style.display = "none"
                viewStats.dataset["show"] = 0
            } else {
                
           
            fetch('/attempts', {
                method: 'PUT',
                body: JSON.stringify({
                    course: course_id
                }),
                headers:{'X-CSRFToken': csrftoken},
                mode: 'same-origin'
            })
            .then(response => response.json())
            .then(stats => {
                var courseID = parseInt(stats["Course ID"])
                let viewStats = document.querySelector(`#display-stats${courseID}`)
                if (stats["Total Attempts"] !== undefined) {
                    var total_attempts = `Total Attempts: ${stats["Total Attempts"]}<br>`
                    var total_correct  = `Total Correct: ${stats["Total Correct"]}<br>`
                    var pass_percentage  = `Pass Percentage: ${stats["Pass Percentage"]}%`
                    var courseID = parseInt(stats["Course ID"])
                    console.log(`${total_attempts}\n${total_correct}\n${pass_percentage}%`) 
                    viewStats.insertAdjacentHTML("afterbegin",`${total_attempts + total_correct + pass_percentage}`) 
                    viewStats.style.display = "block"
                    viewStats.dataset["show"] = 1
                }

                else if (stats["error"] !== undefined) {
                    var courseID = parseInt(stats["Course ID"])
                    viewStats.innerHTML = stats["error"]
                    viewStats.style.display = "block"
                    viewStats.dataset["show"] = 1
                }
            })
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