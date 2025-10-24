// server.js
import fs from "fs";
import http from "http";
import app from "./app.js";

const PORT = process.env.PORT || 3040;

// load trusted local certificates (use mkcert-generated ones)
// const httpsOptions = {
//   key: fs.readFileSync("server-key.pem"),
//   cert: fs.readFileSync("server-cert.pem"),
// };

http.createServer(app).listen(PORT, () => {
  console.log(`✅ HTTPS Server is running at http://localhost:${PORT}`);
});
