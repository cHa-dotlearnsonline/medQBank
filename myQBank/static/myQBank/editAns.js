Edit()

function Edit() {
    const csrftoken = getCookie('csrftoken')
    var edit_views = document.querySelectorAll('.change_answer')
    edit_views.forEach(view => {
        view.style.display = 'none'
    })
    var edit_buttons = document.querySelectorAll('.edit')
    edit_buttons.forEach(button => {
        let questionID = parseInt(button.dataset['questionid'])
        button.addEventListener('click', () => {
            let editButtonDisplay = document.querySelector(`#edit${questionID}`)
            editButtonDisplay.style.display = 'none'
            let edit_boy = document.querySelector(`#change_answer${questionID}`)
            edit_boy.style.display = 'block'
            let card_boy = document.querySelector(`#card${questionID}`)
            card_boy.style.display = 'none'
            let save_boy = document.querySelector(`#savebutton${questionID}`)
            let all_options = document.querySelectorAll(`.option${questionID}`)
            
 
            save_boy.addEventListener('click', () => {
                let optionID = ''
                all_options.forEach(option => {
                    console.log(option.checked)
                    console.log(option.value)
                    if (option.checked === true) {
                        optionID = option.value
                    }
                })
                edit_boy.style.display = 'none'
                card_boy.style.display = 'block'
                editButtonDisplay.style.display = 'block'
                if (optionID.length > 0) {
                    console.log(optionID)
                    fetch('/edit', {
                        method: 'POST',
                        body: JSON.stringify({
                            question: questionID,
                            option: optionID
                        }),
                        headers: { 'X-CSRFToken': csrftoken },
                        mode: 'same-origin'
                    })
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