import assert from 'node:assert/strict';
import { addNote, filterByTag, listTags, searchNotes } from '../notes.js';

let notes = [];
notes = addNote(notes, { title: 'Trail map', body: 'North loop', tags: ['hiking', 'maps'] }, 1000);
notes = addNote(notes, { title: 'Packing list', body: 'Stove and filter', tags: ['gear', 'Hiking'] }, 2000);
notes = addNote(notes, { title: 'Camp rules', body: 'Quiet after ten' }, 3000);

const titles = (found) => found.map((note) => note.title);

export const checks = {
  'addNote stores tags trimmed, lowercase, without blanks or repeats': () => {
    const [note] = addNote([], { title: 'Tags', tags: ['  Camp ', 'camp', '', 'GEAR'] });
    assert.deepEqual(note.tags, ['camp', 'gear'], 'cleaned tag list');
  },

  'addNote without tags stores an empty list': () => {
    assert.deepEqual(addNote([], { title: 'Plain' })[0].tags, [], 'no tags given');
  },

  'addNote ignores tags that are not a list': () => {
    assert.deepEqual(addNote([], { title: 'Odd', tags: 'a,b' })[0].tags, [], 'a string is not a list');
  },

  'filterByTag keeps only the notes that have the tag': () => {
    assert.deepEqual(titles(filterByTag(notes, 'hiking')), ['Trail map', 'Packing list'], 'two notes');
    assert.deepEqual(titles(filterByTag(notes, 'maps')), ['Trail map'], 'one note');
  },

  'filterByTag ignores capitals and spaces in the tag you pass': () => {
    assert.deepEqual(titles(filterByTag(notes, '  GEAR ')), ['Packing list'], 'messy tag');
  },

  'filterByTag with an empty tag returns every note': () => {
    assert.equal(filterByTag(notes, '').length, 3, 'empty string');
    assert.equal(filterByTag(notes, undefined).length, 3, 'no tag at all');
  },

  'filterByTag finds nothing for a tag no note has': () => {
    assert.deepEqual(filterByTag(notes, 'glacier'), [], 'unknown tag');
  },

  'filterByTag copes with notes saved before tags existed': () => {
    const old = [{ id: 1, title: 'Old note', body: '', createdAt: 1 }];
    assert.deepEqual(filterByTag(old, 'hiking'), [], 'no tags property');
  },

  'listTags lists each tag once, in alphabetical order': () => {
    assert.deepEqual(listTags(notes), ['gear', 'hiking', 'maps'], 'sorted and unique');
  },

  'search and tag filter combine': () => {
    assert.deepEqual(titles(filterByTag(searchNotes(notes, 'STOVE'), 'hiking')), ['Packing list'], 'both apply');
    assert.deepEqual(filterByTag(searchNotes(notes, 'stove'), 'maps'), [], 'search hit without the tag');
  },
};
