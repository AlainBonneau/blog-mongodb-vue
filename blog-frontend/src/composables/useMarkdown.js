// composables/useMarkdown.js
import { computed } from "vue";
import { marked } from "marked";
import DOMPurify from "dompurify";

export function useMarkdown() {
  // Configuration de marked
  const setupMarked = () => {
    marked.setOptions({
      breaks: true,
      gfm: true,
      headerIds: true,
      mangle: false,
      pedantic: false,
      sanitize: false,
      silent: false,
      smartLists: true,
      smartypants: true,
      xhtml: false,
      tables: true,
    });

    // Renderer personnalisé
    const renderer = new marked.Renderer();

    // Liens externes s'ouvrent dans un nouvel onglet
    renderer.link = (token) => {
      const href = token.href || "#";
      const title = token.title ? ` title="${token.title}"` : "";
      const text = token.text || "";

      if (!href || typeof href !== "string") {
        return `<a href="#"${title}>${text}</a>`;
      }

      const isExternal = !href.startsWith("/") && !href.startsWith("#");
      const target = isExternal
        ? ' target="_blank" rel="noopener noreferrer"'
        : "";

      return `<a href="${href}"${title}${target}>${text}</a>`;
    };

    // Code blocks
    renderer.code = (token) => {
      const codeContent = token.text || "";
      const language = token.lang || "";
      const validLanguage = language && language.match(/^[a-zA-Z0-9_-]+$/);
      const langClass = validLanguage ? ` class="language-${language}"` : "";

      const escapedCode = codeContent
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

      return `<pre><code${langClass}>${escapedCode}</code></pre>`;
    };

    // Tableaux
    renderer.table = (token) => {
      const headerRow = token.header
        ? `<tr>${token.header
            .map((cell) => `<th>${cell.text || ""}</th>`)
            .join("")}</tr>`
        : "";

      const bodyRows = token.rows
        ? token.rows
            .map(
              (row) =>
                `<tr>${row
                  .map((cell) => `<td>${cell.text || ""}</td>`)
                  .join("")}</tr>`
            )
            .join("")
        : "";

      return `<table class="w-full border-collapse my-6">
        <thead>${headerRow}</thead>
        <tbody>${bodyRows}</tbody>
      </table>`;
    };

    marked.use({ renderer });
  };

  // Configuration DOMPurify
  const sanitizeOptions = {
    ALLOWED_TAGS: [
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "p",
      "br",
      "strong",
      "em",
      "u",
      "del",
      "s",
      "a",
      "img",
      "video",
      "audio",
      "ul",
      "ol",
      "li",
      "blockquote",
      "pre",
      "code",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
      "hr",
      "div",
      "span",
    ],
    ALLOWED_ATTR: [
      "href",
      "src",
      "alt",
      "title",
      "class",
      "target",
      "rel",
      "id",
      "style",
      "controls",
      "width",
      "height",
    ],
    ALLOW_DATA_ATTR: false,
  };

  // Initialiser marked une seule fois
  setupMarked();

  // Fonction de rendu
  const renderMarkdown = (content) => {
    if (!content || typeof content !== "string") {
      return "";
    }

    try {
      const rawHtml = marked(content);
      const cleanHtml = DOMPurify.sanitize(rawHtml, sanitizeOptions);
      return cleanHtml;
    } catch (error) {
      console.error("Erreur lors du rendu Markdown:", error);
      return "<p>Erreur lors du rendu du contenu</p>";
    }
  };

  return {
    renderMarkdown,
  };
}
