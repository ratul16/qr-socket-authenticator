FROM node:18-alpine

# Add build args
ARG NODE_ENV=development

# Set environment variables
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy the rest of the application
COPY . .

EXPOSE 3000

CMD ["pnpm", "run", "dev"]