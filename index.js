require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')

let observations = [
    {
      species: "Auroraperhonen",
      amount: "6",
      place: "Aurajoki, Turku",
      date: "5.6.2024"
    },
    {
        species: "Alppiruusu",
        amount: "6",
        place: "Ruissalo, Turku",
        date: "1.5.2024"
    },
    {
        species: "Krookus",
        amount: "2",
        place: "Nummi, Turku",
        date: "1.6.2024"
    }
  ]

app.get('/api/observations', (req, res) => {
    res.json(observations)
})

app.get('/api/persons/:id', (request, response) =>{
  const id = Number(request.params.id)
  const observation = observations.find(obs => obs.id === id)

  if (observation) {
    response.json(observation)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/observations/:id', (request, response) => {
  const id = Number(request.params.id)
  observations = observations.filter(obs => obs.id !== id)
  response.status(204).end()
})

app.post('/api/observations', (request, response) => {
  const body = request.body

  if (body.species === undefined || body.amount === undefined || body.place === undefined || body.date === undefined) {
    return response.status(400).json({
      error: 'Laji, lukumäärä, paikka tai aika puuttuu.'
    })
  }

  const observation = new Observation ({
    species: body.species,
    amount: body.amount,
    place: body.place,
    date: body.date,
  })

  observation.save().then(savedObs => {
    response.json(savedObs)
  })


})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})