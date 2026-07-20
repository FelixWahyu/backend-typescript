import swaggerUi from "swagger-ui-express";
import { Application } from "express";
import { env } from "./env";
import swaggerDocument from "./openapi.json";

export const setupSwagger = (app: Application): void => {
  // Configure server URL dynamically based on API version
  if (swaggerDocument.servers && swaggerDocument.servers[0]) {
    swaggerDocument.servers[0].url = `/api/${env.API_VERSION}`;
  }
  
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log(`Swagger docs available at http://localhost:${env.PORT}/api-docs`);
};
