//tätä ei välttämättä tarvitse enää

const mongoose = require('mongoose')

if (process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const mongoUrl = `mongodb+srv://mp:${password}@obs-cluster.petb0n9.mongodb.net/obsApp?retryWrites=true&w=majority&appName=Obs-cluster`

mongoose.set('strictQuery', false)
mongoose.connect(mongoUrl)

const observationSchema = new mongoose.Schema({
    species: String,
    amount: Number,
    place: String,
    date: String,
})

const Observation = mongoose.model('Observation', observationSchema)

const laji = process.argv[3]
const maara = process.argv[4]
const paikka = process.argv[5]
const aika = process.argv[6]

if (process.argv.length>3) {
    const observation = new Observation({
        species: laji,
        amount: maara,
        place: paikka,
        date: aika,
    })
    observation.save().then(result => {
        console.log(`added ${laji} - ${aika}`)
        mongoose.connection.close()
    })
}