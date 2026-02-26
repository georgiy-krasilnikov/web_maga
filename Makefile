all: init-db install run
# 	sqlite3 shop.db < init.sql
# 	npm install
# 	npm start
init-db:
# 	if [ -f shop.db ]; then
# 		rm shop.db
# 	fi
	rm shop.db
	sqlite3 shop.db < init.sql
install:
	npm install

run:
	npm start
