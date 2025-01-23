FROM node:18-alpine

WORKDIR /usr/src/app

# Install pnpm globally
RUN npm install -g pnpm

# Copy root package files
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install dependencies at root level
RUN pnpm install

# Copy the rest of the application
COPY . .

# Install dependencies in the app directory
WORKDIR /usr/src/app/app
RUN if [ -f "pnpm-lock.yaml" ]; then pnpm install; fi

# Go back to root directory
WORKDIR /usr/src/app

EXPOSE 5000
EXPOSE 3001

# We'll specify the CMD in docker-compose for each service