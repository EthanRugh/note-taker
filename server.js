const fs = require('fs');
const express = require('express');
const path = require('path');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(express.static("public"));

app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', "utf-8", (err, data) => {
        let noteSwitch = JSON.parse(data)
        if (err) {
            throw err;
        }
        return res.json(noteSwitch)
    });
});

app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;
    let newSaveNote = {
        title,
        text
    };

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        let parsedNotes = JSON.parse(data);
        let savedNotes = [];
        parsedNotes.push(newSaveNote);
        for (let i = 0; i < parsedNotes.length; i++) {
            let noteId = parsedNotes.id = +i;
            let newNoteId = {
                title: parsedNotes[i].title,
                text: parsedNotes[i].text,
                id: noteId
            }
            savedNotes.push(newNoteId);
        }
        console.log(savedNotes);

        fs.writeFile('./db/db.json', JSON.stringify(savedNotes), (writeErr) =>
            writeErr
                ? console.error(writeErr)
                : console.log('note saved')
        );
        return res.json(savedNotes);
    });
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"))
});

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"))
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});
