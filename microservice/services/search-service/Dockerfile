FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
COPY packages/shared ./packages/shared
COPY services/search-service ./services/search-service
RUN npm install && npm run build -w @order-planning/shared && npm run build -w @order-planning/search-service
CMD ["node", "services/search-service/dist/index.js"]
