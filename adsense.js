// Mintlify loads this file on every page. AdSense's script tag has to be
// created at runtime: raw <script src> tags in MDX are not supported.
(() => {
  if (document.querySelector("script[data-comet-adsense]")) return;

  const script = document.createElement("script");
  script.src =
    "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2429794804566519";
  script.async = true;
  script.crossOrigin = "anonymous";
  script.dataset.cometAdsense = "";
  document.head.append(script);
})();
