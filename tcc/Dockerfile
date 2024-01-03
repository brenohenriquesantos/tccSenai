FROM ubuntu:latest AS build

RUN apt-get update \
    && apt-get install openjdk-17-jdk -y \
    && apt-get install maven -y

WORKDIR /app

# Copie todos os arquivos do projeto
COPY . .

# Execute o Maven para construir o projeto
RUN mvn clean install
