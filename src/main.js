import AppwriteService from "./appwrite.js";
import { generateShortCode, throwIfMissing } from "./utils.js";
import { config } from "dotenv";

config();

console.log(`Your port is ${process.env.PORT}`);
export default async ({ res, req, log, error }) => {

  const appwrite = new AppwriteService();

  if (
    req.method === "POST" &&
    req.headers["content-type"] === "application/json"
  ) {
    try {
      throwIfMissing(req.body, ["url"]);
      new URL(req.body.url);
    } catch (err) {
      error(err.message);
      return res.send({ ok: false, error: err.message }, 400);
    }

    context.log(req.body.url);

    const urlEntry = await appwrite.createURLEntry(
      req.body.url,
      req.body.shortCode ?? generateShortCode(),
    );
    if (!urlEntry) {
      error("Failed to create url entry.");
      return res.json({ ok: false, error: "Failed to create url entry" }, 500);
    }

    return res.json({
      short: new URL(urlEntry.$id, process.env.SHORT_BASE_URL).toString(),
    });
  }

  const shortId = req.path.replace(/^\/|\/$/g, "");
  log(`Fetching document from with ID: ${shortId}`);

  const urlEntry = await appwrite.getURLEntry(shortId);

  if (!urlEntry) {
    return res.send("Invalid link.", 404);
  }

  return res.redirect(urlEntry.url);
};
