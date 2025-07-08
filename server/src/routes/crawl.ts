import { Router, Request, Response } from 'express';
import puppeteer from 'puppeteer';
import { URL } from 'url';
import { prisma } from '../prisma';

const crawlRouter = Router();

crawlRouter.post('/', async (req: Request, res: Response): Promise<void> => {
  const { url } = req.body;
  const injectedScript = `<script src="https://yourdomain.com/tracker.js" defer></script>`;

  if (!url || !url.startsWith('http')) {
    res.status(400).json({ error: 'Invalid URL' });
    return;
  }

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 20000 });
    const baseUrl = new URL(url).origin;

    const links = await page.$$eval('a', anchors =>
      anchors.map(a => a.href).filter(Boolean)
    );

    const internal = [...new Set(
      links
        .filter(link => link.startsWith(baseUrl))
        .map(link => {
          try {
            return new URL(link).href;
          } catch {
            return null;
          }
        })
        .filter((link): link is string => !!link)
    )];

    const limitedLinks = internal.slice(0, 2); // ✅ Limit to 2 internal pages

    const modifiedPages: {
      url: string;
      html: string;
      elements: {
        tag: string;
        domId: string;
        classes: string;
        text: string;
        outerHTML: string;
        pagePath: string;
      }[];
    }[] = [];

    for (const link of limitedLinks) {
      try {
        const subPage = await browser.newPage();
        await subPage.goto(link, { waitUntil: 'networkidle0', timeout: 20000 });

        const elements = await subPage.$$eval(
          'button, a, input, select, textarea, img, [data-track], [id]',
          (els) =>
            els.map((el) => {
              const htmlEl = el as HTMLElement;
              return {
                tag: el.tagName.toLowerCase(),
                domId: el.id || '',
                classes: (el.className || '').toString(),
                text: htmlEl.innerText || htmlEl.getAttribute('value') || '',
                outerHTML: htmlEl.outerHTML,
                pagePath: window.location.pathname,
              };
            })
        );

        for (const el of elements) {
          await prisma.pageElement.create({ data: el });
        }

        let html = await subPage.content();
        html = html.replace('</body>', `${injectedScript}</body>`);

        modifiedPages.push({ url: link, html, elements });

        await subPage.close();
      } catch (err) {
        console.warn(`⚠️ Failed to load ${link}:`, (err as Error).message);
      }
    }

    await browser.close();

    res.json({
      success: true,
      count: modifiedPages.length,
      pages: modifiedPages,
    });
  } catch (err) {
    console.error('💥 Crawl error:', err);
    res.status(500).json({ error: 'Failed to crawl site' });
  }
});

export default crawlRouter;
