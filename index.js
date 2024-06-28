const express = require('express')
const app = express()

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

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})