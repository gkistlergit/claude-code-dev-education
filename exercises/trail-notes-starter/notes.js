// Pure functions for a list of notes. No DOM and no storage in this file,
// so every function can be checked from Node.
//
// A note looks like { id, title, body, createdAt }.

// Clean up text before it is stored or compared.
const normalize = (text) => String(text ?? '').trim();

export function addNote(notes, { title, body = '' }, now = Date.now()) {
  const cleanTitle = normalize(title);
  if (!cleanTitle) return notes;
  const id = notes.reduce((highest, note) => Math.max(highest, note.id), 0) + 1;
  return [...notes, { id, title: cleanTitle, body: normalize(body), createdAt: now }];
}

export function removeNote(notes, id) {
  return notes.filter((note) => note.id !== id);
}

export function searchNotes(notes, query) {
  const needle = normalize(query);
  if (!needle) return notes;
  return notes.filter(
    (note) => normalize(note.title).includes(needle) || normalize(note.body).includes(needle)
  );
}

// Newest first. Notes made in the same millisecond fall back to the higher id.
export function sortNotes(notes) {
  return [...notes].sort((a, b) => b.createdAt - a.createdAt || b.id - a.id);
}
