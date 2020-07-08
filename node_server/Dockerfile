FROM node:8-alpine

ENV PORT 3000
# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# RUN apk add python
RUN npm_config_unsafe_perm=true
RUN npm --global config set user root
RUN npm install
RUN npm install --global --unsafe-perm nodemon
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .
# CMD [ "nodemon","-L","app.js" ]
CMD  ["npm", "start"]
EXPOSE 3000
