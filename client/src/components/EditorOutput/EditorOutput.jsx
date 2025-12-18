import { createElement } from "react";
import "./EditorOutput.scss";

function EditorOutput({ content }) {
  if (!content) return null;

  // Content JSON string ise parse et
  let blocks = [];
  try {
    const parsed = typeof content === "string" ? JSON.parse(content) : content;
    blocks = parsed.blocks || [];
  } catch (error) {
    // Eğer JSON değilse, eski format (plain text) olabilir
    return <p>{content}</p>;
  }

  if (!Array.isArray(blocks) || blocks.length === 0) {
    return null;
  }

  return (
    <div className="editor-output">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "paragraph":
            return (
              <p key={index} className="editor-output__paragraph">
                {block.data.text}
              </p>
            );

          case "header":
            const HeaderTag = `h${block.data.level}`;
            return createElement(
              HeaderTag,
              {
                key: index,
                className: `editor-output__header editor-output__header--h${block.data.level}`,
              },
              block.data.text
            );

          case "list":
            const ListTag = block.data.style === "ordered" ? "ol" : "ul";
            return (
              <ListTag key={index} className="editor-output__list">
                {block.data.items.map((item, itemIndex) => {
                  // Item string ise direkt kullan, object ise text property'sini al
                  const itemText = typeof item === "string" ? item : (item?.content || item?.text || String(item));
                  return <li key={itemIndex}>{itemText}</li>;
                })}
              </ListTag>
            );

          case "quote":
            return (
              <blockquote key={index} className="editor-output__quote">
                {block.data.text}
              </blockquote>
            );

          case "code":
            return (
              <pre key={index} className="editor-output__code">
                <code>{block.data.code}</code>
              </pre>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}

export default EditorOutput;

