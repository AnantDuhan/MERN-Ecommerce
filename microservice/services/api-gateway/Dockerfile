FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
COPY packages/shared ./packages/shared
COPY services/api-gateway ./services/api-gateway
RUN npm install && npm run build -w @order-planning/shared && npm run build -w @order-planning/api-gateway
CMD ["node", "services/api-gateway/dist/index.js"]
