# Build stage
FROM node:16-alpine as build

WORKDIR /app

# Copy package.json files
COPY frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy the frontend code
COPY frontend/ .

# Build the Angular app with more memory allocated
ENV NODE_OPTIONS=--max_old_space_size=4096
RUN npm run build -- --configuration production

# Production stage
FROM nginx:alpine

# Copy the built app to nginx
COPY --from=build /app/dist/capacity-planning /usr/share/nginx/html

# Copy nginx configuration
COPY docker/frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
