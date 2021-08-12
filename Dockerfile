FROM node:14.17-alpine AS builder
WORKDIR /app
COPY ./package*.json ./
RUN npm install
COPY . .
RUN npm run prebuild
RUN npm run build
RUN npm prune --production

FROM node:14.17-alpine
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules/ ./node_modules/
COPY --from=builder /app/.env ./
COPY --from=builder /app/dist/ ./dist/
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
