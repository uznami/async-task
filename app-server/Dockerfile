FROM ubuntu:16.04

RUN apt-get update

RUN apt-get install -y nodejs npm
RUN apt-get install -y curl
RUN npm cache clean
RUN npm install n -g
RUN n stable

RUN npm install -g yarn

RUN useradd server
USER server
WORKDIR /home/server
