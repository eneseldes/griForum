/**
 * Post Utilities
 * 
 * Post oluşturma ve düzenleme için yardımcı fonksiyonlar.
 * Form validation ve Editor.js content extraction işlemlerini içerir.
 */

import { showError } from "../../utils/toast";

/**
 * Validates post form data
 * @param {string} title - Post title
 * @param {string} category - Post category
 * @param {React.RefObject} editorRef - Editor.js ref
 * @returns {boolean} - True if valid
 */
export const validatePost = (title, category, editorRef) => {
  if (!title.trim()) {
    showError("Please enter a title");
    return false;
  }

  if (!category) {
    showError("Please select a category");
    return false;
  }

  if (!editorRef.current) {
    showError("Editor is not ready");
    return false;
  }

  return true;
};

/**
 * Extracts content from Editor.js
 * @param {React.RefObject} editorRef - Editor.js ref
 * @returns {Promise<string|null>} - JSON string of editor content or null
 */
export const extractEditorContent = async (editorRef) => {
  const outputData = await editorRef.current.save();
  
  if (!outputData || !outputData.blocks || outputData.blocks.length === 0) {
    showError("Please enter some content");
    return null;
  }

  return JSON.stringify(outputData);
};

