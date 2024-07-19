const Observation = require('../models/observation')
const User = require('../models/user')

const initialObs = [
    {
        _id: "5a422b3a1b54a676234d17f9",
        species: "Auroraperhonen",
        amount: 4,
        place: "Ruissalon kasvitieteellinen puutarha, Turku",
        date: "2024-06-01",
        category: "Perhoset",
        details: "Yhden siipi revennyt.",
        _v: 0
    },
    {
        _id: "5a422b891b54a676234d17fa",
        species: "Kärpässieni",
        amount: 1,
        place: "Aurajoki, Turku",
        date: "2024-07-02",
        category: "Sienet",
        _v: 0
    },
    {
        _id: "5a422ba71b54a676234d17fb",
        species: "Tarha-alpi",
        amount: 50,
        place: "Hannunniittu, Turku",
        date: "2024-07-06",
        category: "Kasvit",
        _v: 0
    },
    {
        _id: "5a422bc61b54a676234d17fc",
        species: "Unikko",
        amount: 10,
        place: "Turun linna, Turku",
        date: "2024-07-12",
        category: "Kasvit",
        _v: 0
    }
]

const obsInDb = async () => {
    const observations = await Observation.find({})
    return observations.map(o => o.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

module.exports = {
    initialObs, obsInDb, usersInDb
}

