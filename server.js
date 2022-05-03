var express = require('express')
var app = express()
const cors = require('cors');
const fs = require('fs')

app.use(express.json({ limit: 10000000 }));
app.use(express.urlencoded({ extended: true }));
app.use(cors())

app.post('/game', function (req, res) {
  const jsonData=JSON.stringify(req.body)
  //console.log(jsonData.slice(0,100))
  //console.log(req.body)
  fs.writeFile("src/assets/levels.json", jsonData, 'utf8', function (err) {
    if (err) {
		console.log("An error occured while writing JSON Object to File.");
      res.send("Fel vid sparning av filen: "+err);
    }
    console.log("Sparat");
    res.send("Filen är sparad.");
  });
  
})

app.post('/demo', function (req, res) {
  const jsonData=JSON.stringify(req.body)
  //console.log(jsonData.slice(0,100))
  //console.log(req.body)
  fs.writeFile("src/assets/demoLevel.json", jsonData, 'utf8', function (err) {
    if (err) {
		console.log("An error occured while writing JSON Object to File.");
      res.send("Fel vid sparning av filen: "+err);
    }
    console.log("Sparat");
    res.send("Filen är sparad.");
  });
  
})

app.listen(3000, function () {
  console.log('Listening on port 3000...')
})