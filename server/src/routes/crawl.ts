import { Router, Request, Response } from 'express';
import puppeteer from 'puppeteer';
import { URL } from 'url';

const crawlRouter = Router();

crawlRouter.post('/', async (req: Request, res: Response): Promise<void> => {
  const { url } = req.body;
  const injectedScript = `<script src="https://yourdomain.com/tracker.js" defer></script>`;

  if (!url || !url.startsWith('http')) {
    res.status(400).json({ error: 'Invalid URL' });
    return;
  }

  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    const baseUrl = new URL(url).origin;

    const links = await page.$$eval('a', anchors =>
      anchors.map(a => a.href).filter(Boolean)
    );

    const internal = [...new Set(
        links
          .filter(link => link.startsWith(baseUrl))
          .map(link => {
            try {
              const u = new URL(link);
              return u.href;
            } catch {
              return null;
            }
          })
          .filter((link): link is string => link !== null) // ✅ type guard
      )];
      

    const modifiedPages: { url: string; html: string }[] = [];

    for (const link of internal) {
      try {
        const subPage = await browser.newPage();
        await subPage.goto(link, { waitUntil: 'domcontentloaded' });

        let html = await subPage.content();

        // Inject tracker.js before </body>
        html = html.replace('</body>', `${injectedScript}</body>`);

        modifiedPages.push({ url: link, html });

        await subPage.close();
      } catch (err) {
        console.warn(`⚠️ Failed to load ${link}`);
      }
    }

    await browser.close();

    res.json({ count: modifiedPages.length, pages: modifiedPages });
  } catch (err) {
    console.error('💥 Crawl error:', err);
    res.status(500).json({ error: 'Failed to crawl site' });
  }
});

export default crawlRouter;
