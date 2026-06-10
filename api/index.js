export default async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Forwarded-Host, Accept-Language, Content-Language, Content-Type"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const { pathname } = new URL(req.url, `http://${req.headers.host}`);

  const HAS_OPENAI = !!process.env.OPENAI_API_KEY;
  const PROVIDER = process.env.PROVIDER || (HAS_OPENAI ? "openai" : "mock");
  const MODEL = process.env.MODEL || "gpt-5.4";
  const USE_MOCK = process.env.USE_MOCK === "true" || !HAS_OPENAI;

  // Route: GET /api/health
  if (pathname === "/api/health" && req.method === "GET") {
    res.json({
      ok: true,
      mode: USE_MOCK ? "mock" : "live",
      provider: PROVIDER,
      model: MODEL,
    });
    return;
  }

  // Route: POST /api/estimate
  if (pathname === "/api/estimate" && req.method === "POST") {
    try {
      const { project, requirement } = req.body || {};

      if (!project || !requirement) {
        return res.status(400).json({
          error: "Missing project or requirement.",
        });
      }

      if (project !== "tdm") {
        return res.status(400).json({
          project,
          covered: false,
          message: `Project "${project}" is not yet supported. Currently, only TDM is available.`,
        });
      }

      // For now, return a simple mock estimate
      const estimate = {
        project: "tdm",
        covered: true,
        summary: `Estimate for: ${requirement}`,
        confidence: "high",
        tasks: [
          { id: "t1", name: "Task 1", manualDays: 1, aiSavingsPct: 30, aiDays: 0.7 },
          { id: "t2", name: "Task 2", manualDays: 2, aiSavingsPct: 40, aiDays: 1.2 },
        ],
      };

      res.json(estimate);
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({ error: err.message || "Error" });
    }
    return;
  }

  // Route: GET /api/estimates
  if (pathname === "/api/estimates" && req.method === "GET") {
    res.json([]);
    return;
  }

  // 404
  res.status(404).json({ error: "Not found" });
}
