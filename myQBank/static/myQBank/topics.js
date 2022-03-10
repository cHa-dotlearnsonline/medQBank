answer_set = document.querySelectorAll(".answer")
answer_set.forEach(answer => {
    
    answer.addEventListener('click', () => {
        trueness = answer.dataset.correctness
        if ( trueness === "True") {
            answer.style.color ="green"
        }else {
            answer.style.color ="red"
        }
    })
})