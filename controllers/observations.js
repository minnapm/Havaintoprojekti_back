const jwt = require('jsonwebtoken')
const obsRouter = require('express').Router()
const Observation = require('../models/observation')
const User = require('../models/user')

const multer = require('multer')

/*const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
  } else {
      cb("JPEG and PNG only supported", false);
  }
};*/

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
      cb(
          null,
          new Date().toISOString().replace(/:/g, "-") + file.originalname
      );
  },
});

const upload = multer({
  storage: storage,
  limits: {
      fieldSize: 25 * 1024 * 1024,
  },
 /* fileFilter: fileFilter,*/
});

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

obsRouter.get('/kasvit', async (request, response) => {
  const observations = await Observation
    .find({ category: 'Kasvit' })//.exec()
    .populate('user', { username: 1 })
  response.json(observations)
})

obsRouter.get('/sienet', async (request, response) => {
  const observations = await Observation
    .find({ category: 'Sienet' })//.exec()
    .populate('user', { username: 1 })
  response.json(observations)
})

obsRouter.get('/linnut', async (request, response) => {
  const observations = await Observation
    .find({ category: 'Linnut' })//.exec()
    .populate('user', { username: 1 })
  response.json(observations)
})

obsRouter.get('/perhoset', async (request, response) => {
  const observations = await Observation
    .find({ category: 'Perhoset' })//.exec()
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


obsRouter.post('/', upload.single('image'), async (request, response) => {
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
      image: body.image,
      details: body.details,
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

