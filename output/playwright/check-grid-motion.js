async (page) => {
  await page.setViewportSize({width: 1280, height: 720});
  await page.emulateMedia({reducedMotion: 'no-preference'});
  await page.goto('http://localhost:4322/');
  await page.waitForTimeout(2000);
  const sample = () => page.evaluate(() => [...document.querySelectorAll('.eg-spot')].map(el => ({
    transform: getComputedStyle(el, '::before').transform,
    gridTransform: getComputedStyle(el).transform,
    mask: getComputedStyle(el).maskImage,
    gradient: getComputedStyle(el, '::before').backgroundImage,
    opacity: getComputedStyle(el, '::before').opacity,
    animation: getComputedStyle(el, '::before').animationName
  })));
  const cdp = await page.context().newCDPSession(page);
  const events = [];
  cdp.on('Tracing.dataCollected', chunk => events.push(...chunk.value));
  await cdp.send('Tracing.start', {categories: 'devtools.timeline,disabled-by-default-devtools.timeline', transferMode: 'ReportEvents'});
  const start = await sample();
  await page.waitForTimeout(4000);
  const end = await sample();
  const complete = new Promise(resolve => cdp.once('Tracing.tracingComplete', resolve));
  await cdp.send('Tracing.end');
  await complete;
  await cdp.detach();
  if (start.some((s, i) => s.transform === end[i].transform)) throw new Error('Spotlight did not move');
  if (end.some(s => s.gridTransform !== 'none')) throw new Error('The grid must remain stationary');
  if (new Set(end.map(s => s.animation)).size !== 3) throw new Error('Expected three independent paths');
  if (start.some((s, i) => s.opacity !== '1' || end[i].opacity !== '1')) throw new Error('Unexpected fading');
  if (start.some((s, i) => s.gradient !== end[i].gradient)) throw new Error('Light gradient changed');
  if (start.some((s, i) => s.mask !== end[i].mask)) throw new Error('Mask gradient changed');
  const results = {start, end, paint: events.filter(e => e.name === 'Paint' && e.ph === 'X').length,
    raster: events.filter(e => e.name === 'RasterTask' && e.ph === 'X').length};
  await page.emulateMedia({reducedMotion: 'reduce'});
  results.reduced = await sample();
  if (results.reduced.some(s => s.animation !== 'none')) throw new Error('Reduced motion failed');
  await page.setViewportSize({width: 390, height: 844});
  results.mobile = await page.evaluate(() => ({width: innerWidth, documentWidth: document.documentElement.scrollWidth}));
  await page.emulateMedia({reducedMotion: 'no-preference'});
  await page.setViewportSize({width: 1280, height: 720});
  const hidden = await page.addStyleTag({content: 'body > :not(.bg-energy-grid) {visibility:hidden!important}'});
  try {
    await page.screenshot({path: 'output/playwright/spotlights-a.png'});
    await page.waitForTimeout(5000);
    await page.screenshot({path: 'output/playwright/spotlights-b.png'});
  } finally {
    await hidden.evaluate(el => el.remove());
  }
  return results;
}
