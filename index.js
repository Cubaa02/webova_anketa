const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // pro statické soubory (CSS, JS)
app.set('view engine', 'ejs'); // nastavení EJS jako šablonovacího nástroje

app.listen(PORT, () => {
console.log(`Server běží na portu ${PORT}`);
});


/* Routa pro zobrazení úvodní stránky */ 
app.get('/', (req, res) => {
    // Zde, na úvodní stránce, budeme zobrazovat formulář pro vyplnění ankety
    res.render('index', { title: 'Webová anketa' }); // index.ejs je soubor šablony
});


/* Routa pro zpracování dat z formuláře */
app.post("/submit", (req, res) => {
    // Zde budeme ukládat data z formuláře do souboru responses.json
    const newResponse = {
      id: Date.now(), // Jednoduchý způsob, jak generovat unikátní ID
      timestamp: new Date().toISOString(),
      answers: req.body, // Předpokládáme, že všechny odpovědi jsou ve formátu, který chceme uložit
    };
  
    // Čtení stávajících dat z souboru
    fs.readFile("responses.json", (err, data) => {
      if (err) throw err;
      let json = JSON.parse(data);
      json.push(newResponse);
  
      // Zápis aktualizovaných dat zpět do souboru
      fs.writeFile("responses.json", JSON.stringify(json, null, 2), (err) => {
        if (err) throw err;
        console.log("Data byla úspěšně uložena.");
        res.redirect("/results"); // Přesměrování na stránku s výsledky
      });
    });
  });

/* Routa pro zobrazení výsledků ankety */
app.get('/results', (req, res) => {
    // Read the responses.json file
    fs.readFile("responses.json", (err, data) => {
      if (err) throw err;
      let json = JSON.parse(data);
  
      // Pass the parsed JSON object to the results.ejs template
      res.render('results', { responses: json, title: 'Výsledky ankety' });
    });
  });






