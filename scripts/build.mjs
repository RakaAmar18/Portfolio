/**
 * Builds the three static pages committed to GitHub Pages.
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
const assetVersion = async (path) =>
  createHash("sha256")
    .update(await readFile(resolve(root, path)))
    .digest("hex")
    .slice(0, 12);
const styleVersion = await assetVersion("src/Style_po.css");
const scriptVersion = await assetVersion("src/po.js");
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
  github:
    '<path d="M9 19c-4 1-4-2-6-2m12 5v-4c0-1 .1-2-1-3 4-.4 7-2 7-6a5 5 0 0 0-1-3c.2-1 .3-2-.2-3-2 0-3 1-4 2a13 13 0 0 0-7 0C8 4 7 3 5 3c-.5 1-.4 2-.2 3a5 5 0 0 0-1 3c0 4 3 5.6 7 6-1 1-1 2-1 3v4"/>',
};
const icon = (name, extraClass = "") =>
  `<svg class="icon ${extraClass}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${iconPaths[name]}</svg>`;
const external = 'target="_blank" rel="noopener noreferrer"';
const artContent = {
  class: "Pembelajaran digital",
  anabul: "Donasi & komunitas",
  siasat: "Pesta penyusup",
  text: "Eksperimen web",
  docs: "Aplikasi desktop",
  portfolio: "Portfolio pribadi",
};

function art(project) {
  const caption = artContent[project.art];
  const title = escape(project.name);
  return `<div class="project-art art-${project.art}" aria-hidden="true"><span class="art-initial">${escape(project.name[0])}</span><span class="art-heading">${title}</span>${project.coverWords ? `<span class="art-words">${project.coverWords.map((word) => `<span>${escape(word)}</span>`).join("")}</span>` : ""}<span class="art-caption">${caption}</span></div>`;
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
  return `<article class="project-card" id="${project.id}" data-project data-category="${escape(project.category)}" data-search="${escape(search)}">
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
  </header>`;
}

function footer() {
  return `<footer class="site-footer wrap"><p>© ${new Date().getUTCFullYear()} Raka Amar Taru Lintang</p><p>CodeByRakaStudio · <a href="https://github.com/RakaAmar18" ${external}>GitHub</a> · <a href="mailto:mukiyi3747@gmail.com">Email</a></p></footer>`;
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
  <link rel="canonical" href="https://rakaamar.site${path}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escape(title)}">
  <meta property="og:description" content="${escape(description)}">
  <meta property="og:url" content="https://rakaamar.site${path}">
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
  <h1 id="intro-title"><span>Raka</span> <span class="name-outline">Amar</span><span class="sr-only"> Taru Lintang</span></h1>
  <div class="hero-copy">
    <p class="role">Frontend & mobile developer</p>
    <p>Saya Raka Amar Taru Lintang. Membuat aplikasi untuk belajar, bermain, dan kegiatan sehari-hari.</p>
    <div class="hero-actions"><a class="button" href="#karya">Jelajahi karya ${icon("arrow")}</a><a class="text-link" href="#kontak">Hubungi saya</a></div>
  </div>
  <figure class="portrait-panel">
    <img src="/asset/raka-cutout.png" width="460" height="460" alt="Raka Amar Taru Lintang" fetchpriority="high">
  </figure>
  <p class="hero-location">${icon("pin")}Jakarta, Indonesia</p>
  <div class="cover-footer"><span>Web & antarmuka</span><span>Mobile & desktop</span><span>Desain UI/UX</span></div>
</section>
<section class="section wrap" id="karya" aria-labelledby="work-title">
  <div class="section-heading"><div><h2 id="work-title">Karya pilihan</h2><p>Pendidikan, komunitas, dan game. Tiga proyek dengan kebutuhan dan pengalaman yang berbeda.</p></div><a class="text-link" href="/labs/">Semua proyek ${icon("arrow")}</a></div>
  <div class="project-grid featured-grid">${projects
    .filter((project) => project.featured)
    .map((project) => card(project, true))
    .join("")}</div>
</section>
<section class="section about-section" id="tentang" aria-labelledby="about-title">
  <div class="wrap about-layout">
    <div class="about-copy"><h2 id="about-title">Tentang Raka</h2><p>Proyek saya bergerak di beberapa bidang: pembelajaran digital, komunitas penyelamat hewan, dan permainan bersama teman.</p><p>Saya mengerjakan antarmuka web dan mobile, serta aplikasi desktop dengan Python. Teknologi dipilih sesuai kebutuhan produknya.</p><a class="text-link" href="/cv.html">Lihat CV ${icon("arrow")}</a></div>
    <dl class="skills-list"><div class="skill-group"><dt>Web & antarmuka</dt><dd>HTML · CSS · JavaScript · TypeScript · React · UI/UX</dd></div><div class="skill-group"><dt>Mobile & desktop</dt><dd>React Native · Expo · Python · Tkinter</dd></div><div class="skill-group"><dt>Backend & data</dt><dd>Laravel · PostgreSQL · MySQL</dd></div><div class="skill-group"><dt>Alur kerja</dt><dd>Git · GitHub · Pengembangan dan pengujian antarmuka</dd></div></dl>
  </div>
</section>
<section class="section wrap labs-section" aria-label="Jelajahi labs">
  <article class="labs-door"><h2>Project Labs</h2><p>Jelajahi katalog proyek berdasarkan bidang dan teknologi. Dari aplikasi yang digunakan sehari-hari hingga eksperimen kecil.</p><a class="button secondary" href="/labs/">Jelajahi proyek ${icon("arrow")}</a></article>
  <article class="labs-door"><h2>Portfolio Labs</h2><p>Showcase khusus untuk mengenal sebuah produk lebih dekat, terpisah dari katalog proyek.</p><a class="button secondary" href="/portfolio-labs/">Lihat showcase ${icon("arrow")}</a></article>
</section>
<section class="github-section wrap" id="github" aria-label="Profil GitHub RakaAmar18">
  <div class="github-panel"><div class="github-identity"><img class="github-avatar" src="/asset/github-avatar.webp" alt="Avatar GitHub RakaAmar18" width="82" height="82" loading="lazy"><div><h2>CodeByRakaStudio</h2><a class="github-handle" href="https://github.com/RakaAmar18" ${external}>${icon("github")}@RakaAmar18</a><p>Repositori publik, catatan proyek, dan aktivitas saya di GitHub.</p></div></div><a class="button secondary" href="https://github.com/RakaAmar18" ${external}>Kunjungi profil GitHub ${icon("external")}</a></div>
</section>
<section class="contact-section" id="kontak" aria-labelledby="contact-title"><div class="wrap contact-layout"><div><h2 id="contact-title">Punya proyek<br>untuk dibahas?</h2><p>Ceritakan idenya, kebutuhan produknya, atau bagian yang ingin kita kerjakan bersama.</p></div><div class="contact-actions"><a class="contact-email" href="mailto:mukiyi3747@gmail.com">mukiyi3747@gmail.com</a><a class="button secondary" href="mailto:mukiyi3747@gmail.com?subject=Diskusi%20proyek">Buka aplikasi email ${icon("mail")}</a></div></div></section>`;

const categories = [
  "Semua",
  ...new Set(projects.map((project) => project.category)),
];
const labs = `<div class="wrap"><header class="page-hero"><h1>Project Labs</h1><p>Kumpulan proyek web, mobile, dan desktop. Pilih bidang yang ingin dilihat, atau cari berdasarkan nama dan teknologi.</p><a class="text-link" href="/portfolio-labs/">Mencari showcase produk? ${icon("arrow")}</a></header>
<section class="catalogue" aria-label="Katalog proyek">
  <div class="catalogue-tools" id="catalogue-tools" hidden><div class="search-field"><label for="project-search">Cari proyek atau teknologi</label><div class="search-box">${icon("search")}<input id="project-search" type="search" placeholder="Misalnya: React, game, V-Class" autocomplete="off"></div></div><div class="filters" role="group" aria-label="Filter bidang proyek">${categories.map((category) => `<button class="filter" type="button" data-filter="${escape(category)}" aria-pressed="${category === "Semua"}">${escape(category)}</button>`).join("")}</div></div>
  <div class="catalogue-summary"><p id="result-count" role="status" aria-live="polite" aria-atomic="true">${projects.length} dari ${projects.length} proyek</p><p>Beberapa source proyek tidak dipublikasikan.</p></div>
  <div class="project-grid">${projects.map((project) => card(project)).join("")}</div>
  <div class="no-results" id="no-results" hidden><h2>Tidak ada proyek yang cocok</h2><p>Coba kata lain atau tampilkan kembali semua bidang.</p><button class="button" type="button" data-reset-search>Reset pencarian ${icon("arrow")}</button></div>
</section></div>`;

const showcases = projects.filter((project) => project.showcase);
const portfolioLabs = `<div class="wrap"><header class="page-hero"><h1>Portfolio Labs</h1><p>Halaman showcase untuk mengenal konteks, fitur, dan pengalaman sebuah produk. Bukan daftar repository, melainkan tempat melihat karya secara utuh.</p><a class="text-link" href="/labs/">Lihat semua proyek ${icon("arrow")}</a></header>
<section class="showcase-list" aria-label="Showcase produk">
  ${showcases.map((project) => `<article class="showcase">${art(project)}<div class="showcase-copy"><span class="availability">${icon(project.showcase.url ? "check" : "clock")}${project.showcase.url ? "Showcase tersedia" : "Showcase sedang dibuat"}</span><h2>${escape(project.showcase.title)}</h2><p>${escape(project.showcase.description)}</p>${project.showcase.url ? `<p><strong>${escape(new URL(project.showcase.url).hostname)}</strong></p><a class="button blue" href="${escape(project.showcase.url)}" ${external}>Buka showcase ${escape(project.name)} ${icon("external")}</a>` : '<p class="progress-note">Belum ada website showcase yang dipublikasikan.</p>'}</div></article>`).join("")}
</section></div>`;

const pages = [
  [
    "index.html",
    {
      title: "Raka Amar | Portfolio · CodeByRakaStudio",
      description:
        "Portfolio Raka Amar Taru Lintang. Antarmuka web, aplikasi mobile, aplikasi desktop, dan showcase proyek dengan karakter komik.",
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
console.log(
  `Built ${pages.length} routes from ${projects.length} public-safe project summaries.`,
);
