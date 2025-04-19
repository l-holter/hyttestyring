# Stage 1: Build Stage
FROM node:slim AS build

WORKDIR /usr/src/app

# Install all dependencies, including devDependencies
COPY package*.json ./
RUN npm ci

# Copy source code and build the app
COPY . .
RUN npm run build

# Stage 2: Production Stage
FROM node:slim

WORKDIR /usr/src/app

# Install serve globally
RUN npm install -g serve

# Copy built files from the build stage
COPY --from=build /usr/src/app/dist ./dist

# Expose port and start the app with serve
EXPOSE 4173
CMD ["serve", "-s", "dist", "-l", "4173"]