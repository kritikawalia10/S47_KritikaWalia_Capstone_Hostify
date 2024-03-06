const express = require('express');
const app = express();
const data = require('./data.json');

app.use(express.json());

app.get('/', (req, res) => {
    res.send(data);
});


app.listen(8080, () => {
    console.log('🚀Server running on port 8080');
});