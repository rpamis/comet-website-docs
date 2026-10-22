export const SponsorBrands = ({ sponsors = [], tier = 'standard', lang = 'zh' }) => {
  // Kept inside the component: the snippet is compiled per-page and non-exported
  // top-level declarations can be dropped from the evaluated chunk.
  const strings = {
    zh: {
      emptyStandard: '成为首位标准赞助商',
      marqueeLabel: '标准赞助商，悬停或聚焦可暂停滚动',
    },
    en: {
      emptyStandard: 'Become the first standard sponsor',
      marqueeLabel: 'Standard sponsors — hover or focus to pause scrolling',
    },
  };
  const t = strings[lang] || strings.zh;
  const Brand = ({ sponsor, duplicate = false }) => {
    const linked = tier !== 'standard' && Boolean(sponsor.url);
    const Element = linked ? 'a' : 'div';
    if (tier === 'friend') {
      return <Element className="comet-sponsor__friend-brand" href={linked ? sponsor.url : undefined} rel={linked ? 'sponsored' : undefined}>{sponsor.name}</Element>;
    }
    return (
      <Element className={`comet-sponsor__brand comet-sponsor__brand--${tier}${tier === 'chief' && sponsor.description ? ' comet-sponsor__brand--with-description' : ''}`} href={linked ? sponsor.url : undefined} rel={linked ? 'sponsored' : undefined} aria-hidden={duplicate ? 'true' : undefined}>
        <div className={`comet-sponsor__brand-image${sponsor.dark ? ' comet-sponsor__brand-image--dark' : ''}`}>
          <img src={sponsor.logo} alt={duplicate ? '' : `${sponsor.name} Logo`} width="200" height="80" loading="lazy" />
        </div>
        {tier === 'chief' && sponsor.description && (
          <div className="comet-sponsor__brand-copy">
            <p>{sponsor.description}</p>
          </div>
        )}
      </Element>
    );
  };

  if (tier !== 'standard') {
    return <>{sponsors.map(sponsor => <Brand key={sponsor.id} sponsor={sponsor} />)}</>;
  }
  if (!sponsors.length) {
    return <a href="#contact" className="comet-sponsor__empty">{t.emptyStandard} <span aria-hidden="true">↗</span></a>;
  }
  // Fill a wide viewport even after reducing the roster to one sponsor.
  const marqueeSponsors = Array.from({ length: Math.ceil(5 / sponsors.length) }, () => sponsors).flat();

  return (
    <div className="comet-sponsor__row-body comet-sponsor__row-body--standard" role="region" aria-label={t.marqueeLabel} tabIndex={0}>
      <div className="comet-sponsor__track">
        {[false, true].map((duplicate) => (
          <div className="comet-sponsor__group" key={String(duplicate)} aria-hidden={duplicate ? 'true' : undefined}>
            {marqueeSponsors.map((sponsor, index) => (
              <Brand key={`${sponsor.id}-${index}`} sponsor={sponsor} duplicate={duplicate || index >= sponsors.length} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
