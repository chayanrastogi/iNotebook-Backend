const connectToMongo = require('./db');
const express = require('express');
var cors = require('cors')
const job = require('./cron/cron');

connectToMongo();
job.start();
const app = express()
const port = process.env.PORT || 5000 
 
app.use(cors())
app.use( express.json());  

// Available routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

app.listen(port, () => {
  console.log(`iNoteBook backend listening on port ${port}`)
})