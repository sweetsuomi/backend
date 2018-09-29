FROM node:8
MAINTAINER DevStarlight
ENV TZ=Europe/Madrid
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN mkdir -p /app/src
WORKDIR /app
ARG NODE_ENV
ARG BACKEND_API_URL
ARG FRONTEND_HOST
ARG FRONTEND_PORT
COPY ./package*.json /app/
RUN npm install
COPY . /app/src
CMD npm start
EXPOSE 3001
