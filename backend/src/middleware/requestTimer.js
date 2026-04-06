function requestTimer(req, res, next) {
  const startedAt = process.hrtime.bigint();

  res.on('finish', () => {
    const elapsedMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;
    const line = `${req.method} ${req.originalUrl} ${res.statusCode} ${elapsedMs.toFixed(1)}ms`;

    if (elapsedMs > 50000) {
      console.warn(`[perf] ${line} — near 60s timeout`);
    } else if (elapsedMs > 30000) {
      console.warn(`[perf] ${line} — slow request`);
    }
  });

  next();
}

module.exports = requestTimer;
