const request = require('supertest')
const mongoose = require('mongoose')
require('./server') 

let id = ''

describe('мой кривой но рабочий api', () => {
  it('должен создать заметку', async () => {
    const res = await request('http://localhost:3000')
      .post('/note/')
      .send({ title: 'первая заметка', content: 'привет' })
    if (res.status === 201) {
      id = res.body._id
      console.log('создал заметку')
    }
  })

  it('должен получить все заметки', async () => {
    const res = await request('http://localhost:3000').get('/notes')
    console.log('всего заметок:', res.body.length)
  })

  it('должен удалить', async () => {
    if (id) {
      await request('http://localhost:3000').delete(`/note/${id}`)
      console.log('удалил')
    }
  })
})