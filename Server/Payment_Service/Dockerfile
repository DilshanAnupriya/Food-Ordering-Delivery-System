# Stage 1: Build the application
FROM maven:3.9-amazoncorretto-17



# Copy the built jar from builder stage
ADD target/payment-0.0.1-SNAPSHOT.jar ./app.jar

# Expose the port the app runs on
EXPOSE 8080

# Command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]