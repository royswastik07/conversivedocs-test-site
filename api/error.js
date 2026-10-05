export default function handler(req, res) {
  res.status(503).json({
    error: 'Service Unavailable',
    message: 'Simulated 503 error for URL Update failure-handling tests.',
    retryAfter: 60,
  });
}
