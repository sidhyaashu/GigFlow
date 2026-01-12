FROM node:22-slim

# Add metadata
LABEL maintainer="Asutosh Sidhya <ashutoshsidhya69@gmail.com>"
LABEL description="GigFlow Server Production Image"

WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Copy package files first
COPY package*.json ./

# Install only production dependencies
RUN npm install

# Copy application code
COPY . .

# Expose port
EXPOSE 5000

# Run the application
CMD ["node", "index.js"]
