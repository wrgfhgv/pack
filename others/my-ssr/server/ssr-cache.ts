const Redis = require('ioRedis');
const redis = new Redis({
  host: 'localhost',
  port: 6379,
});

async function ssrCacheMiddleware(
  req: any,
  res: any,
  next: any,
  render: any,
  ttl = 300,
) {
  const key = `ssr:${req.originalUrl}`;

  try {
    const cachedHtml = await redis.get(key);
    if (cachedHtml) {
      res.end(cachedHtml);
      return;
    }
    const html = await render(req, res);
    if (html) {
      await redis.set(key, html, 'EX', ttl);
      res.end(html);
      return;
    }
    next();
  } catch (e) {
    try {
    } catch (e) {
      console.error(e);
    }
  }
}
