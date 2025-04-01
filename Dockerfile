# Build Stage
FROM node:20-alpine as build

# Set the working directory in the container
WORKDIR /app

# Copy the package.json file to the working directory
COPY package*.json ./

# Install all the dependencies
RUN npm install --ignore-scripts

# Copy the content of the local directory to the working directory
COPY . .

# Build the app
RUN npm run build


FROM nginx:alpine
# Copy the built app
COPY --from=build /app/dist /usr/share/nginx/html

# Expose ports
EXPOSE 80 

CMD ["nginx", "-g", "daemon off;"]
