const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

usersRouter.get('/', async (request, response) => {
    const users = await User
      .find({})
      .populate('observations', { species: 1, date: 1 })

    response.json(users)
})

usersRouter.delete('/:id', async (request, response) => { 
  await User.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

module.exports = usersRouter