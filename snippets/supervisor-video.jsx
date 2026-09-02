import { useEffect, useRef, useState } from 'react';

// 首页的两个演示视频合计超过 20MB，若随页面立即加载会拖慢首屏。
// 组件仅在滚动接近视口时才挂载真实 <video>，离屏状态下只保留等比占位。
export const SupervisorVideo = ({ src, width, height, label, fallback }) => {
  const containerRef = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || shouldLoad) return undefined;

    if (typeof IntersectionObserver === 'undefined') {
      setShouldLoad(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      // 提前 200px 开始加载，用户滚到时通常已可播放
      { rootMargin: '200px 0px' },
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, [shouldLoad]);

  return (
    <div ref={containerRef} className="comet-home__supervisor-media" style={{ aspectRatio: `${width} / ${height}` }}>
      {shouldLoad ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          controls
          preload="metadata"
          width={width}
          height={height}
          aria-label={label}
        >
          <source src={src} type="video/mp4" />
          {fallback}
        </video>
      ) : (
        <div
          className="comet-home__supervisor-media-placeholder"
          role="img"
          aria-label={label}
        />
      )}
    </div>
  );
};
