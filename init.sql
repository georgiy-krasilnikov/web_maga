-- Филиалы магазина
CREATE TABLE IF NOT EXISTS departments (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT DEFAULT ''
);

-- Продавцы (компании-поставщики)
CREATE TABLE IF NOT EXISTS sellers (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  department_id INTEGER DEFAULT NULL,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL -- если удаляется филиал, продавцы могут перейти в другой - не удаляем
);

-- Товары (каталог товаров)
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  price INTEGER NOT NULL, 
  category TEXT NOT NULL,
  department_id INTEGER DEFAULT NULL,
  seller_id INTEGER DEFAULT NULL,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL, -- если нет филиала, то товары остаются на складе и в каталоге 
  FOREIGN KEY (seller_id) REFERENCES sellers(id) ON DELETE CASCADE -- а если нет продавца, то удаляются и с склада и из каталога
);

-- Склад (хранение товаров)
CREATE TABLE IF NOT EXISTS store (
  id INTEGER PRIMARY KEY,
  product_id INTEGER NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  position TEXT DEFAULT '',
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE -- удаляется товар из каталога, удаляется и со склада
);
