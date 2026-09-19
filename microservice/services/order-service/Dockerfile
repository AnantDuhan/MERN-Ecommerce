FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
COPY packages/shared ./packages/shared
COPY services/order-service ./services/order-service
RUN npm install && npm run build -w @order-planning/shared && npm run build -w @order-planning/order-service
CMD ["node", "services/order-service/dist/index.js"]
