FROM node:16-slim

RUN apt-get update && apt-get install -yq \
  openssl \
  libssl-dev \
  libc6
# RUN ln -s /usr/bin/python3 /usr/bin/python

# apt (openssl, libssl-dev, and libc6
WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm ci

COPY . .

# ENV NODE_ENV=development
# RUN make prepare
# RUN make build
# COPY .env-prod .env
# RUN printenv
# RUN npm i npm-run-all
RUN npm run migrate-db
RUN npm run start-frontend
EXPOSE 9000
# EXPOSE 5432
# EXPOSE 443
# EXPOSE 80

# CMD ["bash", "-c", "npm run start-frontend"]
CMD ["bash", "-c", "npm run start-backend"]