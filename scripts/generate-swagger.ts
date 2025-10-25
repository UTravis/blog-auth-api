import fs from "fs";
import path from "path";
import swaggerJSDoc from "swagger-jsdoc";

// Define your Swagger configuration
const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My Next.js API",
      version: "1.0.0",
      description: "API documentation generated automatically by swagger-jsdoc",
    },
    servers: [
      {
        url: "https://blog-auth-api-seven.vercel.app/api",
        description: "Production server",
      },
      {
        url: "http://localhost:3000/api",
        description: "Local development server",
      },
    ],
  },
  // Adjust the path to your API routes
  apis: ["./src/pages/api/**/*.ts", "./src/app/api/**/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

// Path to save the generated swagger.json
const outputPath = path.join(process.cwd(), "public", "swagger.json");

// Ensure public directory exists
fs.mkdirSync(path.dirname(outputPath), { recursive: true });

// Write the file
fs.writeFileSync(outputPath, JSON.stringify(swaggerSpec, null, 2));

console.log("✅ Swagger spec generated successfully at /public/swagger.json");
