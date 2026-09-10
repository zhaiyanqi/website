import { notes } from './notes.mjs';

export const origin = 'https://gitzhai.site';
const name = '奇变偶不变';
const description = '奇变偶不变，一个记录编程、工具与日常思考的个人技术小站。保持好奇，把问题想清楚，把事情做简单。';
const arrow = '<span aria-hidden="true">↗</span>';
const escape = (text) => text.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const length = (note) => Math.ceil(note.body.replace(/<[^>]+>/g, '').replace(/\s/g, '').length / 350);

function layout({ title = name, summary = description, path = '/', content, noindex = false }) {
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escape(title)}</title>
  <meta name="description" content="${escape(summary)}">
  <meta name="theme-color" content="#164c3e">
  ${noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${origin}${path}">`}
  <meta property="og:type" content="${path.startsWith('/notes/') ? 'article' : 'website'}">
  <meta property="og:locale" content="zh_CN">
  <meta property="og:site_name" content="${name}">
  <meta property="og:title" content="${escape(title)}">
  <meta property="og:description" content="${escape(summary)}">
  <meta property="og:url" content="${origin}${path}">
  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="/assets/styles.css">
</head>
<body>
  <a class="skip-link" href="#main">跳到正文</a>
  <div class="site-shell">
    <header class="site-header">
      <a class="brand" href="/" aria-label="奇变偶不变，首页"><span class="brand-mark" aria-hidden="true">∿</span><span>${name}</span></a>
      <nav aria-label="主导航">
        <a href="/#notes" ${path.startsWith('/notes/') ? 'aria-current="location"' : ''}>随笔</a>
        <a href="/#about">关于</a>
      </nav>
    </header>
    <main id="main">${content}</main>
    <footer class="site-footer">
      <div><a class="footer-name" href="/">${name}</a><span>保持好奇，慢慢生长。</span></div>
      <div class="footer-legal"><span>© ${new Date().getFullYear()} ${name}</span><a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer" aria-label="蜀ICP备2021018925号-1（工信部备案查询，新窗口打开）">蜀ICP备2021018925号-1 ${arrow}</a></div>
    </footer>
  </div>
</body>
</html>
`;
}

function wave() {
  const points = Array.from({ length: 161 }, (_, i) => `${40 + i * 2.75},${(160 - 94 * Math.sin(i / 160 * Math.PI * 2)).toFixed(2)}`).join(' ');
  return `<figure class="wave-figure">
    <div class="figure-top"><span>一点变化，一点规律</span><span aria-hidden="true">FIG. 01</span></div>
    <svg viewBox="0 0 520 320" role="img" aria-labelledby="wave-title wave-desc">
      <title id="wave-title">正弦曲线</title><desc id="wave-desc">从零开始，经过波峰和波谷，再回到零。一段正弦曲线展示变化中的周期规律。</desc>
      <defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" stroke-opacity=".09" stroke-width="1"/></pattern></defs>
      <rect width="520" height="320" fill="url(#grid)"/>
      <g fill="none" stroke="currentColor" stroke-opacity=".3"><path d="M25 160H496M40 28V290"/><path d="m490 156 6 4-6 4"/><path d="M36 34l4-6 4 6"/></g>
      <polyline points="${points}" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="150" cy="66" r="6" fill="#c3ee8e" stroke="currentColor" stroke-width="2"/>
      <circle cx="370" cy="254" r="5" fill="#164c3e"/>
      <g fill="currentColor" font-size="14" font-family="Georgia, serif"><text x="24" y="181">0</text><text x="254" y="183">π</text><text x="469" y="183">2π</text><text x="171" y="57">y = sin x</text></g>
    </svg>
    <figcaption><span>奇变偶不变</span><span>符号看象限。</span></figcaption>
  </figure>`;
}

export function pages() {
  const home = layout({ content: `
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero-copy">
        <p class="eyebrow"><span class="tiny-dot" aria-hidden="true"></span>个人技术主页 / 随笔</p>
        <h1 id="hero-title">在变化里，<br>寻找<span class="accent-word">不变。</span></h1>
        <p class="hero-description">写代码，也写下思考。<br>这里记录技术里的小发现，和生活中的好奇心。</p>
        <a class="primary-link" href="#notes">翻开随笔 <span aria-hidden="true">↘</span></a>
      </div>
      ${wave()}
    </section>
    <section class="notes-section" id="notes" aria-labelledby="notes-title">
      <div class="section-heading"><div><p class="eyebrow">NOTES & IDEAS</p><h2 id="notes-title">最近的文字<span class="count"> / ${String(notes.length).padStart(2, '0')}</span></h2></div><span class="section-aside">把零散的想法，认真记下来。</span></div>
      <div class="note-list">${notes.map((note, i) => `<a class="note-row" href="/notes/${note.slug}/"><span class="note-number">${String(i + 1).padStart(2, '0')}</span><div class="note-body"><span class="category">${note.category}</span><h3>${note.title}</h3><p>${note.summary}</p></div><div class="note-end"><span>${length(note)} 分钟阅读</span><span class="note-arrow" aria-hidden="true">↗</span></div></a>`).join('')}</div>
    </section>
    <section class="about-section" id="about" aria-labelledby="about-title">
      <div><p class="eyebrow">ABOUT THIS SPACE</p><h2 id="about-title">一个小站，<br>一些持续的好奇。</h2></div>
      <div class="about-copy"><p>“奇变偶不变”是一处关于编程、工具和日常思考的个人记录。把遇到的问题拆开，把学到的东西写清楚，也给尚未想明白的事留一点空间。</p><p>技术在变，工具在变。想弄懂一件事的好奇心，希望一直都在。</p></div>
    </section>` });
  const output = new Map([['index.html', home]]);
  notes.forEach((note, i) => {
    const next = notes[(i + 1) % notes.length];
    const content = `<article class="article"><a class="back-link" href="/#notes">← 全部随笔</a><header class="article-header"><p class="eyebrow">${note.category}<span class="meta-separator">/</span>${length(note)} 分钟阅读</p><h1>${note.title}</h1><p>${note.summary}</p></header><div class="prose">${note.body}</div><aside class="next-note" aria-label="继续阅读"><span class="eyebrow">下一篇随笔</span><a href="/notes/${next.slug}/">${next.title} ${arrow}</a></aside></article>`;
    output.set(`notes/${note.slug}/index.html`, layout({ title: `${note.title} · ${name}`, summary: note.summary, path: `/notes/${note.slug}/`, content }));
  });
  output.set('404.html', layout({ title: `页面未找到 · ${name}`, path: '/404.html', noindex: true, content: `<section class="not-found"><p class="eyebrow">404 / PAGE NOT FOUND</p><h1>这一页，<br>走出了象限。</h1><p>地址可能有误，或页面已经移动。回到首页，继续读点什么吧。</p><a class="primary-link" href="/">返回首页 <span aria-hidden="true">↗</span></a></section>` }));
  return output;
}
