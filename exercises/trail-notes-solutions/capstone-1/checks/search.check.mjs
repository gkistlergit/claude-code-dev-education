import assert from 'node:assert/strict';
import { addNote, searchNotes } from '../notes.js';

let notes = [];
notes = addNote(notes, { title: 'Trail map', body: 'North loop is 6 km' }, 1000);
notes = addNote(notes, { title: 'Packing list', body: 'Stove, water filter, Map case' }, 2000);
notes = addNote(notes, { title: 'Camp rules', body: 'Quiet after ten' }, 3000);

const titles = (found) => found.map((note) => note.title);

export const checks = {
  'finds a title when the case matches exactly': () => {
    assert.deepEqual(titles(searchNotes(notes, 'Trail')), ['Trail map'], 'exact-case title match');
  },

  'finds a title typed in a different case': () => {
    assert.deepEqual(titles(searchNotes(notes, 'trail')), ['Trail map'], 'lowercase query');
    assert.deepEqual(titles(searchNotes(notes, 'CAMP')), ['Camp rules'], 'uppercase query');
  },

  'finds text in the body in any case': () => {
    assert.deepEqual(titles(searchNotes(notes, 'north LOOP')), ['Trail map'], 'body, mixed case');
    assert.deepEqual(titles(searchNotes(notes, 'map')), ['Trail map', 'Packing list'], 'title and body hits');
  },

  'ignores spaces around the query': () => {
    assert.deepEqual(titles(searchNotes(notes, '  Packing ')), ['Packing list'], 'trimmed query');
  },

  'an empty query returns every note': () => {
    assert.equal(searchNotes(notes, '').length, 3, 'empty string');
    assert.equal(searchNotes(notes, '   ').length, 3, 'only spaces');
  },

  'returns an empty list when nothing matches': () => {
    assert.deepEqual(searchNotes(notes, 'glacier'), [], 'no match');
  },
};
