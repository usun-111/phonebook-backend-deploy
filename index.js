const express = require('express')
const morgan = require('morgan')

const app = express()
app.use(express.json())
app.use(express.static('dist'))


morgan.token('body', (req) => {
  if (req.method !== 'POST') return ''
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use(morgan('tiny'))

// const requestLogger = (req, res, next) => {
//     console.log(req.method)
//     console.log(req.path)
//     console.log(req.body)
//     console.log("-----")
//     next()
// }
// app.use(requestLogger)

let persons = [
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

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (!body.name) {
        return res.status(404).json({ error: 'missing name'})
    }

    if (!body.number) {
        return res.status(404).json({ error: 'missing number'})
    }

    const nameExisting = persons.some(p => p.name === body.name)
    if (nameExisting) {
        return res.status(404).json({ error: 'name must be unique'})
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number,
    }

    persons = persons.concat(person)
    res.json(person)
})

const generateId = () => {
    return Math.floor(Math.random() * 1000000000)
}

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id
    persons = persons.filter(p => p.id !== id)
    res.status(204).end()
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    const person = persons.find(p => p.id === id)

    if (!person) {
        return res.status(404).end()
    }
    res.json(person)
})

app.get('/info', (request, response) => {
    const count = persons.length
    const time = new Date()

    response.send(`
        <div>
            <p>Phonebook has info for ${count} people</p>
            <p>${time}</p>
        </div>
    `)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknow endpoint'})
}
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

