import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "GymBuddy API",
      version: "1.0.0",
      description: "Backend API for GymBuddy  app",
      contact: {
        name: "API Support",
      },
    },
    servers: [
      {
        url: "https://gymbuddy-74oz.onrender.com/api",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "JWT token for authentication",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

export default swaggerJsdoc(options);
