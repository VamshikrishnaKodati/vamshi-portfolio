"use strict";
const $ = id => document.getElementById(id);
const themes = ["editorial", "midnight", "studio", "forest", "mono"];
const p = PROFILE;
function node(tag, text, className) {
  const el = document.createElement(tag);
  if (text) el.textContent = text;
  if (className) el.className = className;
  return el;
}
function safeUrl(value, local = false) {
  if (!value) return "";
  try {
    const u = new URL(value, location.href);
    return (u.protocol === "https:" || (local && u.origin === location.origin && ["http:", "https:"].includes(u.protocol))) ? u.href : "";
  } catch { return ""; }
}
function link(label, href) {
  const a = node("a", label);
  a.href = href;
  return a;
}
function tags(values) {
  const ul = node("ul", "", "tags");
  values.forEach(v => ul.append(node("li", v)));
  return ul;
}
function applyTheme(value) {
  const theme = themes.includes(value) ? value : "editorial";
  document.documentElement.dataset.theme = theme;
  $("theme").value = theme;
}
let saved;
try { saved = localStorage.getItem("portfolio-theme"); } catch {}
applyTheme(saved || p.theme);
$("theme").addEventListener("change", e => {
  applyTheme(e.target.value);
  try { localStorage.setItem("portfolio-theme", e.target.value); } catch {}
});
document.title = p.name + " — " + p.role;
document.querySelector('meta[name="description"]').content = p.intro;
for (const key of ["name","role","availability","location","intro","focus"]) $(key).textContent = p[key];
$("brand").textContent = p.name;
$("about-text").textContent = p.about;
$("copyright").textContent = "© " + new Date().getFullYear() + " " + p.name;
const resume = safeUrl(p.resume, true);
if (resume) { $("resume").href = resume; $("resume").hidden = false; }
p.skills.forEach(s => $("skills").append(node("li", s)));
p.projects.forEach((project, i) => {
  const article = node("article", "", "project");
  const visual = node("div", "", "visual");
  const image = safeUrl(project.image, true);
  if (image) { const img = node("img"); img.src = image; img.alt = project.title + " preview"; img.loading = "lazy"; visual.append(img); }
  else { visual.setAttribute("aria-hidden", "true"); visual.append(node("span", String(i+1).padStart(2,"0"))); }
  const content = node("div", "", "project-copy");
  content.append(node("h3", project.title), node("p", project.description), tags(project.stack || []));
  const url = safeUrl(project.url);
  if (url) content.append(link("View project ↗", url));
  article.append(visual, content); $("projects").append(article);
});
p.experience.forEach(job => {
  const article = node("article", "", "job");
  article.append(node("h3", job.title), node("p", job.organization + " · " + job.dates), node("p", job.description));
  $("jobs").append(article);
});
$("experience").hidden = !p.experience.length;
if (p.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) $("links").append(link("Email", "mailto:" + p.email));
if (/^[1-9]\d{7,14}$/.test(p.whatsapp)) $("links").append(link("WhatsApp ↗", "https://wa.me/" + p.whatsapp + "?text=" + encodeURIComponent("Hi, I would like to discuss an opportunity.")));
for (const [label, value] of [["GitHub",p.github],["LinkedIn",p.linkedin]]) {
  const url = safeUrl(value); if (url) $("links").append(link(label + " ↗", url));
}
if (!$("links").children.length) $("links").append(node("p", "Contact details coming soon."));