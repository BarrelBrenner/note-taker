//These const statements allow for import of listed dependencies for front end interaction.
const express = require("express");
const path = require("path");
const fs = require("fs");

//This const statement creates a server.
const app = express();

//This const statement sets up a port listener.
const PORT = process.env.PORT || 8080;

//This let statement creates (createNoteData) Array.
let createNoteData = [];

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.static(path.join(__dirname, "public")));

//This section houses an api call response for notes, then results are sent to browser.
app.get("/api/notes", function (err, res) {
  try {
    createNoteData = fs.readFileSync("db/db.json", "utf8");
    console.log("SERVER CONNECTION SUCCESSFUL!");
    createNoteData = JSON.parse(createNoteData);
  } catch (err) {
    console.log("\n error (catch err app.get):");
    console.log(err);
  }
  res.json(createNoteData);
});

//This section writes a new note to json file and sends it back to browser.
app.post("/api/notes", function (req, res) {
  try {
    createNoteData = fs.readFileSync("./db/db.json", "utf8");
    console.log(createNoteData);
    createNoteData = JSON.parse(createNoteData);
    req.body.id = createNoteData.length;
    createNoteData.push(req.body);
    createNoteData = JSON.stringify(createNoteData);
    fs.writeFile("./db/db.json", createNoteData, "utf8", function (err) {
      if (err) throw err;
    });

    res.json(JSON.parse(createNoteData));
  } catch (err) {
    throw err;
    console.error(err);
  }
});

//This section deletes a note and reads json file, afterwards allows you to write new notes to file and sends it back to browser
app.delete("/api/notes/:id", function (req, res) {
  try {
    createNoteData = fs.readFileSync("./db/db.json", "utf8");
    createNoteData = JSON.parse(createNoteData);
    createNoteData = createNoteData.filter(function (note) {
      return note.id != req.params.id;
    });
    createNoteData = JSON.stringify(createNoteData);

    fs.writeFile("./db/db.json", createNoteData, "utf8", function (err) {
      if (err) throw err;
    });

    res.send(JSON.parse(createNoteData));
  } catch (err) {
    throw err;
    console.log(err);
  }
});

//When Click Here To Get Started button is clicked, it sends you to note.html webpage, otherwise it defaults back to homepage
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/api/notes", function (req, res) {
  return res.sendFile(path.json(__dirname, "db/db.json"));
});

//This section starts server on port
app.listen(PORT, function () {
  console.log("SERVER AT ATTENTION: " + PORT);
});
