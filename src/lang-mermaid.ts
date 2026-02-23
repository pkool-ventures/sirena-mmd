import {
  StreamLanguage,
  HighlightStyle,
  syntaxHighlighting,
} from "@codemirror/language";
import { tags } from "@lezer/highlight";
import type { StringStream } from "@codemirror/language";

interface MermaidState {
  inBracket: boolean;
  inQuote: boolean;
}

const mermaidStreamParser = {
  startState(): MermaidState {
    return { inBracket: false, inQuote: false };
  },

  token(stream: StringStream, state: MermaidState): string | null {
    // Whitespace
    if (stream.eatSpace()) return null;

    // Comments: %%
    if (stream.match("%%")) {
      stream.skipToEnd();
      return "lineComment";
    }

    // Quoted strings
    if (stream.peek() === '"') {
      stream.next();
      state.inQuote = true;
      while (!stream.eol()) {
        if (stream.next() === '"') {
          state.inQuote = false;
          return "string";
        }
      }
      return "string";
    }
    if (state.inQuote) {
      while (!stream.eol()) {
        if (stream.next() === '"') {
          state.inQuote = false;
          return "string";
        }
      }
      return "string";
    }

    // Arrows: -->, --->, -.->, ==>, -.-, ---, ===, --, -.-
    if (stream.match(/^-+\.?-*>/) || stream.match(/^=+>/) || stream.match(/^-\.->/)) {
      return "operator";
    }
    if (stream.match(/^-+\.?-+/) || stream.match(/^=+/)) {
      return "operator";
    }

    // Edge labels: |text|
    if (stream.peek() === "|") {
      stream.next();
      while (!stream.eol() && stream.peek() !== "|") stream.next();
      if (stream.peek() === "|") stream.next();
      return "labelName";
    }

    // Brackets for node shapes: [], (), {}, (( )), [[ ]], ([ ]), {{ }}
    if (stream.match("((") || stream.match("[[") || stream.match("([") || stream.match("{{")) {
      state.inBracket = true;
      return "bracket";
    }
    if (stream.match("))") || stream.match("]]") || stream.match("])") || stream.match("}}")) {
      state.inBracket = false;
      return "bracket";
    }
    if ("[({".includes(stream.peek()!)) {
      stream.next();
      state.inBracket = true;
      return "bracket";
    }
    if ("])}".includes(stream.peek()!)) {
      stream.next();
      state.inBracket = false;
      return "bracket";
    }

    // Text inside brackets = node label
    if (state.inBracket) {
      while (!stream.eol() && !"])}".includes(stream.peek()!)) stream.next();
      return "string";
    }

    // Diagram type keywords (first word on a line typically)
    if (
      stream.match(
        /^(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram(?:-v2)?|erDiagram|gantt|pie|gitGraph|mindmap|timeline|sankey|quadrantChart|xychart-beta|block-beta|kanban|architecture-beta|C4Context|C4Container|C4Component|C4Deployment|requirementDiagram|journey)\b/,
      )
    ) {
      return "keyword";
    }

    // Direction keywords
    if (stream.match(/^(TD|TB|BT|RL|LR)\b/)) {
      return "keyword";
    }

    // Subgraph / end / class / click / style / linkStyle / classDef
    if (
      stream.match(
        /^(subgraph|end|class|click|style|linkStyle|classDef|direction|participant|actor|activate|deactivate|note|loop|alt|else|opt|par|critical|break|rect|section|title|dateFormat|axisFormat|excludes|includes|todayMarker)\b/,
      )
    ) {
      return "keyword";
    }

    // Colon separator
    if (stream.peek() === ":") {
      stream.next();
      return "punctuation";
    }

    // Semicolons
    if (stream.peek() === ";") {
      stream.next();
      return "punctuation";
    }

    // Node IDs and other text
    stream.match(/^[^\s[\](){}|;:>"'-]+/);
    return "variableName";
  },
};

export const mermaidLanguage = StreamLanguage.define(mermaidStreamParser);

export const mermaidHighlightStyle = syntaxHighlighting(
  HighlightStyle.define([
    { tag: tags.keyword, color: "#56d4cf" },
    { tag: tags.string, color: "#a8d8a8" },
    { tag: tags.operator, color: "#e0a56a" },
    { tag: tags.bracket, color: "#c9a0dc" },
    { tag: tags.lineComment, color: "#6c7086", fontStyle: "italic" },
    { tag: tags.variableName, color: "#c9d1d9" },
    { tag: tags.labelName, color: "#7ec8e3" },
    { tag: tags.punctuation, color: "#888" },
  ]),
);
