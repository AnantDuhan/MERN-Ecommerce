FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
COPY packages/shared ./packages/shared
COPY services/notification-service ./services/notification-service
RUN npm install && npm run build -w @order-planning/shared && npm run build -w @order-planning/notification-service
CMD ["node", "services/notification-service/dist/index.js"]
