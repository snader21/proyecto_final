# Stage 1: Build the application
FROM node:20-buster AS build

WORKDIR /app

# Create non-root user
RUN groupadd -r nodeuser && \
    useradd -m -r -g nodeuser nodeuser && \
    chown nodeuser:nodeuser /app

USER nodeuser

# Copy source code
COPY --chown=nodeuser:nodeuser . .

# Install dependencies and build app
RUN npm ci && npm run build --ignore-scripts

# Stage 2: Setup production environment
FROM node:20-alpine AS production

WORKDIR /app

# Setup non-root user for security
RUN addgroup -S nodeuser && \
    adduser -S nodeuser -G nodeuser && \
    chown nodeuser:nodeuser /app

USER nodeuser

# Copy built application
COPY --chown=nodeuser:nodeuser --from=build /app/dist ./dist
COPY --chown=nodeuser:nodeuser --from=build /app/package*.json ./

# Install only production dependencies (if needed at runtime)
RUN npm ci --production

# Run the app
CMD ["node", "dist/main"]
