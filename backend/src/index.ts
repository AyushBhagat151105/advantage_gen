import express, { type Request, type Response } from "express";
import cors from "cors";
import { config } from "./config";
import { errorHandler } from "./middleware/errorHandler";
import { generateOpenAPIDocument } from "./config/openapi";
import { apiReference } from "@scalar/express-api-reference";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { generateRouter } from "./router/generate";
import path from "path";

const app = express();
const port = config.PORT;

// CORS must be first — before Better Auth handler — so preflight works
app.use(
    cors({
        origin: "http://localhost:3001",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        allowedHeaders: "Content-Type,Authorization",
        credentials: true,
    })
);

app.use(express.json());

app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express.urlencoded({ extended: true }));


app.get("/v1/openapi.json", (req: Request, res: Response) => {
    res.json(generateOpenAPIDocument());
});

app.use("/api/generate", generateRouter)
app.use("/api/generate/temp", express.static(path.resolve(process.cwd(), "temp")));

app.use(
    "/docs",
    apiReference({
        sources: [
            { url: "/v1/openapi.json", title: "API" },
            { url: "/api/auth/open-api/generate-schema", title: "Auth" },
        ],
        theme: "deepSpace",
    })
);



app.use(errorHandler);

const startServer = async () => {

    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
};

startServer();