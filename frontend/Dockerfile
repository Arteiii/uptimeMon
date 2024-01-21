# Use an official SvelteKit image
FROM node:14 AS builder

WORKDIR /app

# Install dependencies
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install

# Copy source files
COPY frontend .

# Build the SvelteKit app
RUN npm run build

# Use a lightweight Node image for production
FROM node:14-alpine

WORKDIR /app

# Copy the built files from the previous stage
COPY --from=builder /app/build /app

# Expose the port on which the SvelteKit app will run
EXPOSE 5000

# Start the SvelteKit app
CMD ["npm", "run", "start"]
