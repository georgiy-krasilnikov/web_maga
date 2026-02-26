// const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('products', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            defaultValue: ''
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        cost_price: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        category: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        department_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'departments',
                key: 'id'
            }
        },
        seller_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'sellers',
                key: 'id'
            }
        }
    });

    Product.associate = (models) => {
        Product.belongsTo(models.Department, {
            foreignKey: 'department_id',
            as: 'departments',
            onDelete: 'SET NULL' // при удалении филиала товар остается
        });

        Product.belongsTo(models.Seller, {
            foreignKey: 'seller_id',
            as: 'sellers',
            onDelete: 'CASCADE' // при удалении продавца товар удаляется
        });

        Product.hasOne(models.Store, {
            foreignKey: 'product_id',
            as: 'stores',
            onDelete: 'CASCADE' // при удалении товара удаляется и запись на складе
        });
    };





    return Product;
};