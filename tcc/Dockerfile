# Use a imagem oficial do OpenJDK para a fase de construção
FROM openjdk:17-jdk AS build

# Crie o diretório de trabalho no contêiner
WORKDIR /app

# Copie todo o código-fonte para o contêiner
COPY . .

# Construa o projeto com o Maven
RUN ./mvnw clean install

# Imagem final para a execução
FROM openjdk:17-jdk-slim

# Defina o diretório de trabalho
WORKDIR /app

# Copie o JAR construído da fase de construção para a imagem final
COPY --from=build /app/target/tcc-0.0.1-SNAPSHOT.jar app.jar

# Expõe a porta da aplicação (ajuste conforme necessário)
EXPOSE 8080

# Comando de entrada para iniciar a aplicação Spring Boot
CMD ["java", "-jar", "app.jar"]
