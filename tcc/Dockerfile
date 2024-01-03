FROM maven:3.8.4-openjdk-17 AS build

WORKDIR /app

# Copie o arquivo pom.xml para o diretório atual
COPY pom.xml .

# Copie o restante do código-fonte
COPY src ./src

# Execute o Maven para construir o projeto
RUN mvn clean install

# Segunda etapa para a imagem final
FROM openjdk:17-jdk-slim

WORKDIR /app

# Copie o JAR gerado na primeira etapa
COPY --from=build /app/target/tcc-0.0.1-SNAPSHOT.jar app.jar

# Exponha a porta da aplicação
EXPOSE 8080

# Comando de entrada para iniciar a aplicação Spring Boot
CMD ["java", "-jar", "app.jar"]
