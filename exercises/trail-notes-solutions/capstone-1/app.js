import { addNote, removeNote, searchNotes, sortNotes } from './notes.js';

const STORAGE_KEY = 'trail-notes:v1';
const form = document.querySelector('#note-form');
const titleInput = document.querySelector('#title');
const bodyInput = document.querySelector('#body');
const searchInput = document.querySelector('#search');
const list = document.querySelector('#notes');
const status = document.querySelector('#status');
const heading = document.querySelector('#notes-heading');

// Storage: the notes live in localStorage as JSON.
const isNote = (n) => n && typeof n.title === 'string' && typeof n.body === 'string' &&
  Number.isFinite(n.id) && Number.isFinite(n.createdAt);
let saveError = '';

function loadNotes() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(saved) ? saved.filter(isNote) : [];
  } catch {
    return []; // storage blocked, or the saved text is not valid JSON
  }
}

function saveNotes(notes) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    saveError = '';
  } catch {
    saveError = 'Could not save: storage is full or blocked in this browser.';
  }
}

// Rendering: build the list from scratch after every change.
let notes = loadNotes();
let query = '';

function el(tag, props = {}, ...children) {
  const node = Object.assign(document.createElement(tag), props);
  node.append(...children);
  return node;
}

function renderNote(note) {
  const when = new Date(note.createdAt);
  const remove = el('button', { type: 'button', className: 'delete', textContent: 'Delete' });
  remove.setAttribute('aria-label', `Delete note: ${note.title}`);
  remove.addEventListener('click', () => {
    notes = removeNote(notes, note.id);
    saveNotes(notes);
    render();
    heading.focus(); // keep keyboard focus somewhere stable after the note disappears
  });
  return el('li', { className: 'note' },
    el('h3', { textContent: note.title }),
    el('p', { className: 'note-body', textContent: note.body }),
    el('time', { dateTime: when.toISOString(), textContent: when.toLocaleString() }),
    remove);
}

const count = (n) => `${n} ${n === 1 ? 'note' : 'notes'}`;

function summary(visible) {
  if (notes.length === 0) return 'No notes yet. Add one above.';
  if (!query.trim()) return count(notes.length);
  if (visible.length === 0) return `No notes match "${query.trim()}".`;
  return `${visible.length} of ${count(notes.length)} shown`;
}

function render() {
  const visible = sortNotes(searchNotes(notes, query));
  list.replaceChildren(...visible.map(renderNote));
  status.textContent = [summary(visible), saveError].filter(Boolean).join(' ');
}

// Events
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const next = addNote(notes, { title: titleInput.value, body: bodyInput.value });
  if (next === notes) return; // blank title: nothing to add
  notes = next;
  saveNotes(notes);
  form.reset();
  titleInput.focus();
  render();
});

searchInput.addEventListener('input', () => {
  query = searchInput.value;
  render();
});

render();
