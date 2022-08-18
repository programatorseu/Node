import express from 'express'
import morgan from 'morgan'
import bp from 'body-parser'

const app = express()

app.use(bp.urlencoded({ extended: true }))
app.use(bp.json())
app.use(morgan('dev'))

const db = []

app.post('/todo', (request, response) => {
    const newTodo = {
        id: Date.now(),
        text: request.body.text
    }
    db.push(newTodo)
    response.json(newTodo)
})

app.get('/todo', (request, response) => {
    response.json(db)
})


app.listen(8000, () => {
    console.log('Server on http://localhost:8000')
  })
