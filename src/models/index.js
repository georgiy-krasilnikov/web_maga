const { Sequelize, DataTypes } = require('sequelize');

// Инициализация подключения к SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './shop.db', // файл базы данных
    // logging: console.log, // логирование SQL запросов
    define: {
        timestamps: false,
    },
});

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Department = require('./department')(sequelize, DataTypes);
db.Seller = require('./seller')(sequelize, DataTypes);
db.Product = require('./product')(sequelize, DataTypes);
db.Store = require('./store')(sequelize, DataTypes);

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

module.exports = db;