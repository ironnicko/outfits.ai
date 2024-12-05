# Build Stage
FROM node:latest AS build-stage

WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN yarn install

# Copy the rest of the application files to the working directory
COPY . .

# Build the React application
RUN yarn run build

# Production Stage
FROM nginx:latest

# Copy the NGINX configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the build artifacts from the build stage to NGINX web server
COPY --from=build-stage /app/dist/ /usr/share/nginx/html

# We need to make sure not to run the container as a non root user
# for better security
WORKDIR /app
RUN chown -R nginx:nginx /app && chmod -R 755 /app && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d
RUN touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

USER nginx

# Expose port 80 for the NGINX server
EXPOSE 3000

# Command to start NGINX when the container is run
CMD ["nginx", "-g", "daemon off;"]