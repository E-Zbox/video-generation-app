// .env
import { config } from "dotenv";
import { join } from "path";
config({ path: join(__dirname, `../.env.${process.env.NODE_ENV}`) });
// controllers
import { globalErrorController, invalidRoutesController } from "./controllers";
// routes
import { baseAPIURL, indexRoutes } from "./routes";
import pictoryRoutes from "./routes/pictoryRoutes";
import userRoutes from "./routes/userRoutes";
import videoRoutes from "./routes/videoRoutes";

// app
import { app, server } from "./app";
// jobs
import jobs from "./jobs";

// port
const { PORT } = process.env;

app.use("/", indexRoutes);
app.use(`${baseAPIURL}/pictory`, pictoryRoutes);
app.use(`${baseAPIURL}/user`, userRoutes);
app.use(`${baseAPIURL}/video/background`, videoRoutes);

app.use("*", invalidRoutesController);

app.use(globalErrorController);

server.listen(PORT, () => {
  console.log(`Server is listening on PORT ${PORT}`);
  jobs();
});
