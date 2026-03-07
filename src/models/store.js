// const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Store = sequelize.define('Store', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            references: {
                model: 'products',
                key: 'id'
            }
        },
        count: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        position: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: ''
        },
    }, {
        tableName: 'store',
    });

    Store.associate = (models) => {
        Store.belongsTo(models.Product, {
            foreignKey: 'product_id',
            as: 'products',
            onDelete: 'CASCADE'
        });
    };

    return Store;
};