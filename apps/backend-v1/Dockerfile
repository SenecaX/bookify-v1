# Step 1: Build Stage
FROM node:18-alpine AS build

# Install necessary build tools for bcrypt and other native modules
RUN apk add --no-cache make gcc g++ python3

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to install dependencies
COPY package.json package-lock.json ./

# Install dependencies (use --legacy-peer-deps if needed)
RUN npm install --legacy-peer-deps

# Copy the entire workspace (adjust depending on which parts are needed)
COPY . .

# Build the backend-v1 app (assuming you have an Nx build target)
RUN npx nx build backend-v1 --skip-nx-cache

# Step 2: Runtime Stage
FROM node:18-alpine AS runtime

# Install necessary build tools for bcrypt and other native modules
RUN apk add --no-cache make gcc g++ python3

# Set the working directory
WORKDIR /usr/src/app

# Copy the built app from the build stage
COPY --from=build /usr/src/app/dist/apps/backend-v1 ./

# Copy node_modules from the build stage
COPY --from=build /usr/src/app/node_modules ./node_modules

# Copy .env.production file into the image
COPY .env.production ./

# Expose the port used by the backend
EXPOSE 8000

# Start the server
CMD ["node", "main.js"]
