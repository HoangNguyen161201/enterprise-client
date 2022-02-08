const express = require('express')

const PORT = 4000
const app = express()

app.get('/', (req, res)=> {
    res.send('nguyen quang hoang')
})

app.get('/hello', (req, res)=> {
    res.send('hello')
})

app.listen(PORT, ()=> {
    console.log(`http://localhost:${PORT}`)
})