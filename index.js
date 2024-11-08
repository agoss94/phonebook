const express = require('express')
const morgan = require('morgan')
const app = express()
app.use(express.json())

morgan.token('content', (req, res) => {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url - :response-time :content'))

const generateId = () => {
    const maxId = numbers.length > 0
    ? Math.max(...numbers.map(n => Number(n.id)))
    : 0
    return String(maxId + 1)
}

let numbers = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/info', (request, response) => {
  response.send(
    `The phonebook has info for ${numbers.length} people 
    <br/>
    <br/>
     ${new Date()}.
     `)
})

app.get('/api/persons', (request, response) => {
  response.json(numbers)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const number = numbers.find(n => n.id === id)
  if (number) {
    response.json(number)
  } else {
    response.status(404).end()
  }
})


app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  numbers = numbers.filter(number => number.id !== id)
  response.status(204).end()
})

app.post('/api/persons/', (request, response) => {
  const body = request.body

  const number = {
    "id": generateId(),
    "name": body.name,
    "number": body.number
  }

  numbers = numbers.concat(number)
  response.json(number)
})

const PORT = 3001 
app.listen(PORT, () => {
  console.log(`Server is runing on port ${PORT}`)
})
