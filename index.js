require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const PhonebookEntry = require('./models/phonebook')
const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') { 
    return response.status(400).send({error: 'malformatted id'})
  }

  next(error)
}

app.use(errorHandler)

morgan.token('content', (req, res) => {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url - :response-time :content'))

app.get('/api/info', (request, response) => {
    PhonebookEntry.find({}).then(result => { 
      let numberOfEntries = result.length 
      response.send(
        `The phonebook has info for ${numberOfEntries} people 
        <br/>
        <br/>
        ${new Date()}.
        `)
    })
})

app.get('/api/persons', (request, response) => {
  PhonebookEntry.find({}).then(result => { 
    response.json(result)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  PhonebookEntry.findById(id).then(entry => { 
    if (entry) { 
      response.json(entry)
    } else { 
      response.status(404).end()
    }
  }).catch(error => next(error))
})


app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  PhonebookEntry.findByIdAndDelete(id).then(result => { 
    response.status(204).end()
  })
  .catch(error => next(error))
})

app.post('/api/persons/', (request, response) => {
  const body = request.body

  const number = new PhonebookEntry({
    name: body.name,
    number: body.number
  })

  number.save().then( result => { 
    console.log("Number saved", number)
  })
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const entry = { 
    name : body.name,
    number : body.number
  }

  PhonebookEntry.findByIdAndUpdate(request.params.id, entry, {new: true}).then(updatedEntry => { 
      response.json(updatedEntry)
  }).catch(error => next(error))
})

const PORT = 3001 
app.listen(PORT, () => {
  console.log(`Server is runing on port ${PORT}`)
})
