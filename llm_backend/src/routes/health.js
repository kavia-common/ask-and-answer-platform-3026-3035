import express from 'express';

// PUBLIC_INTERFACE
export function healthRouter(appMeta) {
  /**
   * Health check router.
   *
   * GET /health
   * Returns service status and basic metadata.
   *
   * Response:
   * { ok: boolean, status: "healthy", service: { name, version, description }, time: ISOString }
   */
  const router = express.Router();

  router.get('/', (_req, res) => {
    try {
      return res.status(200).json({
        ok: true,
        status: 'healthy',
        service: appMeta || {},
        time: new Date().toISOString(),
      });
    } catch (err) {
      return res.status(500).json({
        ok: false,
        status: 'unhealthy',
        error: err?.message || 'Unknown error',
      });
    }
  });

  return router;
}
