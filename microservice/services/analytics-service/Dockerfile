FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
COPY packages/shared ./packages/shared
COPY services/analytics-service ./services/analytics-service
RUN npm install && npm run build -w @order-planning/shared && npm run build -w @order-planning/analytics-service
CMD ["node", "services/analytics-service/dist/index.js"]
