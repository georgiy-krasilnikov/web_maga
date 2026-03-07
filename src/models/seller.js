// const { db } = require('./models');

module.exports = (sequelize, DataTypes) => {
    const Seller = sequelize.define('Seller', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        email: {
            type: DataTypes.TEXT,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        phone: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        department_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'departments',
                key: 'id'
            }
        }
    }, {
        tableName: 'sellers'
    });

    Seller.associate = (models) => {
        Seller.belongsTo(models.Department, {
            foreignKey: 'department_id',
            as: 'departments',
            onDelete: 'SET NULL'
        });

        Seller.hasMany(models.Product, {
            foreignKey: 'seller_id',
            as: 'products',
            onDelete: 'SET NULL'
        });
    };

    return Seller;
};