/**
 * Minimal, dependency-free Markdown → HTML renderer for article bodies.
 * Supports headings, paragraphs, bold/italic, links, images, blockquotes,
 * ordered/unordered lists, horizontal rules and inline code. Output is
 * escaped first, so raw HTML in the source is never rendered.
 */
function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function safeUrl(url: string) {
  const u = url.trim();
  if (/^(https?:\/\/|\/|mailto:)/i.test(u)) return u;
  return "#";
}

function inline(text: string) {
  let out = escapeHtml(text);
  out = out.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (_m, alt, src) =>
    `<img src="${safeUrl(src)}" alt="${alt}" loading="lazy" />`);
  out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, label, href) =>
    `<a href="${safeUrl(href)}" rel="noopener">${label}</a>`);
  out = out.replace(/`([^`]+)`/g, "<code>$1</code>");
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
  return out;
}

export function renderMarkdown(md: string): string {
  const lines = md.replace(/\r\n?/g, "\n").split("\n");
  const html: string[] = [];
  let i = 0;

  const flushParagraph = (buf: string[]) => {
    if (buf.length) html.push(`<p>${inline(buf.join(" "))}</p>`);
    buf.length = 0;
  };

  const para: string[] = [];
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) { flushParagraph(para); i++; continue; }

    const heading = /^(#{1,6})\s+(.*)$/.exec(trimmed);
    if (heading) {
      flushParagraph(para);
      const level = Math.min(heading[1].length + 1, 4); // h1 in body → h2
      html.push(`<h${level}>${inline(heading[2])}</h${level}>`);
      i++; continue;
    }

    if (/^(-{3,}|\*{3,})$/.test(trimmed)) { flushParagraph(para); html.push("<hr />"); i++; continue; }

    if (trimmed.startsWith(">")) {
      flushParagraph(para);
      const quote: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        quote.push(lines[i].trim().replace(/^>\s?/, ""));
        i++;
      }
      html.push(`<blockquote><p>${inline(quote.join(" "))}</p></blockquote>`);
      continue;
    }

    if (/^[-*]\s+/.test(trimmed)) {
      flushParagraph(para);
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
        items.push(`<li>${inline(lines[i].trim().replace(/^[-*]\s+/, ""))}</li>`);
        i++;
      }
      html.push(`<ul>${items.join("")}</ul>`);
      continue;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      flushParagraph(para);
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(`<li>${inline(lines[i].trim().replace(/^\d+\.\s+/, ""))}</li>`);
        i++;
      }
      html.push(`<ol>${items.join("")}</ol>`);
      continue;
    }

    para.push(trimmed);
    i++;
  }
  flushParagraph(para);
  return html.join("\n");
}
