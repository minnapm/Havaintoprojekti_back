const mongoose = require('mongoose')

const observationSchema = new mongoose.Schema({
    species: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: [1, 'Määrä ei voi olla 0.']
    },
    place: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    },
    category: {
      type: String, 
      enum: ['Kasvit', 'Sienet', 'Linnut', 'Perhoset'],
      required: true
    },
    image: {
      type: String,
      //contentType: String
    },
    details: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
})

observationSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Observation', observationSchema)