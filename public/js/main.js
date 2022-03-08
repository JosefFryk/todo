const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')

Array.from(deleteBtn).forEach((element) => {
    element.addEventListener('click', deleteItem)
})

Array.from(item).forEach((element)=> {
    element.addEventListener('click', markComlete)
})

Array.from(itemComleted).forEach((element) => {
    element.addEventListener('click', markUnComplete)
})

async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText
    try {
        const response = await fetch ('deleteItem', {                       //passing some info 
            method: 'delete',
            headers: { 'Content-Type': 'application/json' },
            get headers() {
                return this._headers
            },
            set headers(value) {
                this._headers = value
            },
            body: JSON.stringify({
                'itemFromJS': itemText
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    
    }catch(err){
        console.log(err)
    }
}

async function markComlete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    
    }catch(err){
        console.log(err)
}}

async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
}}