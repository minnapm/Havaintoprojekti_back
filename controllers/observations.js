const jwt = require('jsonwebtoken')
const obsRouter = require('express').Router()
const Observation = require('../models/observation')
const User = require('../models/user')

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
      return authorization.replace('Bearer ', '')
    }
    return null
  }

obsRouter.get('/', async (request, response) => {
    const observations = await Observation
      .find({})
      .populate('user', { username: 1 })
    response.json(observations)
})

obsRouter.get('/:id', async (request, response) => {
    const observation = await Observation.findById(request.params.id)
    if (observation) {
        response.json(observation)
    } else {
        response.status(404).end()
    }
})

obsRouter.post('/', async (request, response) => {
    const body = request.body
  
    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
    const user = await User.findById(decodedToken.id)
  
    const observation = new Observation({
      species: body.species,
      amount: body.amount,
      place: body.place,
      date: body.date,
      category: body.category,
      user: user._id
    })
  
    const savedObs = await observation.save()
    user.observations = user.observations.concat(savedObs._id)
    await user.save()
  
    response.status(201).json(savedObs)
})

obsRouter.delete('/:id', async (request, response) => { 
  await Observation.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

obsRouter.put('/:id', async (request, response) => {
    const body = request.body
  
    const observation = {
      species: body.species,
      amount: body.amount,
      place: body.place,
      date: body.date,
    }
  
    const updatedObs = await Observation.findByIdAndUpdate(request.params.id, observation, { new: true })
    response.json(updatedObs)
})
  

module.exports = obsRouter

