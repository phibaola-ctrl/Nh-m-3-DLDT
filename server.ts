import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route - In a real professional app, you'd handle some logic here
  // However, per platform guidelines, we leverage client-side Gemini calls
  // but we can have a placeholder for health or other metadata.
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", service: "AI Travel Planner" });
  });

  // Example of a backend endpoint as requested by user
  // In this implementation, we'll favor the client-side AI service for better performance
  // but this route is available for any server-side logic (e.g. logging)
  app.post("/api/generate-trip", (req, res) => {
    const { location, budget, days, preferences } = req.body;
    console.log(`Received trip request for ${location}`);
    // We send a 200 OK and let the client know it should proceed
    res.json({ message: "Request received", data: { location, budget, days, preferences } });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
