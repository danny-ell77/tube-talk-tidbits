FROM node:20-slim

WORKDIR /app

# Copy package.json files
COPY package.json ./
COPY bun.lockb ./

# Install dependencies using bun
RUN npm install -g bun && bun install

# Copy the rest of the application
COPY . .

# Build the application
RUN bun run build

# Expose port 5173 for the Vite development server
EXPOSE 5173
EXPOSE 4173

# Command to run the application
CMD ["bun", "run", "dev", "--host"]
