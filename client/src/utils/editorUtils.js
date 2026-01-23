/**
 * Editor.js JSON formatındaki içeriği işlemek için yardımcı fonksiyonlar.
 * 
 * Fonksiyonlar:
 * - editorJsToPlainText: Editor.js JSON'u plain text'e çevirir
 * 
 * Editor.js Formatı:
 * Editor.js içerikleri JSON formatında saklanır:
 * {
 *   blocks: [
 *     { type: "paragraph", data: { text: "..." } },
 *     { type: "header", data: { text: "..." } },
 *     ...
 *   ]
 * }
 */

export function editorJsToPlainText(content, maxWords = null) {
  if (!content) return "";

  // Content JSON string ise parse et
  let blocks = [];
  try {
    const parsed = typeof content === "string" ? JSON.parse(content) : content;
    blocks = parsed.blocks || [];
  } catch (error) {
    // Eğer JSON değilse, eski format (plain text) olabilir
    return typeof content === "string" ? content : "";
  }

  if (!Array.isArray(blocks) || blocks.length === 0) {
    return "";
  }

  // Her block'u text'e çevir
  const textParts = blocks
    .map((block) => {
      switch (block.type) {
        case "paragraph":
          return block.data.text || "";

        case "header":
          return block.data.text || "";

        case "list":
          if (Array.isArray(block.data.items)) {
            return block.data.items
              .map((item) => {
                // Item string ise direkt kullan, object ise text property'sini al
                return typeof item === "string"
                  ? item
                  : item?.content || item?.text || "";
              })
              .join(" ");
          }
          return "";

        case "quote":
          return block.data.text || "";

        case "code":
          return block.data.code || "";

        default:
          return "";
      }
    })
    .filter(Boolean)
    .join(" ");

  // Maksimum kelime sayısı belirtilmişse, ilk N kelimeyi al
  if (maxWords && maxWords > 0) {
    const words = textParts.split(/\s+/);
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(" ") + "...";
    }
  }

  return textParts;
}

