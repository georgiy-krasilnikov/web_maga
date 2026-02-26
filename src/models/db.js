const { Sequelize, DataTypes } = require('sequelize');

// Инициализация подключения к SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './shop.db', // файл базы данных
    logging: console.log, // логирование SQL запросов (можно отключить: false)
    define: {
        timestamps: false, // добавляет createdAt и updatedAt
    },
});

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Импорт моделей
db.Department = require('./models/department')(sequelize, DataTypes);
db.Seller = require('./models/seller')(sequelize, DataTypes);
db.Product = require('./models/product')(sequelize, DataTypes);
db.Store = require('./models/store')(sequelize, DataTypes);

// Настройка связей
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

module.exports = db;

// // // Импорт моделей
// const Department = require('./department')(sequelize);
// const Seller = require('./seller')(sequelize);
// const Product = require('./product')(sequelize);
// const Store = require('./store')(sequelize);

// // Настройка связей между моделями
// function setupAssociations() {
//     // Department -> Seller (один ко многим)
//     Department.hasMany(Seller, {
//         foreignKey: 'department_id',
//         as: 'sellers',
//         onDelete: 'SET NULL'
//     });
//     Seller.belongsTo(Department, {
//         foreignKey: 'department_id',
//         as: 'department',
//         onDelete: 'SET NULL'
//     });

//     // Department -> Product (один ко многим)
//     Department.hasMany(Product, {
//         foreignKey: 'department_id',
//         as: 'products',
//         onDelete: 'SET NULL'
//     });
//     Product.belongsTo(Department, {
//         foreignKey: 'department_id',
//         as: 'department',
//         onDelete: 'SET NULL'
//     });

//     // Product -> Store (один к одному)
//     Product.hasOne(Store, {
//         foreignKey: 'product_id',
//         as: 'stock',
//         onDelete: 'CASCADE'
//     });
//     Store.belongsTo(Product, {
//         foreignKey: 'product_id',
//         as: 'product',
//         onDelete: 'CASCADE'
//     });
// }

// setupAssociations();

// module.exports = {
//     sequelize,
//     Department,
//     Seller,
//     Product,
//     Store
// };