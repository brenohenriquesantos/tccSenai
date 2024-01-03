# Fase de construção
FROM openjdk:17-jdk AS build

# Definir o diretório de trabalho no contêiner
WORKDIR /app

# Copiar todos os arquivos para aproveitar o cache de dependências do Maven
COPY . .

# Baixar as dependências do Maven (se houver alterações no pom.xml)
RUN ./mvnw dependency:go-offline

# Construir o projeto com o Maven
RUN ./mvnw clean install

# Fase de execução
FROM openjdk:17-jdk-slim

# Definir o diretório de trabalho
WORKDIR /app

# Copiar o JAR construído da fase de construção para a imagem final
COPY --from=build /app/target/tcc-0.0.1-SNAPSHOT.jar app.jar

# Expor a porta da aplicação (ajustar conforme necessário)
EXPOSE 8080

# Comando de entrada para iniciar a aplicação Spring Boot
CMD ["java", "-jar", "app.jar"]
