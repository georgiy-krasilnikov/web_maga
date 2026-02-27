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

    // Seller.createSeller = (data) => {
    //     try {
    //         const seller = Seller.create({
    //             name: 'g',
    //             description: 'Отдел электроники и бытовой техники'
    //         });

    //         return seller;
    //     } catch (err) {
    //         if (err) {
    //             console.error('Ошибка создания отдела:', err);
    //         }
    //     }
    // }

    // Seller.updateSeller = (condition, data) => {
    //     const id = condition
    //     try {
    //         const seller = Seller.findByPk(id);
    //         if (!seller) {
    //             console.log('Отдел не найден');
    //             return null;
    //         }

    //         const res = seller.update(data);
    //         console.log('Отдел обновлен:');
    //         return res;
    //     } catch (err) {
    //         console.error('Ошибка обновления отдела:', err);
    //     }
    // }

    // Seller.deleteSeller = (condition) => {
    //     const id = condition
    //     try {
    //         const seller = Seller.findByPk(id);
    //         if (!seller) {
    //             console.log('Отдел не найден');
    //             return false;
    //         }

    //         seller.destroy();
    //         console.log('Отдел удален');
    //         return true;
    //     } catch (err) {
    //         console.error('Ошибка удаления отдела:', err);
    //     }
    // }

    // Seller.getById = (id) => {
    //     try {
    //         const seller = Seller.findByPk(id);
    //         if (!seller) {
    //             console.log('Отдел не найден');
    //             return null;
    //         }

    //         console.log('Отдел найден');
    //         return seller;
    //     } catch (err) {
    //         console.error('Ошибка при поиске отдела:', err);
    //     }
    // }

    // Seller.getDepartments = (data) => {
    //     const condition = { where: { data } }
    //     try {
    //         const sellers = Seller.findAll(condition);

    //         // sellers.forEach(dept => {
    //         //     console.log(`Отдел: ${dept.name}`);
    //         //     console.log('Продавцы:', dept.sellers.map(s => s.name).join(', ') || 'нет');
    //         // });

    //         return sellers;
    //     } catch (err) {
    //         console.error('Ошибка получения отделов:', err);
    //     };
    // }

    return Seller;
};