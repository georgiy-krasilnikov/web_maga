const db = require('./models');

async function main() {
    try {
        // console.log(res)
        // Синхронизация моделей с БД
        // await db.sequelize.truncate({
        //     cascade: true,
        //     restartIdentity: true
        // });
        // await db.sequelize.sync(); // force: true пересоздаст таблицы
        console.log('База данных синхронизирована');


        // Создание отдела
        // const electronics = await db.Department.create({
        //     id: 1,
        //     name: 'Электроника',
        //     description: 'Отдел электроники и бытовой техники'
        // })
        // await db.sequelize.sync();
        const electronics = await db.Department.createDepartment();
        console.log(electronics.toJSON())
        // const all = await db.Department.findAll();
        // console.log(all.dataValues)



    } catch (error) {
        console.error('Ошибка:', error);
    }
}

// Запуск приложения
main();