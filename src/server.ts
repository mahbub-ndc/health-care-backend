import app from "./app";

const port = 3000;

async function startServer() {
  try {
    await app.listen(port);
    console.log(`Server is running at http://localhost:${port}`);
  } catch (error) {
    console.error("Error starting server:", error);
  }
}
startServer();
