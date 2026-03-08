FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache python3 make g++ sqlite

COPY package*.json ./

RUN npm ci --only=production

COPY . .

RUN sqlite3 --version && echo "СУБД SQLite утановлена"

RUN if [ -f init.sql ]; then \
        echo "Инициализация базы данных" && \
        sqlite3 /app/shop.db < init.sql && \
        # sqlite3 /app/shop.db < backup.sql && \ для дампа
        echo "База данных инициализирована"; \
    else \
        echo "Файл init.sql не найден"; \
    fi

RUN chown -R node:node /app

USER node

EXPOSE 3000

CMD ["npm", "start"]