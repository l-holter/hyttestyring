# Stage 1: Build Stage
FROM node:20-alpine AS build

WORKDIR /usr/src/app

# Install all dependencies, including devDependencies
COPY package*.json ./
RUN npm ci

# Copy source code and build the app
COPY . .
RUN npm run build

# Stage 2: Production Stage
FROM node:20-alpine

WORKDIR /usr/src/app

# Install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy built files from the build stage
COPY --from=build /usr/src/app/dist ./dist

# Expose port and start the app
EXPOSE 4173
CMD ["npm", "run", "preview"]
