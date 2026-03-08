PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE departments (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT DEFAULT ''
);
INSERT INTO departments VALUES(1,'Продукты','');
INSERT INTO departments VALUES(2,'Электроника','');
INSERT INTO departments VALUES(3,'Строительный','Инструменты и материалы');
INSERT INTO departments VALUES(4,'Игрушки','');
CREATE TABLE sellers (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  department_id INTEGER DEFAULT NULL,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL -- если удаляется филиал, продавцы могут перейти в другой - не удаляем
);
INSERT INTO sellers VALUES(1,'Миша','example@ru.com','999',1);
INSERT INTO sellers VALUES(2,'Ксюша','ru@ru.com','4444',NULL);
INSERT INTO sellers VALUES(3,'Кирилл','kir@ya.ru','00998',4);
INSERT INTO sellers VALUES(4,'Валя','va@vk.ru','3333',2);
CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  price INTEGER NOT NULL, 
  category TEXT NOT NULL,
  department_id INTEGER DEFAULT NULL,
  seller_id INTEGER NOT NULL,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL, -- исключительно для промежуточной связи
  FOREIGN KEY (seller_id) REFERENCES sellers(id) ON DELETE CASCADE -- а если нет продавца, то удаляются и с склада и из каталога, т.к. некому поставлять 
);
INSERT INTO products VALUES(1,'Молоко','',100,'Молочные продукты',NULL,2);
INSERT INTO products VALUES(2,'Хлеб','',23,'Еда',NULL,2);
INSERT INTO products VALUES(3,'Молоток','',380,'Инструменты',4,3);
INSERT INTO products VALUES(4,'Краска','',800,'Краски',4,3);
INSERT INTO products VALUES(5,'Выпечка','',230,'Булочное',2,4);
INSERT INTO products VALUES(6,'Орехи','',244,'Орехи',NULL,2);
INSERT INTO products VALUES(7,'Кукуруза','',500,'Другое',NULL,2);
INSERT INTO products VALUES(8,'Утка','',400,'Мясо',4,3);
INSERT INTO products VALUES(9,'Мистер мускул','',203,'Химия',1,1);
INSERT INTO products VALUES(10,'Ноутбук','',20000,'Компьютерные устройства',2,4);
INSERT INTO products VALUES(11,'Курица','',304,'Мясо',1,1);
INSERT INTO products VALUES(12,'iPhone','',80000,'Телефоны',2,4);
CREATE TABLE store (
  id INTEGER PRIMARY KEY,
  product_id INTEGER NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  position TEXT DEFAULT '',
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE -- удаляется товар из каталога, удаляется и со склада
);
INSERT INTO store VALUES(1,1,41,'А.9');
INSERT INTO store VALUES(3,3,2,'Б.1');
INSERT INTO store VALUES(4,5,6,'Б.3');
INSERT INTO store VALUES(5,7,8,'В.2');
INSERT INTO store VALUES(6,10,0,'');
INSERT INTO store VALUES(7,11,0,'');
INSERT INTO store VALUES(8,12,1,'Р.4');
INSERT INTO store VALUES(9,4,6,'Г.4');
COMMIT;
