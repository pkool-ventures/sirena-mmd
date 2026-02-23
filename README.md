# Sirena

Sirena ist eine JavaScript-basierte Rendering-Engine, die es ermöglicht, Diagramme und Visualisierungen dynamisch aus einer einfachen, textbasierten Syntax (ähnlich Markdown) zu generieren.

Das Programm zeichnet sich durch zwei Hauptkomponenten aus:

1. Code-First Ansatz: Nutzer definieren Diagramme (wie Flussdiagramme, Sequenzdiagramme, Klassendiagramme oder ER-Modelle) rein durch Text, was die Versionierung und Integration in Dokumentationen erleichtert.
2. Visual Editor: Dies ist die Schnittstelle für die visuelle Bearbeitung. Nutzer können Diagramme interaktiv per Maus erstellen und anpassen (Knoten hinzufügen, Farben ändern, Layouts anpassen). Der entscheidende Vorteil ist die bi-direktionale **Synchronisation**: Änderungen im visuellen Editor aktualisieren sofort den zugrundeliegenden Code, und Code-Eingaben aktualisieren sofort die visuelle Vorschau.
   Damit schlägt Mermaid die Brücke zwischen technischer Dokumentation (Code) und intuitiver Gestaltung (Visuell).

## For Desktop development, run:

yarn tauri dev

## For Android development, run:

yarn tauri android dev

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
