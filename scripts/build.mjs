/**
 * Builds the static pages committed to GitHub Pages.
 * Edit src/projects.json to add projects, set featured for homepage selections,
 * or add showcase { title, description, url? } for Portfolio Labs.
 * An omitted showcase URL displays the in-progress state without a fake link.
 * Run npm run build before publishing; npm run dev serves the committed output.
 * Only public product summaries and approved public links belong in this data.
 * Optional coverWords describe real product capabilities on the editorial cover.
 * The cutout portrait is derived from the existing public GitHub avatar.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve, dirname } from "node:path";
import { createHash } from "node:crypto";

const root = fileURLToPath(new URL("../", import.meta.url));
const projects = JSON.parse(
  await readFile(resolve(root, "src/projects.json"), "utf8"),
);
const certificates = JSON.parse(
  await readFile(resolve(root, "src/certificates.json"), "utf8"),
);
const assetVersion = async (path) =>
  createHash("sha256")
    .update(await readFile(resolve(root, path)))
    .digest("hex")
    .slice(0, 12);
const styleVersion = await assetVersion("src/Style_po.css");
const scriptVersion = await assetVersion("src/po.js");
const cvVersion = await assetVersion("asset/RakaAmar_CV.pdf");
const cvHref = `/asset/RakaAmar_CV.pdf?v=${cvVersion}`;
const versionedCertificates = await Promise.all(
  certificates.map(async (cert) => ({
    ...cert,
    href: `/${cert.file}?v=${await assetVersion(cert.file)}`,
  })),
);
const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        character
      ],
  );
const iconPaths = {
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  external:
    '<path d="M14 4h6v6M20 4l-9 9M10 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-5"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
  pin: '<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  code: '<path d="m7 6-5 6 5 6m10-12 5 6-5 6m-3-15-4 18"/>',
  lock: '<rect x="5" y="10" width="14" height="11" rx="1"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  search: '<circle cx="10.5" cy="10.5" r="7"/><path d="m16 16 5 5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  check: '<circle cx="12" cy="12" r="9"/><path d="m7 12 3 3 7-7"/>',
  copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  download: '<path d="M12 4v11m0 0-4-4m4 4 4-4M4 19h16"/>',
  github:
    '<path d="M9 19c-4 1-4-2-6-2m12 5v-4c0-1 .1-2-1-3 4-.4 7-2 7-6a5 5 0 0 0-1-3c.2-1 .3-2-.2-3-2 0-3 1-4 2a13 13 0 0 0-7 0C8 4 7 3 5 3c-.5 1-.4 2-.2 3a5 5 0 0 0-1 3c0 4 3 5.6 7 6-1 1-1 2-1 3v4"/>',
};
const icon = (name, extraClass = "") =>
  `<svg class="icon ${extraClass}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${iconPaths[name]}</svg>`;
const external = 'target="_blank" rel="noopener noreferrer"';
const artContent = {
  class: "Ekosistem pembelajaran",
  anabul: "Donasi & komunitas",
  siasat: "Pesta penyusup",
  text: "Eksperimen web",
  docs: "Aplikasi desktop",
  portfolio: "Portfolio pribadi",
};
const artSvg = {
  class: `<svg class="comic-art-svg" viewBox="0 0 160 110" aria-hidden="true" focusable="false">
    <rect x="14" y="14" width="112" height="78" rx="4" fill="#1e1e1e"/>
    <rect x="10" y="10" width="112" height="78" rx="4" fill="#ffffff" stroke="#1e1e1e" stroke-width="2.4"/>
    <path d="M10 26h112" stroke="#1e1e1e" stroke-width="2.4"/>
    <circle cx="20" cy="18" r="2.5" fill="#f397b5" stroke="#1e1e1e" stroke-width="1.5"/>
    <circle cx="30" cy="18" r="2.5" fill="#fadd42" stroke="#1e1e1e" stroke-width="1.5"/>
    <rect x="44" y="15" width="42" height="6" rx="2" fill="#a4dde5" stroke="#1e1e1e" stroke-width="1.5"/>
    <rect x="18" y="34" width="52" height="44" rx="2" fill="#a4dde5" stroke="#1e1e1e" stroke-width="2"/>
    <path d="M44 34v44M18 56h52" stroke="#1e1e1e" stroke-width="1.8"/>
    <rect x="22" y="38" width="18" height="14" fill="#fff"/>
    <rect x="48" y="38" width="18" height="14" fill="#fadd42"/>
    <rect x="22" y="60" width="18" height="14" fill="#f397b5"/>
    <rect x="48" y="60" width="18" height="14" fill="#fff"/>
    <rect x="78" y="34" width="36" height="13" rx="2" fill="#fadd42" stroke="#1e1e1e" stroke-width="2"/>
    <circle cx="85" cy="40.5" r="2.5" fill="#1e1e1e"/>
    <path d="M92 40.5h15" stroke="#1e1e1e" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M88 56h20v12c0 8-10 13-10 13s-10-5-10-13Z" fill="#145dc7" stroke="#1e1e1e" stroke-width="2" stroke-linejoin="round"/>
    <path d="m94 65 3 3 6-6" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="118" y="42" width="32" height="58" rx="4" fill="#1e1e1e"/>
    <rect x="114" y="38" width="32" height="58" rx="4" fill="#fadd42" stroke="#1e1e1e" stroke-width="2.4"/>
    <rect x="120" y="47" width="20" height="30" fill="#fff" stroke="#1e1e1e" stroke-width="1.8"/>
    <path d="M124 55h12M124 62h8M124 69h10" stroke="#1e1e1e" stroke-width="2" stroke-linecap="round"/>
    <circle cx="130" cy="87" r="2.8" fill="#1e1e1e"/>
  </svg>`,
  anabul: `<svg class="comic-art-svg" viewBox="0 0 160 110" aria-hidden="true" focusable="false">
    <rect x="22" y="16" width="118" height="80" rx="5" fill="#1e1e1e"/>
    <rect x="17" y="11" width="118" height="80" rx="5" fill="#ffffff" stroke="#1e1e1e" stroke-width="2.4"/>
    <circle cx="52" cy="49" r="19" fill="#a4dde5" stroke="#1e1e1e" stroke-width="2.2"/>
    <ellipse cx="52" cy="54" rx="8" ry="6.5" fill="#1e1e1e"/>
    <circle cx="43" cy="43" r="3" fill="#1e1e1e"/>
    <circle cx="52" cy="40" r="3" fill="#1e1e1e"/>
    <circle cx="61" cy="43" r="3" fill="#1e1e1e"/>
    <path d="M80 34h40M80 45h28" stroke="#1e1e1e" stroke-width="2.6" stroke-linecap="round"/>
    <rect x="80" y="57" width="44" height="12" rx="2" fill="#faf9f6" stroke="#1e1e1e" stroke-width="2"/>
    <rect x="80" y="57" width="31" height="12" rx="2" fill="#fadd42" stroke="#1e1e1e" stroke-width="2"/>
    <path d="M132 16c0-4 5-6 8-2 3-4 8-2 8 2 0 5-8 10-8 10s-8-5-8-10Z" fill="#f397b5" stroke="#1e1e1e" stroke-width="2.2" stroke-linejoin="round"/>
  </svg>`,
  siasat: `<svg class="comic-art-svg" viewBox="0 0 160 110" aria-hidden="true" focusable="false">
    <g transform="rotate(-8 62 58)">
      <rect x="31" y="23" width="54" height="72" rx="5" fill="#1e1e1e"/>
      <rect x="27" y="19" width="54" height="72" rx="5" fill="#fadd42" stroke="#1e1e1e" stroke-width="2.4"/>
      <path d="M37 33h34M37 43h22" stroke="#1e1e1e" stroke-width="2.4" stroke-linecap="round"/>
      <rect x="37" y="54" width="34" height="24" rx="2" fill="#fff" stroke="#1e1e1e" stroke-width="2"/>
    </g>
    <g transform="rotate(7 98 56)">
      <rect x="73" y="20" width="56" height="74" rx="5" fill="#1e1e1e"/>
      <rect x="69" y="16" width="56" height="74" rx="5" fill="#ffffff" stroke="#1e1e1e" stroke-width="2.4"/>
      <circle cx="97" cy="49" r="15" fill="#f397b5" stroke="#1e1e1e" stroke-width="2.2"/>
      <path d="M92 44c0-3.5 2.5-5.5 5.3-5.5 2.7 0 4.7 1.7 4.7 4.2 0 2.5-2.1 3.5-3.8 4.6-1 .7-1.2 1.4-1.2 2.7" fill="none" stroke="#1e1e1e" stroke-width="2.6" stroke-linecap="round"/>
      <circle cx="97" cy="56" r="1.8" fill="#1e1e1e"/>
      <path d="M81 76h32" stroke="#1e1e1e" stroke-width="2.4" stroke-linecap="round"/>
    </g>
    <path d="M16 18h34v16H30l-7 7v-7h-7Z" fill="#a4dde5" stroke="#1e1e1e" stroke-width="2.2" stroke-linejoin="round"/>
    <circle cx="26" cy="26" r="2" fill="#1e1e1e"/>
    <circle cx="33" cy="26" r="2" fill="#1e1e1e"/>
    <circle cx="40" cy="26" r="2" fill="#1e1e1e"/>
  </svg>`,
  text: `<svg class="comic-art-svg" viewBox="0 0 160 110" aria-hidden="true" focusable="false">
    <rect x="20" y="17" width="124" height="78" rx="5" fill="#1e1e1e"/>
    <rect x="16" y="13" width="124" height="78" rx="5" fill="#ffffff" stroke="#1e1e1e" stroke-width="2.4"/>
    <path d="M16 30h124" stroke="#1e1e1e" stroke-width="2.4"/>
    <rect x="28" y="42" width="44" height="10" rx="2" fill="#a4dde5" stroke="#1e1e1e" stroke-width="1.8"/>
    <rect x="28" y="59" width="30" height="10" rx="2" fill="#f397b5" stroke="#1e1e1e" stroke-width="1.8"/>
    <path d="M77 56h12" stroke="#1e1e1e" stroke-width="2.4" stroke-linecap="round"/>
    <path d="m85 51 5 5-5 5" fill="none" stroke="#1e1e1e" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="97" y="46" width="30" height="24" rx="3" fill="#fadd42" stroke="#1e1e1e" stroke-width="2.2"/>
    <path d="M104 46v-7a8 8 0 0 1 16 0v7" fill="none" stroke="#1e1e1e" stroke-width="2.4"/>
    <circle cx="112" cy="58" r="3" fill="#1e1e1e"/>
  </svg>`,
  docs: `<svg class="comic-art-svg" viewBox="0 0 160 110" aria-hidden="true" focusable="false">
    <rect x="20" y="17" width="118" height="78" rx="4" fill="#1e1e1e"/>
    <rect x="16" y="13" width="118" height="78" rx="4" fill="#ffffff" stroke="#1e1e1e" stroke-width="2.4"/>
    <path d="M16 29h118" stroke="#1e1e1e" stroke-width="2.4"/>
    <circle cx="26" cy="21" r="2.4" fill="#f397b5" stroke="#1e1e1e" stroke-width="1.5"/>
    <circle cx="36" cy="21" r="2.4" fill="#fadd42" stroke="#1e1e1e" stroke-width="1.5"/>
    <rect x="30" y="38" width="54" height="42" rx="2" fill="#faf9f6" stroke="#1e1e1e" stroke-width="2"/>
    <path d="M38 48h34M38 58h38M38 68h24" stroke="#1e1e1e" stroke-width="2.2" stroke-linecap="round"/>
    <circle cx="112" cy="59" r="18" fill="#fadd42" stroke="#1e1e1e" stroke-width="2.4"/>
    <path d="m104 59 5.5 5.5L121 53" fill="none" stroke="#1e1e1e" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  portfolio: `<svg class="comic-art-svg" viewBox="0 0 160 110" aria-hidden="true" focusable="false">
    <rect x="22" y="16" width="118" height="80" rx="4" fill="#1e1e1e"/>
    <rect x="18" y="12" width="118" height="80" rx="4" fill="#fadd42" stroke="#1e1e1e" stroke-width="2.4"/>
    <rect x="26" y="20" width="102" height="16" rx="2" fill="#ffffff" stroke="#1e1e1e" stroke-width="2"/>
    <path d="M33 28h28" stroke="#1e1e1e" stroke-width="2.8" stroke-linecap="round"/>
    <rect x="26" y="43" width="46" height="40" rx="2" fill="#a4dde5" stroke="#1e1e1e" stroke-width="2"/>
    <circle cx="49" cy="63" r="11" fill="#ffffff" stroke="#1e1e1e" stroke-width="2"/>
    <rect x="78" y="43" width="50" height="18" rx="2" fill="#f397b5" stroke="#1e1e1e" stroke-width="2"/>
    <rect x="78" y="65" width="50" height="18" rx="2" fill="#ffffff" stroke="#1e1e1e" stroke-width="2"/>
  </svg>`,
};

function art(project) {
  const caption = artContent[project.art];
  const title = escape(project.name);
  return `<div class="project-art art-${project.art}" aria-hidden="true"><div class="art-top"><span class="art-heading">${title}</span>${artSvg[project.art] || ""}</div>${project.coverWords ? `<span class="art-words">${project.coverWords.map((word) => `<span>${escape(word)}</span>`).join("")}</span>` : ""}<span class="art-caption">${caption}</span></div>`;
}

function card(project, homepage = false) {
  const search = [
    project.name,
    project.category,
    project.description,
    ...project.tech,
  ]
    .join(" ")
    .toLocaleLowerCase("id");
  let link;
  if (project.showcase?.url)
    link = `<a class="text-link" href="${escape(project.showcase.url)}" ${external}>Lihat showcase ${escape(project.name)} ${icon("external")}</a>`;
  else if (project.url)
    link = `<a class="text-link" href="${escape(project.url)}" ${external}>Lihat source publik ${icon("external")}</a>`;
  else if (homepage)
    link = `<a class="text-link" href="/labs/#${project.id}">Tentang ${escape(project.name)} ${icon("arrow")}</a>`;
  else link = "";
  return `<article class="project-card" id="${project.id}" data-project data-panel data-category="${escape(project.category)}" data-search="${escape(search)}">
    ${art(project)}
    <div class="project-content">
      <div class="project-meta"><span>${escape(project.category)}${project.category === project.format ? "" : ` · ${escape(project.format)}`}</span><span class="source-label">${icon(project.source === "private" ? "lock" : "code")}${project.source === "private" ? "Source private" : "Source publik"}</span></div>
      <h3>${escape(project.name)}</h3>
      <p>${escape(project.description)}</p>
      <ul class="tech-list" aria-label="Teknologi ${escape(project.name)}">${project.tech.map((tech) => `<li>${escape(tech)}</li>`).join("")}</ul>
      ${link}
    </div>
  </article>`;
}

function certCard(cert) {
  return `<article class="cert-card cert-${escape(cert.accent)}" id="cert-${escape(cert.id)}" data-panel>
    <div class="cert-ribbon" aria-hidden="true"></div>
    <div class="cert-body">
      <div class="cert-meta"><span class="cert-date">${escape(cert.date)}</span><span class="cert-no">${escape(cert.number)}</span></div>
      <h3>${escape(cert.title)}</h3>
      <p class="cert-subtitle">${escape(cert.subtitle)} · ${escape(cert.issuer)}</p>
      <ul class="tech-list" aria-label="Materi ${escape(cert.title)}">${cert.topics.map((topic) => `<li>${escape(topic)}</li>`).join("")}</ul>
      <div class="cert-actions"><a class="button secondary cert-btn" href="${escape(cert.href)}" ${external}>Lihat sertifikat ${icon("external")}</a><a class="text-link" href="${escape(cert.href)}" download="${escape(cert.downloadName)}">Unduh PDF ${icon("download")}</a></div>
    </div>
  </article>`;
}

function header(active) {
  const nav = [
    ["/", "Portfolio", "home"],
    ["/labs/", "Project Labs", "projects"],
    ["/portfolio-labs/", "Portfolio Labs", "portfolios"],
  ];
  return `<a class="skip-link" href="#main">Langsung ke konten</a>
  <header class="site-header">
    <div class="wrap nav-wrap">
      <a class="brand" href="/" aria-label="CodeByRakaStudio, beranda"><span class="brand-mark" aria-hidden="true">RA</span><span class="brand-name">CodeByRakaStudio</span></a>
      <button class="menu-toggle" type="button" data-menu-toggle aria-controls="site-navigation" aria-expanded="false" aria-label="Buka navigasi" hidden>${icon("menu")}</button>
      <nav class="site-nav" id="site-navigation" aria-label="Navigasi utama">
        ${nav.map(([href, label, key]) => `<a href="${href}" ${active === key ? 'aria-current="page"' : ""}>${label}</a>`).join("")}
        <a class="nav-contact" href="/#kontak">Kontak ${icon("arrow")}</a>
      </nav>
    </div>
    <div class="read-progress" aria-hidden="true"><span data-read-progress></span></div>
  </header>`;
}

function footer() {
  return `<footer class="site-footer wrap"><p>© ${new Date().getUTCFullYear()} Raka Amar Taru Lintang</p><p>CodeByRakaStudio · <a href="https://github.com/RakaAmar18" ${external}>GitHub</a> · <a href="mailto:codebyraka.studio.id@gmail.com">Email</a></p></footer>`;
}

function page({
  title,
  description,
  path,
  active,
  content,
  preloadAvatar = false,
}) {
  return `<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${escape(description)}">
  <meta name="theme-color" content="#fffdf5">
  <title>${escape(title)}</title>
  <link rel="canonical" href="https://rakaamar.my.id${path}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escape(title)}">
  <meta property="og:description" content="${escape(description)}">
  <meta property="og:url" content="https://rakaamar.my.id${path}">
  <meta property="og:site_name" content="CodeByRakaStudio">
  <link rel="icon" href="/asset/favicon.svg" type="image/svg+xml">
  <link rel="preload" href="/asset/fonts/bangers.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/asset/fonts/jakarta.woff2" as="font" type="font/woff2" crossorigin>
  ${preloadAvatar ? '<link rel="preload" href="/asset/raka-cutout.png" as="image">' : ""}
  <link rel="stylesheet" href="/src/Style_po.css?v=${styleVersion}">
  <script src="/src/po.js?v=${scriptVersion}" type="module"></script>
</head>
<body>
  ${header(active)}
  <main id="main">${content}</main>
  ${footer()}
</body>
</html>
`;
}

const home = `<section class="hero wrap" aria-labelledby="intro-title">
  <p class="comic-caption issue-tag">EDISI #01 · FULLSTACK</p>
  <h1 id="intro-title"><span>Raka</span> <span class="name-outline">Amar</span><span class="sr-only"> Taru Lintang</span></h1>
  <div class="hero-copy">
    <p class="role">Fullstack Developer</p>
    <p>Saya Raka Amar Taru Lintang. Membangun produk lintas stack—dari web multi-tenant, aplikasi ujian desktop, video classroom real-time, hingga mobile.</p>
    <div class="hero-actions"><a class="button" href="#karya">Jelajahi karya ${icon("arrow")}</a><a class="button secondary" href="${cvHref}" ${external}>Lihat CV ${icon("external")}</a></div>
  </div>
  <figure class="portrait-panel">
    <button class="hero-bubble" type="button" data-comic-bubble aria-live="polite" title="Klik untuk ganti dialog">Fullstack lintas stack!</button>
    <img src="/asset/raka-cutout.png" width="460" height="460" alt="Raka Amar Taru Lintang" fetchpriority="high" data-portrait-tap>
  </figure>
  <p class="hero-location">${icon("pin")}Depok, Indonesia</p>
  <div class="cover-footer"><span>Web · React &amp; Laravel</span><span>Desktop · Tauri &amp; Rust</span><span>Real-time · LiveKit &amp; Flutter</span></div>
</section>
<section class="section wrap" id="karya" aria-labelledby="work-title">
  <div class="section-heading"><div><p class="comic-caption">ARC 01 · KARYA PILIHAN</p><h2 id="work-title">Karya pilihan</h2><p>Ekosistem pendidikan lintas platform, komunitas penyelamat hewan, dan game pesta deduksi sosial.</p></div><a class="text-link" href="/labs/">Semua proyek ${icon("arrow")}</a></div>
  <div class="project-grid featured-grid">${projects
    .filter((project) => project.featured)
    .map((project) => card(project, true))
    .join("")}</div>
</section>
<section class="section about-section" id="tentang" aria-labelledby="about-title">
  <div class="wrap">
    <div class="about-layout" data-panel>
      <div class="about-copy"><p class="comic-caption">ORIGIN STORY · PROFIL</p><h2 id="about-title">Tentang Raka</h2><p>Saya memimpin dan ikut membangun ekosistem produk V-Class dari nol—mencakup LMS multi-tenant, video conference real-time, kiosk ujian desktop, hingga aplikasi mobile.</p><p>Selain membangun produk lintas stack, saya memimpin Divisi Teknologi Sistem Informasi di HIMSI Universitas Gunadarma dengan fokus pada antarmuka sederhana dan pengalaman pengguna yang jelas.</p><div class="about-actions"><a class="button secondary" href="${cvHref}" ${external}>Lihat CV ${icon("external")}</a><a class="text-link" href="${cvHref}" download="RakaAmar_CV.pdf">Unduh PDF ${icon("download")}</a></div></div>
      <dl class="skills-list"><div class="skill-group"><dt>Web &amp; antarmuka</dt><dd>React · TypeScript · JavaScript · Vite · Tailwind · HTML · CSS</dd></div><div class="skill-group"><dt>Backend &amp; data</dt><dd>Laravel · PostgreSQL · Row-Level Security · MySQL · REST API</dd></div><div class="skill-group"><dt>Desktop &amp; mobile</dt><dd>Tauri · Rust · Flutter · Dart · React Native · Expo · Python</dd></div><div class="skill-group"><dt>Real-time &amp; alur kerja</dt><dd>LiveKit · WebRTC · WebSockets · Cloudflare Pages · Git</dd></div></dl>
    </div>
    <div class="exp-block">
      <p class="comic-caption">ARC 02 · PENGALAMAN &amp; PENDIDIKAN</p>
      <div class="exp-grid">
        <article class="exp-panel" data-panel><span class="exp-meta">Organisasi · 2024 – 2025</span><h3>Ketua Divisi Teknologi Sistem Informasi</h3><p class="exp-org">HIMSI (Himpunan Mahasiswa Sistem Informasi) Universitas Gunadarma</p><p>Memimpin pengembangan dan pengelolaan sistem TI himpunan, mengoordinasikan program kerja teknologi, serta mengelola rekapitulasi data anggota dan proker untuk keputusan divisi.</p></article>
        <article class="exp-panel" data-panel><span class="exp-meta">Pendidikan · 2023 – Sekarang</span><h3>S1 Sistem Informasi</h3><p class="exp-org">Universitas Gunadarma</p><p>Fokus pada rekayasa perangkat lunak lintas platform, perancangan basis data multi-tenant, serta pengembangan produk dari riset hingga produksi.</p></article>
      </div>
    </div>
  </div>
</section>
<section class="section wrap cert-section" id="sertifikat" aria-labelledby="cert-title">
  <div class="section-heading"><div><p class="comic-caption">ARC 03 · SERTIFIKASI</p><h2 id="cert-title">Sertifikat pelatihan</h2><p>Pelatihan resmi Universitas Gunadarma yang ditandatangani secara elektronik, lengkap dengan transkrip materi.</p></div></div>
  <div class="cert-grid">${versionedCertificates.map(certCard).join("")}</div>
</section>
<section class="section wrap labs-section" aria-label="Jelajahi labs">
  <p class="comic-caption">DIREKTORI · LABS</p>
  <article class="labs-door" data-panel><h2>Project Labs</h2><p>Jelajahi katalog proyek berdasarkan bidang dan teknologi. Dari aplikasi yang digunakan sehari-hari hingga eksperimen kecil.</p><a class="button secondary" href="/labs/">Jelajahi proyek ${icon("arrow")}</a></article>
  <article class="labs-door" data-panel><h2>Portfolio Labs</h2><p>Showcase khusus untuk mengenal sebuah produk lebih dekat, terpisah dari katalog proyek.</p><a class="button secondary" href="/portfolio-labs/">Lihat showcase ${icon("arrow")}</a></article>
</section>
<section class="github-section wrap" id="github" aria-label="Profil GitHub RakaAmar18">
  <div class="github-panel" data-panel><div class="github-identity"><img class="github-avatar" src="/asset/github-avatar.webp" alt="Avatar GitHub RakaAmar18" width="82" height="82" loading="lazy"><div><h2>CodeByRakaStudio</h2><a class="github-handle" href="https://github.com/RakaAmar18" ${external}>${icon("github")}@RakaAmar18</a><p>Repositori publik, catatan proyek, dan aktivitas saya di GitHub.</p></div></div><a class="button secondary" href="https://github.com/RakaAmar18" ${external}>Kunjungi profil GitHub ${icon("external")}</a></div>
</section>
<section class="contact-section" id="kontak" aria-labelledby="contact-title"><div class="wrap contact-layout"><div><p class="comic-caption comic-caption-dark">NEXT ISSUE · KONTAK</p><h2 id="contact-title">Punya proyek<br>untuk dibahas?</h2><p>Ceritakan idenya, kebutuhan produknya, atau bagian yang ingin kita kerjakan bersama.</p></div><div class="contact-actions"><a class="contact-email" href="mailto:codebyraka.studio.id@gmail.com">codebyraka.studio.id@gmail.com</a><div class="contact-buttons"><a class="button" href="mailto:codebyraka.studio.id@gmail.com?subject=Diskusi%20proyek">Buka aplikasi email ${icon("mail")}</a><span class="copy-wrap"><button class="button ghost-light" type="button" data-copy-email="codebyraka.studio.id@gmail.com">Salin email ${icon("copy")}</button><span class="comic-burst" data-copy-burst role="status" aria-live="polite" hidden>TERSALIN!</span></span></div></div></div></section>`;

const categories = [
  "Semua",
  ...new Set(projects.map((project) => project.category)),
];
const labs = `<div class="wrap"><header class="page-hero"><p class="comic-caption">KATALOG · PROJECT LABS</p><h1>Project Labs</h1><p>Kumpulan proyek web, mobile, dan desktop. Pilih bidang yang ingin dilihat, atau cari berdasarkan nama dan teknologi.</p><a class="text-link" href="/portfolio-labs/">Mencari showcase produk? ${icon("arrow")}</a></header>
<section class="catalogue" aria-label="Katalog proyek">
  <div class="catalogue-tools" id="catalogue-tools" hidden><div class="search-field"><label for="project-search">Cari proyek atau teknologi</label><div class="search-box">${icon("search")}<input id="project-search" type="search" placeholder="Misalnya: React, game, V-Class" autocomplete="off"></div></div><div class="filters" role="group" aria-label="Filter bidang proyek">${categories.map((category) => `<button class="filter" type="button" data-filter="${escape(category)}" aria-pressed="${category === "Semua"}">${escape(category)}</button>`).join("")}</div></div>
  <div class="catalogue-summary"><p id="result-count" role="status" aria-live="polite" aria-atomic="true">${projects.length} dari ${projects.length} proyek</p><p>Beberapa source proyek tidak dipublikasikan.</p></div>
  <div class="project-grid">${projects.map((project) => card(project)).join("")}</div>
  <div class="no-results" id="no-results" hidden><h2>Tidak ada proyek yang cocok</h2><p>Coba kata lain atau tampilkan kembali semua bidang.</p><button class="button" type="button" data-reset-search>Reset pencarian ${icon("arrow")}</button></div>
</section></div>`;

const showcases = projects.filter((project) => project.showcase);
const portfolioLabs = `<div class="wrap"><header class="page-hero"><p class="comic-caption">SHOWCASE · PORTFOLIO LABS</p><h1>Portfolio Labs</h1><p>Halaman showcase untuk mengenal konteks, fitur, dan pengalaman sebuah produk. Bukan daftar repository, melainkan tempat melihat karya secara utuh.</p><a class="text-link" href="/labs/">Lihat semua proyek ${icon("arrow")}</a></header>
<section class="showcase-list" aria-label="Showcase produk">
  ${showcases.map((project) => `<article class="showcase" data-panel>${art(project)}<div class="showcase-copy"><span class="availability">${icon(project.showcase.url ? "check" : "clock")}${project.showcase.url ? "Showcase tersedia" : "Showcase sedang dibuat"}</span><h2>${escape(project.showcase.title)}</h2><p>${escape(project.showcase.description)}</p>${project.showcase.url ? `<p><strong>${escape(new URL(project.showcase.url).hostname)}</strong></p><a class="button blue" href="${escape(project.showcase.url)}" ${external}>Buka showcase ${escape(project.name)} ${icon("external")}</a>` : '<p class="progress-note">Belum ada website showcase yang dipublikasikan.</p>'}</div></article>`).join("")}
</section></div>`;

const pages = [
  [
    "index.html",
    {
      title: "Raka Amar | Portfolio · CodeByRakaStudio",
      description:
        "Portfolio Raka Amar Taru Lintang — Fullstack Developer. Ekosistem web multi-tenant, aplikasi desktop Tauri/Rust, real-time LiveKit, dan mobile Flutter.",
      path: "/",
      active: "home",
      content: home,
      preloadAvatar: true,
    },
  ],
  [
    "labs/index.html",
    {
      title: "Project Labs | Raka Amar",
      description:
        "Katalog proyek Raka Amar: V-Class, Jaga Anabul, Siasat Kata, aplikasi web, dan desktop. Jelajahi berdasarkan bidang dan teknologi.",
      path: "/labs/",
      active: "projects",
      content: labs,
    },
  ],
  [
    "portfolio-labs/index.html",
    {
      title: "Portfolio Labs | Raka Amar",
      description:
        "Showcase produk karya Raka Amar. Jelajahi portfolio V-Class dan perkembangan showcase Jaga Anabul.",
      path: "/portfolio-labs/",
      active: "portfolios",
      content: portfolioLabs,
    },
  ],
];
for (const [path, settings] of pages) {
  const destination = resolve(root, path);
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, page(settings), "utf8");
  console.log(`Built ${path}`);
}
const cvRedirectPage = `<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>CV | Raka Amar Taru Lintang</title>
  <meta http-equiv="refresh" content="0; url=${cvHref}">
  <link rel="canonical" href="https://rakaamar.my.id/asset/RakaAmar_CV.pdf">
  <link rel="icon" href="/asset/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="/src/Style_po.css?v=${styleVersion}">
</head>
<body>
  <main class="wrap" style="padding-block: 64px;">
    <h1>CV Raka Amar Taru Lintang</h1>
    <p style="margin-top: 16px;">Mengarahkan ke dokumen CV terbaru...</p>
    <div class="hero-actions" style="margin-top: 24px;">
      <a class="button" href="${cvHref}">Buka CV (PDF)</a>
      <a class="button secondary" href="${cvHref}" download="RakaAmar_CV.pdf">Unduh CV</a>
      <a class="text-link" href="/">Kembali ke Portfolio</a>
    </div>
  </main>
  <script>window.location.replace(${JSON.stringify(cvHref)});</script>
</body>
</html>
`;
await writeFile(resolve(root, "cv.html"), cvRedirectPage, "utf8");
console.log("Built cv.html");
console.log(
  `Built ${pages.length} routes from ${projects.length} public-safe project summaries.`,
);
