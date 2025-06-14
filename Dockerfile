FROM node:lts-alpine

# Set the working directory to /app
WORKDIR /app

# TODO(jeremy): Figure out how to only copy the package.json and package-lock.json files to the container.
# before running yarn. I can't seem to get the workspace to play nicely with this.
COPY package.json yarn.lock ./

RUN corepack enable
RUN corepack prepare --activate

# Install the dependencies
RUN yarn

COPY . .

RUN yarn build && ls -la

# Expose port 8080
EXPOSE 8080

# Start the Express server
CMD ["yarn", "start:docker"]
