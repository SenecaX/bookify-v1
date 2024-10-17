# Step 1: Build the React app with Node.js
FROM node:18-alpine AS builder

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and install dependencies
COPY package.json ./
RUN npm install --legacy-peer-deps

# Copy the rest of the Nx workspace
COPY . .

# Build the React app (replace 'dashboard-v1' with your actual app name)
RUN npx nx build dashboard-v1 --skip-nx-cache

# Step 2: Use Nginx to serve the static files
FROM nginx:alpine

# Set the PORT environment variable
ARG VITE_DASHBOARD_PORT=4200
ENV PORT=${VITE_DASHBOARD_PORT}

# Print the PORT to verify it's set correctly
RUN echo "The PORT is set to: ${PORT}"

# Copy the custom Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Use a temporary file for envsubst to avoid overwriting the original
RUN envsubst '${PORT}' < /etc/nginx/conf.d/default.conf > /etc/nginx/conf.d/default.temp \
    && mv /etc/nginx/conf.d/default.temp /etc/nginx/conf.d/default.conf

# Copy the built React app from the builder stage to the Nginx HTML folder
COPY --from=builder /usr/src/app/dist/apps/dashboard-v1 /usr/share/nginx/html

# Expose the dynamic port
EXPOSE ${PORT}

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
