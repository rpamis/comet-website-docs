export const FooterWordmark = () => {
  const artRef = useRef(null);

  useEffect(() => {
    const art = artRef.current;
    const canvas = art?.querySelector('canvas');
    const text = art?.querySelector('span');
    const context = canvas?.getContext('2d');
    if (!art || !text || !context) return;

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointer = { x: -1000, y: -1000, strength: 0, target: 0 };
    let points = [];
    let width = 0;
    let height = 0;
    let frame = 0;
    let progress = 0;
    let visible = false;
    let disposed = false;

    const schedule = () => {
      if (!frame && !disposed && !motion.matches && visible) {
        frame = window.requestAnimationFrame(paint);
      }
    };

    const paint = () => {
      frame = 0;
      if (disposed || motion.matches || !visible) return;
      const top = art.getBoundingClientRect().top;
      const target = Math.min(1, Math.max(0, (innerHeight - top) / (height * 0.85)));
      progress += (target - progress) * 0.14;
      pointer.strength += (pointer.target - pointer.strength) * 0.12;
      context.clearRect(0, 0, width, height);
      context.fillStyle = getComputedStyle(art).getPropertyValue('--blue').trim();

      for (const point of points) {
        const reveal = Math.min(1, Math.max(0, progress * 1.5 - point.order * 0.5));
        const ease = 1 - Math.pow(1 - reveal, 3);
        let x = point.x + point.drift * (1 - ease);
        let y = point.y + (1 - ease) * (32 + point.order * 48);
        const dx = x - pointer.x;
        const dy = y - pointer.y;
        const distance = Math.hypot(dx, dy);
        if (distance > 0 && distance < 100) {
          const force = Math.pow(1 - distance / 100, 2) * 24 * pointer.strength;
          x += dx / distance * force;
          y += dy / distance * force;
        }
        context.globalAlpha = point.alpha * ease * 0.25;
        context.fillRect(x, y, point.size, point.size);
      }

      art.dataset.footerProgress = progress.toFixed(3);
      if (Math.abs(target - progress) > 0.001 || Math.abs(pointer.target - pointer.strength) > 0.001) schedule();
    };

    const rebuild = () => {
      if (disposed) return;
      art.removeAttribute('data-particles-ready');
      if (motion.matches) {
        window.cancelAnimationFrame(frame);
        frame = 0;
        return;
      }
      const bounds = art.getBoundingClientRect();
      width = Math.round(bounds.width);
      height = Math.round(bounds.height);
      if (!width || !height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Sample the actual homepage font. No image or substitute font is used.
      const mask = document.createElement('canvas');
      mask.width = width;
      mask.height = height;
      const sample = mask.getContext('2d', { willReadFrequently: true });
      if (!sample) return;
      const typography = getComputedStyle(text);
      sample.font = `${typography.fontWeight} ${typography.fontSize} ${typography.fontFamily}`;
      sample.letterSpacing = typography.letterSpacing;
      sample.textAlign = 'center';
      sample.textBaseline = 'alphabetic';
      const metrics = sample.measureText('Comet');
      const baseline = (height + metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) / 2;
      sample.fillText('Comet', width / 2, baseline);
      const pixels = sample.getImageData(0, 0, width, height).data;
      const next = [];
      const step = width < 500 ? 3 : 4;
      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          if (pixels[(y * width + x) * 4 + 3] < 90) continue;
          const order = ((x * 17 + y * 31) % 101) / 100;
          const depth = y / height;
          next.push({
            x, y, order,
            drift: (order - 0.5) * 100,
            alpha: Math.min(1, Math.max(0, (1 - depth) * 2.2)),
            size: depth < 0.48 ? step : Math.max(1, step * (1.4 - depth)),
          });
        }
      }
      points = next;
      if (!points.length) return;
      art.dataset.particlesReady = 'true';
      art.dataset.footerParticles = String(points.length);
      schedule();
    };

    const onPointer = event => {
      if (event.pointerType === 'touch') return;
      const bounds = art.getBoundingClientRect();
      pointer.x = event.clientX - bounds.left;
      pointer.y = event.clientY - bounds.top;
      pointer.target = 1;
      schedule();
    };
    const onLeave = () => { pointer.target = 0; schedule(); };
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) schedule();
      else { window.cancelAnimationFrame(frame); frame = 0; }
    });
    const resize = new ResizeObserver(rebuild);
    const theme = new MutationObserver(schedule);
    intersection.observe(art);
    resize.observe(art);
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    window.addEventListener('scroll', schedule, { passive: true });
    art.addEventListener('pointermove', onPointer);
    art.addEventListener('pointerleave', onLeave);
    motion.addEventListener('change', rebuild);
    document.fonts?.addEventListener('loadingdone', rebuild);
    rebuild();
    return () => {
      disposed = true;
      window.cancelAnimationFrame(frame);
      intersection.disconnect();
      resize.disconnect();
      theme.disconnect();
      window.removeEventListener('scroll', schedule);
      art.removeEventListener('pointermove', onPointer);
      art.removeEventListener('pointerleave', onLeave);
      motion.removeEventListener('change', rebuild);
      document.fonts?.removeEventListener('loadingdone', rebuild);
    };
  }, []);

  return (
    <div className="comet-home__footer-wordmark" aria-hidden="true" translate="no">
      <div className="comet-home__footer-wordmark-art" ref={artRef}>
        <span className="comet-home__footer-wordmark-text">Comet</span>
        <canvas className="comet-home__footer-wordmark-canvas" />
      </div>
    </div>
  );
};
