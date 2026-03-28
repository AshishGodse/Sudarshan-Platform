# Use official Node.js runtime as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the entire project
COPY . .

# Build the Next.js application
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"]
