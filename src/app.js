const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// app.use(express.json());

app.use(express.static('public'));

// const indexRouter = require('./routes/index');
// const apiRouter = require('./routes/api');

app.use('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
// app.use('/api', apiRouter);

app.listen(port, () => {
    console.log(`Приложение запущено на http://localhost:${port}`);
});