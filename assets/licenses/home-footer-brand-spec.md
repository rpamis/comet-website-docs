# Homepage footer

Both homepage footers use the existing Comet fonts, colors, logo, links, and community images.

- Brand mark: `/logo/favicon.png`, with a 5px optical inset correction for the transparent left edge at 32px size.
- Fonts: existing `--sans` for navigation and copy; existing `--serif` for the Comet brand lockup.
- Colors: white `--bg` in light mode; existing `--ink`, `--muted`, `--line`, and `--blue`. Dark mode inherits the same tokens.
- Layout: 78rem content width and 32px inner gutters. Mobile stacks the brand above three compact navigation groups.
- Primary action: “进入文档” / “Read the docs” links directly to the localized overview, using the header GitHub button's hover highlight.
- Community images: existing `/img/community-wechat.png`, `/img/community-douyin.png`, `/img/community-qq.jpg`, `/img/sponsor.jpeg`.

The closing wordmark uses the existing homepage heading font (Newsreader / Noto Serif SC / Source Serif 4). Canvas samples that computed font to create the particle lettering. The static fallback uses the same font and a dot fade.

The lettering assembles with scroll progress and gently repels the pointer. Reduced motion and unavailable Canvas retain the static wordmark. Rendering pauses outside the viewport and at rest. No external motion dependencies or usage counters are added.

The wordmark follows the language/copyright row. The layout and particle lettering reference is https://multica.ai/zh.

The Chinese and English homepages share the layout, optical alignment, animations, and responsive styles. Navigation, taglines, accessibility labels, and language controls are localized. The English language switch uses `/` for Chinese, following the existing redirect in `docs.json`.
