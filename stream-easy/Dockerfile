# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code into the container
COPY . .

# Build the React app
RUN npm run build

# Install a lightweight web server
RUN npm install -g serve

# Expose the port the app runs on
EXPOSE 3000

# Start the app
# CMD ["npm", "start"]
CMD ["serve", "-s", "build"]
