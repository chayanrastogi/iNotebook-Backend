const express = require('express');
const fetchUser = require('../middleware/fetchUser');
const router = express.Router();
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');


//ROUTE 1: Get All the notes using: GET "api/notes/fetchallnotes". Login required.
router.get('/fetchallnotes', fetchUser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occured");
    }
});


//ROUTE 2: Add new notes using: POST "api/notes/addnotes". Login required.
router.post('/addnotes', fetchUser, [
    body('title', 'Title is too short').isLength({ min: 3 }),
    body('description', 'Description must be atleast 5 characters').isLength({ min: 3 })
], async (req, res) => {

    const { title, description, tag } = req.body;
    //If there are errors, return Bad request and the errors.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const note = new Note({
            title, description, tag, user: req.user.id
        })

        const savedNote = await note.save();
        res.json(savedNote);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occured");
    }
});


//ROUTE 3: Update notes using: PUT "api/notes/updatenotes/:id". Login required.
router.put('/updatenotes/:id', fetchUser, async (req, res) => {
    const { title, description, tag } = req.body;

    try {
        //Create new note
        const newNote = {};
        if (title) { newNote.title = title }
        if (description) { newNote.description = description }
        if (tag) { newNote.tag = tag }

        //Find the node to be updated
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not Found");
        }

        //Allow updation only if user owns it
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json({ note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occured");
    }
});


//ROUTE 4: Delete notes using: DELETE "api/notes/deletenotes/:id". Login required.
router.delete('/deletenotes/:id', fetchUser, async (req, res) => {

    try {
        //Find the node to delete
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not Found");
        }

        //Allow deletion only if user owns it
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }
        note = await Note.findByIdAndDelete(req.params.id);
        res.json({ "Succes": "Note deleted", note: note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occured");
    }
});
module.exports = router