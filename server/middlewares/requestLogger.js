// Request logger middleware
// Logs all incoming requests to the terminal with color-coded methods

const requestLogger = (req, res, next) => {
  const start = Date.now();
  const timestamp = new Date().toISOString();

  // Color codes for different HTTP methods
  const methodColors = {
    GET: "\x1b[32m",    // Green
    POST: "\x1b[33m",   // Yellow
    PUT: "\x1b[34m",    // Blue
    PATCH: "\x1b[35m",  // Magenta
    DELETE: "\x1b[31m", // Red
    OPTIONS: "\x1b[36m", // Cyan
  };
  const reset = "\x1b[0m";
  const color = methodColors[req.method] || reset;

  // Log when response finishes
  res.on("finish", () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;

    // Color status code: green for 2xx, yellow for 3xx, red for 4xx/5xx
    let statusColor = "\x1b[32m"; // green
    if (statusCode >= 300) statusColor = "\x1b[33m"; // yellow
    if (statusCode >= 400) statusColor = "\x1b[31m"; // red

    console.log(
      `${color}${req.method}${reset} ${req.originalUrl} ${statusColor}${statusCode}${reset} - ${duration}ms`
    );

    // Warn on slow requests
    if (duration > 2000) {
      console.warn(`⚠️  Slow request: ${req.method} ${req.originalUrl} took ${duration}ms`);
    }
  });

  next();
};

export default requestLogger;
