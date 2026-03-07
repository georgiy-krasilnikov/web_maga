all: init-db install run

init-db:
	if [ -f shop.db ]; then
		rm shop.db
	fi
	sqlite3 shop.db < init.sql
install:
	npm install

run:
	npm start
