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
        if(err) {
            throw err;
        }
        return res.json(noteSwitch)
    });
});

app.post('/api/notes', (req, res) => {
    // notesArr = [];
    // notesArr.push(req.body);
    const { title, text } = req.body;
    const newSaveNote = {
        title,
        text,
        //note_id 
    };

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
            const parsedNotes = JSON.parse(data);
            parsedNotes.push(newSaveNote);
            
            fs.writeFile('./db/db.json', JSON.stringify(parsedNotes), (writeErr) => 
                writeErr
                    ? console.error(writeErr)
                    : console.log('note saved')
            );
            return res.json(parsedNotes);
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
