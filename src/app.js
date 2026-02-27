const express = require('express');
const methodOverride = require('method-override');
const path = require('path');
const bodyParser = require('body-parser');

const indexRouter = require('./routes/index');
const productRouter = require('./routes/product');
const departmentRouter = require('./routes/department');
const sellerRouteer = require('./routes/seller');
const storeRouter = require('./routes/store');

const app = express();

const port = 3000;
const dirname = __dirname

app.set('view engine', 'ejs');
app.set('views', path.join(dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));

app.use(express.static(path.join(dirname, 'static')));

// API 
app.use('/', indexRouter)
app.use('/products', productRouter);
app.use('/departments', departmentRouter)
app.use('/sellers', sellerRouteer);
app.use('/store', storeRouter);

// API routes
// app.use('/api/products', require('./api/product'));
// app.use('/api/departments', require('./api/department'));
// app.use('/api/sellers', require('./api/seller'));
// app.use('/api/store', require('./api/store'));

// app.use('/', (req, res) => {
//     res.sendFile(path.join(dirname, 'index.html'));
// });
// app.use('/api', apiRouter);

app.listen(port, () => {
    console.log(`Приложение запущено на http://localhost:${port}\n`);
});