ARG NODE_VERSION=24-alpine

# ---- Base: shared dependency layer ----
FROM node:${NODE_VERSION} AS base
WORKDIR /usr/src/app
COPY package*.json ./

# ---- Development: hot-reload via nest start --watch ----
FROM base AS development
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start:dev"]

# ---- Build: compile the application ----
FROM base AS build
RUN npm install
COPY . .
RUN npm run build
RUN npm prune --omit=dev

# ---- Production: lean runtime image ----
FROM node:${NODE_VERSION} AS production
WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY package*.json ./
EXPOSE 3000
CMD ["node", "dist/main"]