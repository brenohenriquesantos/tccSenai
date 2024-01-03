# Use a imagem oficial do OpenJDK para a fase de construção
FROM openjdk:17-jdk AS build

# Atualize o sistema e instale o Maven
RUN apt-get update && apt-get install -y maven

# Crie o diretório de trabalho no contêiner
WORKDIR /app

# Copie todo o código-fonte para o contêiner
COPY . .

# Construa o projeto com o Maven
RUN mvn clean install

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
