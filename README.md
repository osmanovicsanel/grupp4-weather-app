# Weather App

Weather App är en webbapplikation byggd i JavaScript som hämtar och visar väderdata i realtid via WeatherAPI. Appen visar aktuellt väder baserat på din plats automatiskt via geolocation, och låter dig söka efter valfri stad i världen. Fokus ligger på användarvänlighet, ren kod och responsiv design för både desktop och mobil.

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

## Tekniker

- HTML5
- CSS3
- JavaScript
- WeatherAPI

---

## Funktioner

### Aktuellt väder
- Geolocation - Visar automatiskt vädret för din nuvarande plats (om du godkänner)
- Sökfunktion med historik över de 4 senaste sökningarna
- Favoritstäder - Spara städer med stjärnikonen, sparas lokalt i webbläsaren
- Aktuell temperatur, känns-som-temperatur och väderbeskrivning

### Prognoser
- Timvis prognos med temperatur och nederbörd
- 7-dagars prognos med högsta/lägsta temperatur, nederbörd i mm och väderikon

### Väderdetaljer
- Luftfuktighet, vindhastighet, sikt, lufttryck, UV-index, nederbörd, soluppgång och solnedgång

### Luftkvalitet
- Visar PM2.5, PM10, 03 och N02 med färgkodad kvalitetsindikator

---

## Kända begränsningar

- WeatherAPI stödjer inte alla städer med svenska tecken (å, ä, ö). Exempelvis kan städer som "Hässleholm" ge felmeddelandet "No matching location found" trots att de existerar. Detta upptäcktes sent i projektet och ett byte av API hade inneburit en alltför stor omstrukturering av koden.

---

## Installation

1. Klona repot:
```bash
git clone https://github.com/osmanovicsanel/grupp4-weather-app.git
```

2. Skapa en `config.js` fil i `src/`-mappen och lägg in följande kod med API-nyckel från WeatherAPI:
```javascript
export const CONFIG = {
    API_KEY: "API_NYCKEL_HÄR"
};
```

3. Öppna projektet i VS Code

4. Starta Live Server - högerklicka i index.html och välj "Open with Live Server"

---

## Licens

Detta projekt är skapat för utbildningssyfte som en del av kursen JavaScript 1 på EC Utbildning.