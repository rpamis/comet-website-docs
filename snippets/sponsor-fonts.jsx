export const SponsorFonts = () => {
  useEffect(() => {
    if (document.querySelector("link[data-comet-sponsor-fonts]")) return;

    const stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.href =
      "https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&family=Noto+Serif+SC:wght@400;500;600;700&display=swap";
    stylesheet.dataset.cometSponsorFonts = "";
    document.head.append(stylesheet);
  }, []);

  return null;
};
