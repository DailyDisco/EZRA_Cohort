# Build stage
FROM golang:1.25-alpine AS builder

# Set working directory
WORKDIR /app

# Copy go mod files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o server .

# Runtime stage
FROM alpine:latest

# Install runtime dependencies only
RUN apk --no-cache add \
    postgresql-client \
    ca-certificates \
    tzdata \
    && rm -rf /var/cache/apk/*

# Create app directory
WORKDIR /app

# Copy binary from builder stage
COPY --from=builder /app/server .

# Copy entrypoint script
COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

# Copy cron job configuration
COPY ./cmd/cron/leases-cron /etc/cron.d/leases-cron
RUN chmod 0644 /etc/cron.d/leases-cron && crontab /etc/cron.d/leases-cron

# Create necessary directories
RUN mkdir -p /app/tmp /app/temp

EXPOSE 8080

# Environment variable to control whether to use Air (not used in production)
ENV USE_AIR=false

ENTRYPOINT ["/app/entrypoint.sh"]