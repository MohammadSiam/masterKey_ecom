# Use Node.js Image as base
FROM node:20

# Set working directory in the container
WORKDIR /usr/src/app

# Copy the rest of the application code
COPY . .

# Install app dependencies
RUN npm install

RUN npm run build

# delete the src directory after building
RUN rm -rf ./src

# Expose the port that your NestJS app is running on
EXPOSE 3000

# Command to run the application
CMD ["npm","run", "start:dev"]
