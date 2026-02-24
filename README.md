# Weather App

En modern väderapplikation som hämtar och visar väderdata i realtid med fokus på ren design och användarvänlighet.

---

## Projektinformation

**Skola:** EC Utbildning  
**Utbildning:** Frontendutvecklare  
**Kurs:** JavaScript 1  
**Grupp:** Grupp 4  

---

## Gruppmedlemmar

- Alvina Tolvgård
- Albrim Hoti
- Ivana Lucic
- Sanel Osmanovic
- Maryam Rutqvist Ristimäki

---

## Om Projektet

Väderappen är en gruppuppgift där vi skapar en webbapplikation med modern design som skiljer sig från traditionella vädertjänster. Fokus ligger på användarvänlighet, ren kod och responsiv design.

---

## Tekniker

- HTML5
- CSS3
- JavaScript
- Weatherapi

---

## Funktioner

*Funktioner kommer att uppdateras under projektets gång.*

### Grundfunktioner
- Sök efter städer
- Visa aktuellt väder
- Responsiv design

### Planerade funktioner
- 7-dagars väderprognos
- Favorit-städer

---

## Projektstruktur

```
grupp4-weather-app/
│
├── index.html
├── README.md
├── .gitignore
│
├── css/
│   └── style.css
│
├── src/
│   ├── main.js
│   ├── api.js
│   ├── storage.js
│   ├── ui.js
│   └── utils.js
│
└── assets/
    └── images/
```

---

## Installation

Här fyller vi in information om hur projektet kan köras

---

## Arbetsflöde

### Branch-strategi
```
main
├── [funktionsnamn]- [ditt namn]
├── [dokumentation]- [ditt namn]
└── [design]- [ditt namn]
```

#### 1. Hämta senaste ändringar
```bash
git checkout main
git pull origin main
```

#### 2. Skapa ny branch med ditt namn
```bash
git checkout -b feature/-[ditt namn]
```

#### 3. Jobba med din kod
Gör dina ändringar i VS Code

#### 4. Commit med ditt namn
```bash
git add .
git commit -m "Add: beskrivning - [ditt namn]"
```

#### 5. Pusha till GitHub
```bash
git push origin feature/din-funktion-[ditt namn]
```

#### 6. Skapa Pull Request
- Gå till GitHub
- Klicka på "Compare & pull request"
- Fyll i beskrivning av vad du gjort

#### 7. Be om Review i Discord
Skriv i `#frågor-och-funderingar`:
```
🔄 Pull Request klar för review!
Branch: feature/din-funktion-[ditt namn]
[Kort beskrivning]
```

#### 8. Code Review & Merge
- Vänta på godkännande innan merge
- När godkänd: Merge och delete branch

#### 9. Uppdatera lokal main
```bash
git checkout main
git pull origin main
```
---

## Licens

Detta projekt är skapat för utbildningssyfte som en del av kursen JavaScript 1 på EC Utbildning.