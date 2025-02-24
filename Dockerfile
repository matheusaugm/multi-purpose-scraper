FROM node:20-alpine

# Install necessary packages
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    yarn


# Set working directory
WORKDIR /opt

# Create necessary directories and set permissions
RUN mkdir -p /logs /opt/dist/config /opt/node_modules


# Copy package files and install dependencies
COPY package.json yarn.lock ./
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
RUN yarn install --ignore-scripts

# Copy the rest of the application code
COPY . .


# Build the application
RUN yarn build

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["yarn", "start"]