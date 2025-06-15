# Build stage for the backend
FROM node:20-alpine AS backend-builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build && \
    yarn cache clean && \
    rm -rf node_modules

# Build stage for the frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build && \
    yarn cache clean && \
    rm -rf node_modules

# Production stage
FROM node:20-alpine
WORKDIR /app

# Copy only the necessary files for production
COPY --from=backend-builder /app/dist ./dist
COPY package.json yarn.lock ./

# Install only production dependencies and clean up
RUN yarn install --frozen-lockfile --production --network-timeout 100000 && \
    yarn cache clean && \
    rm -rf /root/.cache && \
    rm -rf /root/.npm

# Copy frontend build
COPY --from=frontend-builder /app/dist/client ./dist/client

# Set environment variables
ENV NODE_ENV=production \
    PORT=8080

# Create a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup && \
    chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose the port
EXPOSE 8080

# Start the Express server
CMD ["yarn", "start:docker"]
