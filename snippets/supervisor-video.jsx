export const SupervisorVideo = ({ src, width, height, label, fallback }) => (
  <div className="comet-home__supervisor-media">
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
  </div>
);
