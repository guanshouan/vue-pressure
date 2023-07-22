const express = require('express')
const cors = require('cors')

const app = express()

// Enable All CORS Requests
// Usage: https://www.npmjs.com/package/cors
app.use(cors())

app.use(express.static('./dist'))

app.get('/', function (req, res) {
   res.sendFile(__dirname + '/index.html')
})

app.get('/getData', (req, res) => {
   res.send({
      name: 'guan',
      age: 18
   })
})

app.listen('3001', (err) => {
   if (!err) {
      console.log('server running at 3001...')
   }
})
