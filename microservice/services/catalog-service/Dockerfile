FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
COPY packages/shared ./packages/shared
COPY services/catalog-service ./services/catalog-service
RUN npm install && npm run build -w @order-planning/shared && npm run build -w @order-planning/catalog-service
CMD ["node", "services/catalog-service/dist/index.js"]
