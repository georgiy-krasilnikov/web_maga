// const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Department = sequelize.define('Department', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            defaultValue: ''
        }
    }, {
        tableName: "departments"
    });

    Department.associate = (models) => {
        Department.hasMany(models.Seller, {
            foreignKey: 'department_id',
            as: 'sellers',
            onDelete: 'SET NULL'
        });

        Department.hasMany(models.Product, {
            foreignKey: 'department_id',
            as: 'products',
            onDelete: 'SET NULL'
        });
    };

    return Department;
};