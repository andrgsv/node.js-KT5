const express = require('express')
const mongoose = require('mongoose')
const app = express()

app.use(express.json())

mongoose.connect('mongodb+srv://user:user123@cluster0.xxxxx.mongodb.net/notesdb')
  .then(() => console.log('база подключилась'))
  .catch(() => console.log('не подключилась база, ну ладно'))

const noteSchema = new mongoose.Schema({
  title: String,
  content: String,
  created: { type: Date, default: Date.now },
  changed: { type: Date, default: Date.now }
})

const Note = mongoose.model('Note', noteSchema)

app.get('/notes', async (req, res) => {
  const notes = await Note.find()
  if (notes.length === 0) {
    res.status(404).send([])
  } else {
    res.status(200).json(notes)
  }
})

app.get('/note/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)
    if (note) {
      res.json(note)
    } else {
      res.status(404).send('нет такой')
    }
  } catch {
    res.status(404).send('неправильный айди')
  }
})

app.get('/note/read/:title', async (req, res) => {
  const note = await Note.findOne({ title: req.params.title })
  if (note) {
    res.json(note)
  } else {
    res.status(404).send('не найдено по названию')
  }
})

app.post('/note/', async (req, res) => {
  const { title, content } = req.body
  if (!title) {
    return res.status(409).send('напиши title')
  }

  const newNote = new Note({ title, content })
  try {
    await newNote.save()
    res.status(201).json(newNote)
  } catch {
    res.status(409).send('уже есть такая заметка')
  }
})

app.delete('/note/:id', async (req, res) => {
  try {
    const result = await Note.findByIdAndDelete(req.params.id)
    if (result) {
      res.status(204).send()
    } else {
      res.status(409).send('не найдено')
    }
  } catch {
    res.status(409).send('ошибка')
  }
})

app.put('/note/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)
    if (!note) {
      return res.status(409).send('нет такой')
    }
    if (req.body.title) note.title = req.body.title
    if (req.body.content) note.content = req.body.content
    note.changed = new Date()
    await note.save()
    res.status(204).send()
  } catch {
    res.status(409).send('ошибка обновления')
  }
})

app.listen(3000, () => {
  console.log('сервер работает на 3000 порту')
  console.log('я сам сделал, честно')
})