const express = require("express");
const methodOverride = require("method-override");
const path = require("path");

const app = express();

const port = 3000;
const dirname = __dirname;

// подключение движка EJS для обработки шаблонов
app.set("view engine", "ejs");
app.set("views", path.join(dirname, "views"));

// базовые мидлвары
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

// статика
app.use(express.static(path.join(dirname, "static")));

// роутеры
const indexRouter = require("./routes/index");
const productRouter = require("./routes/product");
const departmentRouter = require("./routes/department");
const sellerRouteer = require("./routes/seller");
const storeRouter = require("./routes/store");

// API
app.use("/", indexRouter);
app.use("/products", productRouter);
app.use("/departments", departmentRouter);
app.use("/sellers", sellerRouteer);
app.use("/store", storeRouter);

app.listen(port, () => {
    console.log(`Приложение запущено на http://localhost:${port}\n`);
});
