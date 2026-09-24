async (page) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('http://localhost:4322/');
  await page.waitForTimeout(1500);
  const cdp = await page.context().newCDPSession(page);
  const results = {};
  try {
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    results.active = await page.evaluate(async () => {
      const el = document.querySelector('.eg-spot--primary');
      const start = getComputedStyle(el, '::before').transform;
      await new Promise(resolve => setTimeout(resolve, 600));
      return { start, end: getComputedStyle(el, '::before').transform,
        focus: getComputedStyle(el, '::before').animationName,
        glass: getComputedStyle(document.querySelector('nav')).backdropFilter };
    });
    results.scroll = await page.evaluate(async () => {
      const intervals = [];
      let last = performance.now();
      for (let i = 0; i < 120; i++) {
        const now = await new Promise(requestAnimationFrame);
        intervals.push(now - last);
        last = now;
        window.scrollBy(0, i < 60 ? 12 : -12);
      }
      intervals.sort((a, b) => a - b);
      return { frames: intervals.length, p95FrameMs: intervals[114], over50ms: intervals.filter(x => x > 50).length };
    });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    results.reduced = await page.evaluate(() => ({
      lights: [...document.querySelectorAll('.eg-spot')].map(el => getComputedStyle(el, '::before').animationName)
    }));
    await page.addStyleTag({ content: 'nav {backdrop-filter:none!important;-webkit-backdrop-filter:none!important}' });
    results.fallback = await page.locator('nav').first().isVisible();
  } finally {
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
    await cdp.detach();
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.reload();
  }
  return results;
}
