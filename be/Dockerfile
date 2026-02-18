# Use OpenJDK 25
FROM eclipse-temurin:25-jdk-jammy

# Set working directory
WORKDIR /app

# Copy the built Spring Boot JAR into the container
COPY target/*.jar app.jar

# Expose port Spring Boot listens on
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
