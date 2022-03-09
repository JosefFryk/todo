
const express = require('express') 
const app = express() // so we can use app.
const MongoClient = require('mongodb').MongoClient 
const PORT = 1337 
require('dotenv').config() // install dotenv, hide some info

// hide information env
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'
// connect with db
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

app.set ('view engine', 'ejs') //use ejs
app.use (express.static('public')) //public folder serv
// checking data when sending through form
app.use (express.urlencoded({extended: true})) 
app.use(express.json())

// get stuff from collection, put it into array
app.get('/', async (request, response) => {
    const todoItems = await db.collection('todos').find().toArray()
    const itemsLeft = await db.collection('todos').countDocuments({complete:false})
    response.render('index.ejs', {items: todoItems, left: itemsLeft})
})
//add stuff into db, reload /, error catch
app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

// update stuff in db by mark, sort it, upsert if doesnt exist add new one, respond with mark, eror
app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS}, {
        $set: {
            completed: true
        }
    }, {
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))
})
// same as before but uncomplete
app.put('/markUncomplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false
        }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))
})
// delete one from db
app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))
})
// first is port for heroku || my port
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})