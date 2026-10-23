import assert from 'node:assert/strict';
import { addNote, removeNote, sortNotes } from '../notes.js';

const titles = (notes) => notes.map((note) => note.title);

export const checks = {
  'addNote adds a note with an id, the text and the time': () => {
    const [note] = addNote([], { title: 'Trail map', body: 'North loop' }, 1000);
    assert.equal(note.title, 'Trail map', 'title is stored');
    assert.equal(note.body, 'North loop', 'body is stored');
    assert.equal(note.createdAt, 1000, 'createdAt comes from the clock');
    assert.equal(typeof note.id, 'number', 'id is a number');
  },

  'addNote trims spaces but keeps the capitalization you typed': () => {
    const [note] = addNote([], { title: '  Camp Stove  ', body: '  Fuel: ISO butane ' });
    assert.equal(note.title, 'Camp Stove', 'title is trimmed and keeps its capitals');
    assert.equal(note.body, 'Fuel: ISO butane', 'body is trimmed and keeps its capitals');
  },

  'addNote gives every note a different id': () => {
    const notes = ['One', 'Two', 'Three'].reduce((list, title) => addNote(list, { title }), []);
    assert.equal(new Set(notes.map((note) => note.id)).size, 3, 'ids are unique');
  },

  'addNote ignores a blank title and leaves the list alone': () => {
    const notes = Object.freeze(addNote([], { title: 'Keep me' }));
    assert.equal(addNote(notes, { title: '   ' }), notes, 'blank title returns the same list');
    assert.equal(addNote(notes, { title: 'Next' }).length, 2, 'a new array is returned, not a changed one');
  },

  'removeNote removes only the note with that id': () => {
    const notes = addNote(addNote([], { title: 'One' }), { title: 'Two' });
    assert.deepEqual(titles(removeNote(notes, notes[0].id)), ['Two'], 'matching note removed');
    assert.deepEqual(titles(removeNote(notes, 999)), ['One', 'Two'], 'unknown id removes nothing');
  },

  'sortNotes puts the newest note first': () => {
    let notes = addNote([], { title: 'Oldest' }, 1000);
    notes = addNote(notes, { title: 'Newest' }, 3000);
    notes = addNote(notes, { title: 'Middle' }, 2000);
    assert.deepEqual(titles(sortNotes(notes)), ['Newest', 'Middle', 'Oldest'], 'newest first');
    assert.deepEqual(titles(notes), ['Oldest', 'Newest', 'Middle'], 'the input is not re-ordered');
  },
};
