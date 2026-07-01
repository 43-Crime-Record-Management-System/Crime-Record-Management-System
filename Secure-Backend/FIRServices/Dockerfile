FROM eclipse-temurin:21-jdk

COPY target/*.jar app.jar

EXPOSE 9002

ENTRYPOINT ["java","-jar","app.jar"]