# Multi-stage build for optimized production image
FROM node:20-alpine AS base

# Install build dependencies
RUN apk add --no-cache git

WORKDIR /app

# Copy package files for better layer caching
COPY package*.json ./

# Install dependencies with cache mount for faster builds
RUN --mount=type=cache,target=/root/.npm \
    npm ci --only=production --no-audit --no-fund --prefer-offline

# Production build stage
FROM base AS build

# Copy package files again for build stage
COPY package*.json ./

# Install all dependencies (including dev dependencies) for build
RUN --mount=type=cache,target=/root/.npm \
    npm ci --no-audit --no-fund --prefer-offline

# Declare build arguments for Vite environment variables
ARG VITE_API_URL
ARG VITE_CLERK_PUBLISHABLE_KEY

# Pass build arguments as environment variables for Vite to pick up during build
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage - use nginx for serving static files
FROM nginx:alpine AS production

# Copy built application from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration for SPA routing
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for nginx
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
