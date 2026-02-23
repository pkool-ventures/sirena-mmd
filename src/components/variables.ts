import { Template } from "./type";

export const TEMPLATES: Template[] = [
  {
    label: "Sequenzdiagramm",
    name: "sequenz.mmd",
    code: `sequenceDiagram
    participant A as Alice
    participant B as Bob
    A->>B: Hallo Bob, wie geht's?
    B-->>A: Mir geht's gut, danke!
    A->>B: Schön zu hören!`,
  },
  {
    label: "Flussdiagramm",
    name: "fluss.mmd",
    code: `flowchart TD
    Start([Start]) --> Eingabe[/Daten eingeben/]
    Eingabe --> Prüfung{Gültig?}
    Prüfung -->|Ja| Verarbeitung[Daten verarbeiten]
    Prüfung -->|Nein| Fehler[Fehlermeldung]
    Fehler --> Eingabe
    Verarbeitung --> Ende([Ende])`,
  },
  {
    label: "Klassendiagramm",
    name: "klassen.mmd",
    code: `classDiagram
    class Tier {
        +String name
        +int alter
        +fressen()
        +schlafen()
    }
    class Hund {
        +String rasse
        +bellen()
    }
    class Katze {
        +boolean stubenrein
        +miauen()
    }
    Tier <|-- Hund
    Tier <|-- Katze`,
  },
  {
    label: "Gantt-Diagramm",
    name: "gantt.mmd",
    code: `gantt
    title Projektplan
    dateFormat  YYYY-MM-DD
    section Planung
        Anforderungen     :a1, 2024-01-01, 10d
        Design            :a2, after a1, 7d
    section Entwicklung
        Frontend          :b1, after a2, 14d
        Backend           :b2, after a2, 14d
    section Test
        Integration       :c1, after b1, 7d
        Abnahme           :c2, after c1, 5d`,
  },
];
