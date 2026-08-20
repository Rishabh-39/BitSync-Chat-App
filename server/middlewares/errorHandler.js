// Global error handling middleware for Express
// This catches all errors thrown in route handlers and middleware

const errorHandler = (err, req, res, next) => {
  // Log the full error details to the terminal
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const statusCode = err.statusCode || 500;

  console.error("\n" + "=".repeat(60));
  console.error(`❌ ERROR at ${timestamp}`);
  console.error(`   ${method} ${url}`);
  console.error(`   Status: ${statusCode}`);
  console.error(`   Message: ${err.message}`);

  // Log request details
  if (req.userId) {
    console.error(`   User ID: ${req.userId}`);
  }
  if (req.body && Object.keys(req.body).length > 0) {
    // Sanitize sensitive fields
    const sanitized = { ...req.body };
    ["password", "confirmPassword", "token"].forEach((key) => {
      if (sanitized[key]) sanitized[key] = "***";
    });
    console.error(`   Body: ${JSON.stringify(sanitized)}`);
  }

  // Log the full stack trace
  if (err.stack) {
    console.error(`   Stack:\n${err.stack}`);
  }

  // Prisma-specific error handling
  if (err.code) {
    console.error(`   Error Code: ${err.code}`);
    if (err.meta) {
      console.error(`   Meta: ${JSON.stringify(err.meta)}`);
    }
  }

  console.error("=".repeat(60) + "\n");

  // Send error response to client
  res.status(statusCode).json({
    message:
      process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : err.message || "Internal Server Error",
    ...(process.env.NODE_ENV !== "production" && { error: err.message }),
  });
};

export default errorHandler;
