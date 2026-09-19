FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
COPY packages/shared ./packages/shared
COPY services/auth-service ./services/auth-service
RUN npm install && npm run build -w @order-planning/shared && npm run build -w @order-planning/auth-service
CMD ["node", "services/auth-service/dist/index.js"]
