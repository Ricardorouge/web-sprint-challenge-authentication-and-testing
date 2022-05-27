const server = require('./server')
const request = require('supertest')
const db = require('../data/dbConfig')
const Users = require('../api/users/usersModel')

// Write your tests here
test('sanity', () => {
  expect(true).toBe(false)
})

beforeAll(async()=>{
  await db.migrate.rollback()
  await db.migrate.latest()
})
beforeEach(async()=>{
  await db('users').truncate()
  await Users.add({username:'drEVIL',password:'minime'})
})
afterAll(async()=>{
  await db.destroy()
})

describe('POST /register endpoint',()=>{
  test('if user exists responds with correct error status and message',async ()=>{
    let response
    response = await request(server).post('/api/auth/register').send({username:'drEVIL',password:'1234'})
    expect(response.status).toBe(401)
    expect(response.body.message).toBe('username taken')
  })
  test('creates a new user if username is unique and password is provided',async()=>{
    let response
    response = await request(server).post('/api/auth/register').send({username:'Austin Powers',password:'groovy baby'})
    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('username','Austin Powers')
    const [user] = await Users.getBy({username:'Austin Powers'})
    expect(user).toMatchObject({username:'Austin Powers'})
  })
  test('if username or password is not provided throws correct error',async()=>{
    let response
    response = await request(server).post('/api/auth/register').send({username:'Seth Green'})
    expect(response.status).toBe(400)
    expect(response.body.message).toBe('username and password required') 
    response = await request(server).post('/api/auth/register').send({password:'Seth Green'})
    expect(response.status).toBe(400)
    expect(response.body.message).toBe('username and password required') 
  })
})
describe('POST /login endpoint',()=>{
  test('if password is incorrect returns correct error message',async ()=>{
    let response
    response = await request(server).post('/api/auth/login').send({username:'drEvil',password:'incorrect'})
    expect(response.status).toBe(401)
    expect(response.body.message).toBe('Invalid credentials') 
  })
  test('if username doesnt exists returns correct error message',async ()=>{
    let response
    response = await request(server).post('/api/auth/login').send({username:'Seth Green',password:'norealpeople'})
    expect(response.status).toBe(401)
    expect(response.body.message).toBe('Invalid credentials') 
  })
  test('if username or password is not provided throws correct error',async()=>{
    let response
    response = await request(server).post('/api/auth/login').send({username:'Seth Green'})
    expect(response.status).toBe(400)
    expect(response.body.message).toBe('username and password required') 
    response = await request(server).post('/api/auth/login').send({password:'Seth Green'})
    expect(response.status).toBe(400)
    expect(response.body.message).toBe('username and password required') 
  })
})
describe('GET /jokes endpoint',()=>{
  test('if token is not provided throws correct error',async ()=>{
    let response
    response = await request(server).get('/api/jokes')
    expect(response.status).toBe(401)
    expect(response.body.message).toBe('token required')
  })
  test('if token is invalid throws correct error',async ()=>{
    let response
    response = await request(server).get('/api/jokes').set('Authorization','123aseasyasdoereme')
    expect(response.status).toBe(401)
    expect(response.body.message).toBe('token invalid')
  })
})