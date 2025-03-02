import swaggerUi from "swagger-ui-express";
import { Express, Request, Response } from "express";
import swaggerJSDoc from "swagger-jsdoc";
import { version } from "../../package.json";
import chalk from "chalk";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Senseii Backend Docs",
      version,
    },
    servers: [
      {
        url: "http://localhost:9090",
      },
    ],
  },
  apis: ["../routes/*.ts", "../controller/*.ts", "../models/*.ts"],
};

export const swaggerDocs = swaggerJSDoc(options);

// const openApiSpecification = swaggerJSDoc(options);

// export default function swaggerDocs(app: Express, port: number) {
//   // Swagger page
//   app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiSpecification));

//   // Docs in JSON format
//   app.get("/docs.json", (req: Request, res: Response) => {
//     res.setHeader("Content-type", "application/json");
//     res.send(openApiSpecification);
//   });

//   console.log(
//     chalk.green(`Swagger UI running at http://localhost:${port}/docs`)
//   );
// }
