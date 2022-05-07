Edit()

function Edit() {
    edit_views = document.querySelectorAll('.change_answer')
    edit_views.forEach(view => {
        view.style.display = 'none'
    })
}