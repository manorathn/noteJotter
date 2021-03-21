// Dependencies
const express = require('express');
const path = require('path');
const fs = require('fs');
const dbJSON = require("./db/db.json");
const { v4: uuidv4 } = require('uuid');
const app = express();
const PORT = process.env.PORT || 3011;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('./public'));

//ROUTES 
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, './public/index.html')));

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

//  READ THE DB.JSON FILE AND RETURN SAVED NOTES AS JSON
app.get('/api/notes', function (req, res) {
    fs.readFile('./db/db.json', 'utf8', function (err, data) {
        res.json(JSON.parse(data));
    })
});

//WRITING NOTES 
app.post("/api/notes", function (req, res) {
    const notes = req.body;
    notes.id = uuidv4();
    dbJSON.push(notes);
    fs.writeFile(path.join(__dirname, './db/db.json'), JSON.stringify(dbJSON, null, 2), (err) => {
        if (err) {
            return res.json({ error: "Error writing to file" });
        }
        return res.json(notes);
    });
});

//Delete notes
app.delete("/api/notes/:id", function (req, res) {
    fs.readFile("db/db.json", "utf8", function (error, data) {
        let noteId = req.params.id;
        let noteData = JSON.parse(data);
        noteData = noteData.filter(function (note) {
            if (noteId != note.id) {
                return true;
            } else {
                return false;
            };
        });
        fs.writeFile("db/db.json", JSON.stringify(noteData), function (error) {
            if (error)
                throw error;
            res.end(console.log("Deleted Successfully"));
        })
    });
});


// Listener
app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
