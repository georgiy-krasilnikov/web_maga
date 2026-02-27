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

    // Department.createDepartment = (data) => {
    //     try {
    //         const department = Department.create({
    //             name: 'g',
    //             description: 'Отдел электроники и бытовой техники'
    //         });
    //         return department;
    //     } catch (err) {
    //         if (err) {
    //             console.error('Ошибка создания отдела:', err);
    //         }
    //     }
    // }

    // Department.updateDepartment = (condition, data) => {
    //     const id = condition
    //     try {
    //         const department = Department.findByPk(id);
    //         if (!department) {
    //             console.log('Отдел не найден');
    //             return null;
    //         }

    //         const res = department.update(data);
    //         console.log('Отдел обновлен:');
    //         return res;
    //     } catch (err) {
    //         console.error('Ошибка обновления отдела:', err);
    //     }
    // }

    // Department.deleteDepartment = (condition) => {
    //     const id = condition
    //     try {
    //         const department = Department.findByPk(id);
    //         if (!department) {
    //             console.log('Отдел не найден');
    //             return false;
    //         }

    //         department.destroy();
    //         console.log('Отдел удален');
    //         return true;
    //     } catch (err) {
    //         console.error('Ошибка удаления отдела:', err);
    //     }
    // }

    // Department.getById = (id) => {
    //     try {
    //         const department = Department.findByPk(id);
    //         if (!department) {
    //             console.log('Отдел не найден');
    //             return null;
    //         }

    //         console.log('Отдел найден');
    //         return department;
    //     } catch (err) {
    //         console.error('Ошибка при поиске отдела:', err);
    //     }
    // }

    // Department.getDepartments = (data) => {
    //     const condition = { where: { data } }
    //     try {
    //         const departments = Department.findAll(condition);

    //         // departments.forEach(dept => {
    //         //     console.log(`Отдел: ${dept.name}`);
    //         //     console.log('Продавцы:', dept.sellers.map(s => s.name).join(', ') || 'нет');
    //         // });

    //         return departments;
    //     } catch (err) {
    //         console.error('Ошибка получения отделов:', err);
    //     };
    // }

    return Department;
};