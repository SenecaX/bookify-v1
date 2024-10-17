# Step 1: Use Node.js for building and running the backend-v1 app
FROM node:18-alpine AS backend-v1

# Set the working directory to the root of the monorepo
WORKDIR /usr/src/app

# Copy the root package.json and package-lock.json to install dependencies for the whole monorepo
COPY package.json package-lock.json ./

# Install dependencies for the entire monorepo with --legacy-peer-deps (if needed)
RUN npm install --legacy-peer-deps

# Copy the rest of the Nx workspace (including the backend-v1 and shared libraries)
COPY . .

# Build the backend-v1 app (assuming you have an Nx build target)
RUN npx nx build backend-v1 --skip-nx-cache

# Change directory to the built backend-v1 app
WORKDIR /usr/src/app/dist/apps/backend-v1

# Expose the backend-v1 port
EXPOSE 8000

# Start the backend-v1 server
CMD ["node", "main.js"]