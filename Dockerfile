FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS production
WORKDIR /app
COPY --from=build /app/dist/opencode-angular/server ./server
COPY --from=build /app/dist/opencode-angular/browser ./browser
COPY --from=build /app/package.json ./
EXPOSE 4000
USER node
CMD ["node", "server/server.mjs"]
