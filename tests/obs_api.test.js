const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')
const app = require('../app')
const api = supertest(app)

const Observation = require('../models/observation')
const User = require('../models/user')

beforeEach(async () => {
    await Observation.deleteMany({})
    await Observation.insertMany(helper.initialObs)
})

test('obs are returned as json', async () => {
    await api
    .get('/api/observations')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all obs are returned', async () => {
    const response = await api.get('/api/observations')

    expect(response.body).toHaveLength(helper.initialObs.length)
})

/*test('adding a new obs', async () => {
    const newObservation = {
        species: "Kiuru",
        amount: 2,
        place: "Hämeenlinna",
        date: "2024-07-15",
        category: "Linnut",
        details: "Laulelevat lentäessään",
        __v: 0
    }

    await api
        .post('/api/observations')
        .send(newObservation)
        .expect(201)

    const obsAtEnd = await helper.obsInDb()
    expect(obsAtEnd).toHaveLength(helper.initialObs.length + 1)

    const species = obsAtEnd.map(o => o.species)
    expect(species).toContainEqual('Kiuru')
})*/

test('delete one obs', async () => {
    const obsInDatabase = await helper.obsInDb()
    const obToDelete = obsInDatabase[0]

    await api
        .delete(`/api/observations/${obToDelete.id}`)
        .expect(204)

    const obsAtEnd = await helper.obsInDb()

    expect(obsAtEnd).toHaveLength(helper.initialObs.length - 1)

    const species = obsAtEnd.map(o => o.species)

    expect(species).not.toContainEqual(obToDelete.species)
})

describe('when there is initially one user at db', () => {
    beforeEach(async () => {
      await User.deleteMany({})
  
      const passwordHash = await bcrypt.hash('sekret', 10)
      const user = new User({ username: 'root', passwordHash })
  
      await user.save()
    })
  
    test('creation succeeds with a fresh username', async () => {
      const usersAtStart = await helper.usersInDb()
  
      const newUser = {
        username: 'testUser',
        password: 'salainen',
      }
  
      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)
  
      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
  
      const usernames = usersAtEnd.map(u => u.username)
      expect(usernames).toContain(newUser.username)
    })
  
    test('creation fails with proper statuscode and message if username already taken', async () => {
      const usersAtStart = await helper.usersInDb()
  
      const newUser = {
        username: 'root',
        password: 'salainen',
      }
  
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
  
      expect(result.body.error).toContain('expected `username` to be unique')
  
      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
  })

afterAll(async () => {
    await mongoose.connection.close()
    })



