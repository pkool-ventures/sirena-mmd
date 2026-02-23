import { useEffect, useRef } from "react";
import {
  EditorView,
  keymap,
  lineNumbers,
  highlightActiveLine,
} from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { bracketMatching } from "@codemirror/language";
import { mermaidLanguage, mermaidHighlightStyle } from "../lang-mermaid";

interface MermaidEditorProps {
  value: string;
  onChange: (value: string) => void;
  onRun: () => void;
}

const darkTheme = EditorView.theme(
  {
    "&": {
      height: "100%",
      fontSize: "14px",
      backgroundColor: "#131313",
    },
    ".cm-scroller": {
      overflow: "auto",
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
    },
    ".cm-content": {
      caretColor: "#c9d1d9",
    },
    "&.cm-focused .cm-cursor": {
      borderLeftColor: "#c9d1d9",
    },
    ".cm-gutters": {
      backgroundColor: "#131313",
      color: "#6c7086",
      border: "none",
    },
    ".cm-activeLineGutter": {
      backgroundColor: "#313244",
    },
    ".cm-activeLine": {
      backgroundColor: "#313244",
    },
  },
  { dark: true },
);

export default function MermaidEditor({
  value,
  onChange,
  onRun,
}: MermaidEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const runKeymap = keymap.of([
      {
        key: "Ctrl-Enter",
        run: () => {
          onRun();
          return true;
        },
      },
      {
        key: "Cmd-Enter",
        run: () => {
          onRun();
          return true;
        },
      },
    ]);

    const state = EditorState.create({
      doc: value,
      extensions: [
        lineNumbers(),
        highlightActiveLine(),
        history(),
        bracketMatching(),
        mermaidLanguage,
        mermaidHighlightStyle,
        darkTheme,
        runKeymap,
        keymap.of([...defaultKeymap, ...historyKeymap]),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChange(update.state.doc.toString());
          }
        }),
      ],
    });

    const view = new EditorView({ state, parent: containerRef.current });
    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const current = view.state.doc.toString();
    if (current !== value) {
      view.dispatch({
        changes: { from: 0, to: current.length, insert: value },
      });
    }
  }, [value]);

  return <div ref={containerRef} className="mermaid-editor" />;
}
