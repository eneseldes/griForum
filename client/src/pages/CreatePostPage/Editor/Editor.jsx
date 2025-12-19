/**
 * Editor Component
 * 
 * Editor.js wrapper component'i. Rich text editing için Editor.js kütüphanesini
 * kullanır. Header, list, paragraph, quote ve code block desteği sağlar.
 * initialData prop'u ile mevcut içeriği yükleyebilir ve ref ile save() metodunu expose eder.
 */

import { useRef, useEffect, useImperativeHandle, forwardRef } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Paragraph from "@editorjs/paragraph";
import Quote from "@editorjs/quote";
import Code from "@editorjs/code";
import { logError } from "../../../utils/logger";
import "./Editor.scss";

const Editor = forwardRef((props, ref) => {
  const { initialData } = props;
  const editorInstance = useRef(null);
  const holderId = useRef(`editorjs-${Math.random().toString(36).substr(2, 9)}`);
  const hasInitialized = useRef(false);
  const lastInitialDataRef = useRef(null);

  // Editor.js'i başlat
  useEffect(() => {
    // Initial data'yı parse et
    let parsedData = null;
    if (initialData) {
      try {
        parsedData = typeof initialData === "string" 
          ? JSON.parse(initialData) 
          : initialData;
      } catch (error) {
        logError("Error parsing initial data:", error);
      }
    }

    // Data'nın stringified versiyonunu al
    const dataString = JSON.stringify(parsedData);

    // Eğer data değişmemişse ve instance varsa, hiçbir şey yapma
    if (hasInitialized.current && lastInitialDataRef.current === dataString) {
      return;
    }

    // Data değişmiş veya ilk kez initialize ediliyor
    lastInitialDataRef.current = dataString;

    // Eğer instance varsa önce destroy et
    if (editorInstance.current && editorInstance.current.destroy) {
      editorInstance.current.destroy();
      editorInstance.current = null;
    }

    // Yeni instance oluştur
    editorInstance.current = new EditorJS({
      holder: holderId.current,
      placeholder: "Add an element...",
      data: parsedData || undefined,
      tools: {
        header: {
          class: Header,
          config: {
            placeholder: "Enter a header",
            levels: [2, 3, 4],
            defaultLevel: 2,
          },
        },
        list: {
          class: List,
          inlineToolbar: true,
        },
        paragraph: {
          class: Paragraph,
          inlineToolbar: true,
        },
        quote: {
          class: Quote,
          inlineToolbar: true,
        },
        code: {
          class: Code,
        },
      },
    });

    hasInitialized.current = true;

    // Cleanup function
    return () => {
      if (editorInstance.current && editorInstance.current.destroy) {
        editorInstance.current.destroy();
        editorInstance.current = null;
        hasInitialized.current = false;
        lastInitialDataRef.current = null;
      }
    };
  }, [initialData]);

  // Ref ile editor instance'ı expose et
  useImperativeHandle(ref, () => ({
    save: async () => {
      if (editorInstance.current) {
        return await editorInstance.current.save();
      }
      return null;
    },
    getInstance: () => editorInstance.current,
  }));

  return <div id={holderId.current} className="editor-container"></div>;
});

Editor.displayName = "Editor";

export default Editor;

