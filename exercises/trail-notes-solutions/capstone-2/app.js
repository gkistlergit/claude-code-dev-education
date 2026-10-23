import { addNote, cleanTags, filterByTag, listTags, removeNote, searchNotes, sortNotes } from './notes.js';

const STORAGE_KEY = 'trail-notes:v1';
const form = document.querySelector('#note-form');
const titleInput = document.querySelector('#title');
const bodyInput = document.querySelector('#body');
const tagsInput = document.querySelector('#tags');
const searchInput = document.querySelector('#search');
const tagFilter = document.querySelector('#tag-filter');
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
    if (!Array.isArray(saved)) return [];
    // Notes saved before tags existed get an empty tag list.
    return saved.filter(isNote).map((note) => ({ ...note, tags: cleanTags(note.tags) }));
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
let activeTag = '';

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
    commit(removeNote(notes, note.id));
    heading.focus(); // keep keyboard focus somewhere stable after the note disappears
  });
  const tags = el('ul', { className: 'tags' }, ...note.tags.map((t) => el('li', { textContent: t })));
  tags.setAttribute('aria-label', 'Tags');
  return el('li', { className: 'note' },
    el('h3', { textContent: note.title }),
    el('p', { className: 'note-body', textContent: note.body }),
    ...(note.tags.length ? [tags] : []),
    el('time', { dateTime: when.toISOString(), textContent: when.toLocaleString() }),
    remove);
}

const count = (n) => `${n} ${n === 1 ? 'note' : 'notes'}`;

function summary(visible) {
  if (notes.length === 0) return 'No notes yet. Add one above.';
  if (!query.trim() && !activeTag) return count(notes.length);
  if (visible.length === 0) return 'No notes match your search or tag filter.';
  return `${visible.length} of ${count(notes.length)} shown`;
}

function render() {
  const visible = sortNotes(filterByTag(searchNotes(notes, query), activeTag));
  list.replaceChildren(...visible.map(renderNote));
  status.textContent = [summary(visible), saveError].filter(Boolean).join(' ');
}

// The tag filter lists the tags in use. Rebuild it only when the notes change.
function syncTagFilter() {
  const tags = listTags(notes);
  if (!tags.includes(activeTag)) activeTag = ''; // the last note with that tag is gone
  tagFilter.replaceChildren(el('option', { value: '', textContent: 'All tags' }),
    ...tags.map((t) => el('option', { value: t, textContent: t })));
  tagFilter.value = activeTag;
}

function commit(next) {
  notes = next;
  saveNotes(notes);
  syncTagFilter();
  render();
}

// Events
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const next = addNote(notes, {
    title: titleInput.value,
    body: bodyInput.value,
    tags: tagsInput.value.split(','),
  });
  if (next === notes) return; // blank title: nothing to add
  commit(next);
  form.reset();
  titleInput.focus();
});

searchInput.addEventListener('input', () => {
  query = searchInput.value;
  render();
});

tagFilter.addEventListener('change', () => {
  activeTag = tagFilter.value;
  render();
});

syncTagFilter();
render();
