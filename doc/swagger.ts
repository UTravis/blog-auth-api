import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Next.js API Docs",
      version: "1.0.0",
      description: "This is the API documentation for your Next.js project.",
    },
    tags: [
      { name: "Auth", description: "Authentication endpoints" },
      { name: "Blog", description: "Blog management endpoints" },
    ],
    servers: [
      {
        url: "https://blog-auth-api-seven.vercel.app/", // change this to your deployed URL later
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Paths to files containing OpenAPI definitions (your routes)
  apis: ["./app/api/**/*.ts"], 
};

const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;
