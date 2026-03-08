all: init-db install run

init-db:
	if [ -f shop.db ]; then rm shop.db; fi
	sqlite3 shop.db < init.sql
install:
	npm install

run:
	npm start

docker-all: docker-build docker-run

docker-build:
	docker build -t shop-project .

docker-run:
	docker run -p 3000:3000 shop-project
