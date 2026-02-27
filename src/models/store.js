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

    // Store.createStore = (data) => {
    //     try {
    //         const store = Store.create({
    //             name: 'g',
    //             description: 'Отдел электроники и бытовой техники'
    //         });
    //         // console.log(store)
    //         return store;
    //     } catch (err) {
    //         if (err) {
    //             console.error('Ошибка создания отдела:', err);
    //         }
    //     }
    // }

    // Store.updateStore = (condition, data) => {
    //     const id = condition
    //     try {
    //         const store = Store.findByPk(id);
    //         if (!store) {
    //             console.log('Отдел не найден');
    //             return null;
    //         }

    //         const res = store.update(data);
    //         console.log('Отдел обновлен:');
    //         return res;
    //     } catch (err) {
    //         console.error('Ошибка обновления отдела:', err);
    //     }
    // }

    // Store.deleteStore = (condition) => {
    //     const id = condition
    //     try {
    //         const store = Store.findByPk(id);
    //         if (!store) {
    //             console.log('Отдел не найден');
    //             return false;
    //         }

    //         store.destroy();
    //         console.log('Отдел удален');
    //         return true;
    //     } catch (err) {
    //         console.error('Ошибка удаления отдела:', err);
    //     }
    // }

    // Store.getById = (id) => {
    //     try {
    //         const store = Store.findByPk(id);
    //         if (!store) {
    //             console.log('Отдел не найден');
    //             return null;
    //         }

    //         console.log('Отдел найден');
    //         return store;
    //     } catch (err) {
    //         console.error('Ошибка при поиске отдела:', err);
    //     }
    // }

    // Store.getStores = (data) => {
    //     const condition = { where: { data } }
    //     try {
    //         const stores = Store.findAll(condition);

    //         // stores.forEach(dept => {
    //         //     console.log(`Отдел: ${dept.name}`);
    //         //     console.log('Продавцы:', dept.sellers.map(s => s.name).join(', ') || 'нет');
    //         // });

    //         return stores;
    //     } catch (err) {
    //         console.error('Ошибка получения отделов:', err);
    //     };
    // }

    return Store;
};