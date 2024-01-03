# Use a imagem oficial do OpenJDK
FROM openjdk:17-jdk-alpine

# Defina o diretório de trabalho
WORKDIR /app

# Copie o JAR da aplicação para o contêiner
COPY target/*.jar /app/app.jar

# Expõe a porta da aplicação (ajuste conforme necessário)
EXPOSE 8080

# Comando de entrada para iniciar a aplicação Spring Boot
CMD ["java", "-jar", "/app/app.jar"]