export const DashboardWebsiteDemo = () => {
  const DESIGN_WIDTH = 1444;
  const DESIGN_HEIGHT = 901;
  const MOBILE_BREAKPOINT = 768;
  const MOBILE_MIN_SCALE = 0.44;
  const stageRef = useRef(null);
  const mountRef = useRef(null);
  const [viewport, setViewport] = useState({ scale: 1, isScrollable: false });
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;

    const updateScale = () => {
      const fitScale = Math.min(stage.clientWidth / DESIGN_WIDTH, 1);
      const nextScale =
        stage.clientWidth <= MOBILE_BREAKPOINT ? Math.max(fitScale, MOBILE_MIN_SCALE) : fitScale;
      const nextScrollable = nextScale - fitScale > 0.001;
      setViewport((current) =>
        Math.abs(current.scale - nextScale) < 0.001 && current.isScrollable === nextScrollable
          ? current
          : { scale: nextScale, isScrollable: nextScrollable },
      );
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const mountPoint = mountRef.current;
    if (!mountPoint) return undefined;

    let cancelled = false;
    let unmountDashboard;

    // 预览 bundle 约 5.9MB（gzip 后 1.7MB），与首屏渲染同时请求会抢占带宽。
    // 等浏览器空闲（至多 1.2s）再拉取，首屏文字与 CTA 先行渲染。
    const startLoading = (load) => {
      if (typeof window === 'undefined') {
        load();
        return;
      }
      if (typeof window.requestIdleCallback === 'function') {
        window.requestIdleCallback(load, { timeout: 1200 });
      } else {
        window.setTimeout(load, 300);
      }
    };

    // Mintlify 部署会丢弃 .js/.css 静态文件（.json/.png 正常），因此资产以 JSON 包装下发。
    // 站点 CSP 的 script-src / style-src 均不含 blob:，所以脚本以内联 <script> 执行，
    // 样式在 mount 后以内联 <style> 注入 shadow root；资产解析结果缓存在 globalThis 上，
    // SPA 内页切换时避免重复拉取。
    const loadDashboardAssets = () => {
      const cache = globalThis.__cometDashboardWebsiteDemoAssets;
      if (cache) return cache;

      const fetchPayload = (url) =>
        fetch(url).then((response) => {
          if (!response.ok)
            throw new Error(`Dashboard 预览静态资源加载失败（${response.status}）。`);
          return response.json();
        });

      globalThis.__cometDashboardWebsiteDemoAssets = Promise.all([
        fetchPayload(
          '/assets/dashboard-website-demo/dashboard-website-demo.js.json?v=0.4.2-website-01',
        ),
        fetchPayload(
          '/assets/dashboard-website-demo/dashboard-website-demo.css.json?v=0.4.2-website-01',
        ),
      ]).catch((error) => {
        delete globalThis.__cometDashboardWebsiteDemoAssets;
        throw error;
      });

      return globalThis.__cometDashboardWebsiteDemoAssets;
    };

    const runDashboardBundle = (jsSource) => {
      if (globalThis.CometDashboardWebsiteDemo) {
        return globalThis.CometDashboardWebsiteDemo;
      }

      // 内联 <script> 同步执行；此前已有标记却拿不到入口，说明上次执行已失败，不再重复注入。
      if (document.querySelector('script[data-comet-dashboard-website-demo]')) {
        throw new Error('Dashboard 预览脚本执行失败。');
      }

      const script = document.createElement('script');
      script.dataset.cometDashboardWebsiteDemo = 'true';
      script.textContent = jsSource;
      document.head.append(script);

      if (globalThis.CometDashboardWebsiteDemo) {
        return globalThis.CometDashboardWebsiteDemo;
      }
      throw new Error('Dashboard 预览脚本执行失败。');
    };

    // mount 会在 shadow root 里创建指向 blob: 的样式链接，站点 CSP 的 style-src 不允许 blob:；
    // mount 返回后同步把它替换为内联 <style>，首帧渲染前生效。
    const inlineDashboardStyles = (cssSource) => {
      const shadow = mountPoint.shadowRoot;
      if (!shadow) return;
      const style = document.createElement('style');
      style.textContent = cssSource;
      const link = shadow.querySelector('link[rel="stylesheet"]');
      if (link) {
        link.replaceWith(style);
      } else {
        shadow.append(style);
      }
    };

    startLoading(() => {
      loadDashboardAssets()
        .then(([jsPayload, cssPayload]) => {
          if (cancelled) return;
          const dashboard = runDashboardBundle(jsPayload.js);
          // mount 要求提供 stylesheetUrl；传入同源占位 URL（CSP 允许），真正的样式随后以内联 <style> 注入。
          unmountDashboard = dashboard.mount(mountPoint, { stylesheetUrl: window.location.href });
          inlineDashboardStyles(cssPayload.css);
        })
        .catch((error) => {
          if (!cancelled) setLoadError(error instanceof Error ? error.message : String(error));
        });
    });

    return () => {
      cancelled = true;
      unmountDashboard?.();
    };
  }, []);

  const { scale, isScrollable } = viewport;
  const scaledWidth = DESIGN_WIDTH * scale;
  const scaledHeight = DESIGN_HEIGHT * scale;
  const handleViewportKeyDown = (event) => {
    if (!isScrollable || event.target !== event.currentTarget) return;
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    event.currentTarget.scrollLeft += event.key === 'ArrowRight' ? 160 : -160;
  };

  return (
    <div
      ref={stageRef}
      className={`comet-dashboard-website-stage${isScrollable ? ' is-mobile-viewport' : ''}`}
      style={{ height: `${scaledHeight}px` }}
      tabIndex={isScrollable ? 0 : undefined}
      aria-label={isScrollable ? '可横向浏览 Comet Dashboard' : undefined}
      onKeyDown={handleViewportKeyDown}
    >
      <div
        className="comet-dashboard-website-scroll-content"
        style={{ width: `${scaledWidth}px`, height: `${scaledHeight}px` }}
      >
        <div className="comet-dashboard-website-canvas" style={{ transform: `scale(${scale})` }}>
          <div ref={mountRef} className="comet-dashboard-website-mount" />
        </div>
      </div>
      {loadError ? <p className="comet-dashboard-website-error">{loadError}</p> : null}
    </div>
  );
};
