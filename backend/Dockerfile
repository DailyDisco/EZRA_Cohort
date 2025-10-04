# Build stage
FROM golang:1.24-alpine AS builder

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
    curl \
    && rm -rf /var/cache/apk/*

# Install golang-migrate
RUN curl -L https://github.com/golang-migrate/migrate/releases/download/v4.18.1/migrate.linux-amd64.tar.gz | tar xvz && \
    mv migrate /usr/local/bin/migrate && \
    chmod +x /usr/local/bin/migrate

# Create app directory
WORKDIR /app

# Copy binary from builder stage
COPY --from=builder /app/server .

# Copy migrations directory
COPY --from=builder /app/internal/db/migrations ./internal/db/migrations/

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