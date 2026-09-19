FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
COPY packages/shared ./packages/shared
COPY services/payment-service ./services/payment-service
RUN npm install && npm run build -w @order-planning/shared && npm run build -w @order-planning/payment-service
CMD ["node", "services/payment-service/dist/index.js"]
