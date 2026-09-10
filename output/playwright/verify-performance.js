async (page) => {
  const results = {errors: [], pages: []};
  page.on('pageerror', error => results.errors.push(error.message));
  await page.setViewportSize({width: 1280, height: 720});
  await page.goto('http://127.0.0.1:4322/');
  await page.waitForTimeout(1800);
  results.decorations = await page.evaluate(() => ({
    canvas: document.querySelectorAll('canvas').length,
    grid: [...document.querySelectorAll('.eg-spot')].map(el => ({animation: getComputedStyle(el).animationName, filter: getComputedStyle(el).filter, mask: getComputedStyle(el).maskImage})),
    textures: performance.getEntriesByType('resource').filter(r => /grain.png|banner-background.png/.test(r.name)).map(r => r.name)
  }));
  const cdp = await page.context().newCDPSession(page);
  const events = [];
  cdp.on('Tracing.dataCollected', chunk => events.push(...chunk.value));
  await cdp.send('Performance.enable');
  await cdp.send('Tracing.start', {categories: 'devtools.timeline,disabled-by-default-devtools.timeline', transferMode: 'ReportEvents'});
  const before = await cdp.send('Performance.getMetrics');
  await page.waitForTimeout(4000);
  const after = await cdp.send('Performance.getMetrics');
  const complete = new Promise(resolve => cdp.once('Tracing.tracingComplete', resolve));
  await cdp.send('Tracing.end');
  await complete;
  results.idle = {seconds: 4, paint: events.filter(e => e.name === 'Paint' && e.ph === 'X').length, raster: events.filter(e => e.name === 'RasterTask' && e.ph === 'X').length, taskMs: (after.metrics.find(m => m.name === 'TaskDuration').value - before.metrics.find(m => m.name === 'TaskDuration').value) * 1000};
  await cdp.detach();
  await page.screenshot({path: 'output/playwright/optimized-home-dark.png'});
  await page.getByRole('button', {name: 'List', exact: true}).click();
  results.list = await page.evaluate(() => localStorage.getItem('portfolio-layout'));
  await page.getByRole('button', {name: 'Systems', exact: true}).click();
  results.filter = await page.evaluate(() => localStorage.getItem('portfolio-filter'));
  await page.getByRole('button', {name: 'All Output', exact: true}).click();
  await page.getByRole('button', {name: 'Cards', exact: true}).click();
  await page.getByRole('button', {name: 'Toggle theme', exact: true}).click();
  await page.waitForTimeout(300);
  results.light = await page.evaluate(() => ({enabled: document.documentElement.classList.contains('light'), blend: getComputedStyle(document.querySelector('.eg-spot')).mixBlendMode}));
  await page.screenshot({path: 'output/playwright/optimized-home-light.png'});
  await page.getByRole('button', {name: 'Toggle theme', exact: true}).click();
  for (const route of ['/about', '/resume', '/archive', '/projects/around']) {
    const response = await page.goto('http://127.0.0.1:4322' + route);
    await page.waitForTimeout(500);
    results.pages.push({route, status: response.status(), heading: await page.locator('h1').allTextContents()});
    if (route === '/projects/around') await page.screenshot({path: 'output/playwright/optimized-project.png'});
  }
  await page.setViewportSize({width: 390, height: 844});
  await page.emulateMedia({reducedMotion: 'reduce'});
  await page.goto('http://127.0.0.1:4322/');
  await page.waitForTimeout(800);
  results.mobile = await page.evaluate(() => ({width: innerWidth, documentWidth: document.documentElement.scrollWidth, gridAnimations: [...document.querySelectorAll('.eg-spot')].map(el => getComputedStyle(el).animationName)}));
  await page.screenshot({path: 'output/playwright/optimized-mobile.png'});
  await page.getByRole('button', {name: 'Open navigation'}).click();
  results.mobileMenu = await page.getByRole('navigation', {name: 'Mobile navigation'}).isVisible();
  await page.getByRole('button', {name: 'Close navigation'}).click();
  return results;
}
