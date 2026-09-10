async (page) => {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Performance.enable');
  const inventory = await page.evaluate(() => ({
    url: location.href, viewport: [innerWidth, innerHeight, devicePixelRatio],
    spots: document.querySelectorAll('.eg-spot').length,
    canvas: document.querySelectorAll('canvas').length,
    animations: document.getAnimations().map(a => a.animationName),
    resources: performance.getEntriesByType('resource')
      .filter(r => r.initiatorType === 'script' || /grain|banner/.test(r.name))
      .map(r => ({url: r.name, bytes: r.encodedBodySize}))
  }));
  const results = {inventory, measurements: []};
  const styles = ['/* baseline */', '.eg-spot {animation-play-state:paused!important}',
    '*,*::before,*::after {backdrop-filter:none!important;-webkit-backdrop-filter:none!important}',
    '.eg-spot {animation-play-state:paused!important} *,*::before,*::after {backdrop-filter:none!important;-webkit-backdrop-filter:none!important}'];
  for (let i = 0; i < styles.length; i++) {
    const style = await page.addStyleTag({content: styles[i]});
    try {
      await page.waitForTimeout(800);
      const events = [];
      const collect = p => events.push(...p.value);
      cdp.on('Tracing.dataCollected', collect);
      await cdp.send('Tracing.start', {categories: 'devtools.timeline,disabled-by-default-devtools.timeline', transferMode: 'ReportEvents'});
      const before = await cdp.send('Performance.getMetrics');
      await page.waitForTimeout(4000);
      const after = await cdp.send('Performance.getMetrics');
      const end = new Promise(resolve => cdp.once('Tracing.tracingComplete', resolve));
      await cdp.send('Tracing.end');
      await end;
      cdp.off('Tracing.dataCollected', collect);
      const metrics = {};
      for (const key of ['TaskDuration', 'ScriptDuration', 'RecalcStyleDuration', 'LayoutDuration', 'RecalcStyleCount', 'LayoutCount']) {
        metrics[key] = after.metrics.find(m => m.name === key).value - before.metrics.find(m => m.name === key).value;
      }
      const trace = {};
      for (const name of ['Paint', 'RasterTask', 'UpdateLayoutTree', 'PrePaint']) {
        const es = events.filter(e => e.name === name && e.ph === 'X');
        trace[name] = {count: es.length, ms: es.reduce((s, e) => s + (e.dur || 0), 0) / 1000};
      }
      results.measurements.push({condition: ['baseline', 'paused_grid', 'no_backdrop', 'both'][i], seconds: 4, metrics, trace});
    } finally {
      await style.evaluate(el => el.remove());
    }
  }
  await cdp.detach();
  await page.evaluate(data => { window.__portfolioAudit = data; }, results);
  return results;
}
