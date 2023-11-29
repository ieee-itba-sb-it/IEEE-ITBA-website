FROM node:14

# Set working directory
WORKDIR /app

# Copy the repository contents into the container
COPY . /app

# Install dependencies
RUN npm install

# Set up Firebase CLI (if needed)
RUN npm install -g firebase-tools

# Set up act
RUN npm install -g act

# Start the shell
CMD ["bash"]
