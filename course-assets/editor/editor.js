// editor.js — the Edit Course page: pick a course, edit it through forms, save it back.
//
// The YAML text lives in a Source (source.js), which makes every edit as a small splice of
// that text. The forms (forms.js) are drawn from the parsed data; each input names its YAML
// path, and one delegated listener here turns input into Source edits. Saving sends the
// text to edit-course, which writes the file and runs check-course. Validation while typing
// uses CourseSchema.validate, the same function the site and the checker use.

import { Source, getIn } from './source.js';
import * as Forms from './forms.js';

const { h, key } = Forms;
const Schema = window.CourseSchema;
const TOKEN = document.querySelector('meta[name="token"]').content;
const $ = selector => document.querySelector(selector);

const state = {
    course: null,        // { id, name, code, path, folders }
    source: null,
    savedText: '',
    mtime: null,
    selected: { kind: 'course' },
    schemaErrors: [],
    checkErrors: [],
    check: null,
    undo: [],
    redo: [],
    lastEdit: null,
    preview: true,
    banner: null
};

// ---------------------------------------------------------------- server

async function api(path, body) {
    const options = { headers: { 'X-Edit-Token': TOKEN } };
    if (body !== undefined) {
        options.method = 'POST';
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(body);
    }
    let response;
    try {
        response = await fetch(path, options);
    } catch (error) {
        lostContact();
        throw new Error('Edit Course is not running');
    }
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        // A restarted server has a new token, and forgets a course dropped from its list.
        if (response.status === 403 || data.error === 'unknown course') lostContact();
        const error = new Error(data.error || response.statusText);
        error.status = response.status;
        throw error;
    }
    return data;
}

// The server stopped (the Mac slept, or Quit) or restarted. Reconnecting reloads the page
// through a fresh server and puts any unsaved edits back, kept meanwhile in localStorage.
function lostContact() {
    if (!state.course || state.banner === 'lost') return;
    const banner = $('[data-banner]');
    banner.replaceChildren(
        h('span', {}, 'This tab lost contact with Edit Course, so it cannot save. If the editor stopped, open the app again; then reconnect. Unsaved edits come with you.'),
        h('button', { type: 'button', 'data-do': 'reconnect' }, 'Reconnect'));
    banner.hidden = false;
    state.banner = 'lost';
}

async function reconnect() {
    const alive = await fetch('/api/hello').then(r => r.ok).catch(() => false);
    if (!alive) {
        toast('Edit Course is not running. Open the app again, then click Reconnect.', 'warn');
        return;
    }
    const { path } = state.course;
    try {
        localStorage.setItem(`edit-course:stash:${path}`, JSON.stringify({
            text: state.source.text, savedText: state.savedText, mtime: state.mtime, selected: state.selected
        }));
    } catch (error) { /* storage unavailable: reconnecting still works, without the edits */ }
    state.savedText = state.source.text;   // no leave-page prompt; the edits are stashed
    location.href = `/?open=${encodeURIComponent(path)}`;
}

function takeStash(path) {
    try {
        const key = `edit-course:stash:${path}`;
        const stash = JSON.parse(localStorage.getItem(key));
        localStorage.removeItem(key);
        return stash;
    } catch (error) {
        return null;
    }
}

// ---------------------------------------------------------------- start

async function start() {
    const params = new URLSearchParams(location.search);
    try {
        if (params.get('open')) {
            const { id } = await api('/api/open', { path: params.get('open') });
            history.replaceState(null, '', `/?c=${id}`);
            return openCourse(id);
        }
        if (params.get('c')) return openCourse(params.get('c'));
    } catch (error) {
        toast(error.message, 'error');
        history.replaceState(null, '', '/');
    }
    showLauncher();
}

async function showLauncher() {
    $('[data-workspace]').hidden = true;
    $('[data-tools]').hidden = true;
    $('[data-launcher]').hidden = false;
    $('[data-course-name]').textContent = '';
    setStatus('');
    document.title = 'Edit Course';
    const { courses } = await api('/api/courses');
    const list = $('[data-recents]');
    list.replaceChildren(...courses.map(course => h('li', {},
        h('a', { href: `/?c=${course.id}` },
            h('span', { class: 'code' }, course.code || course.name),
            h('span', {}, course.name),
            h('span', { class: 'path' }, course.path)))));
    if (!courses.length) list.append(h('li', { class: 'lede' }, 'No courses yet.'));
}

async function openCourse(id) {
    const course = await api(`/api/course?c=${encodeURIComponent(id)}`);
    state.course = course;
    state.source = new Source(course.yaml);
    state.savedText = state.source.text;
    state.mtime = course.mtime;
    state.undo = [];
    state.redo = [];
    state.check = null;
    state.checkErrors = [];
    state.selected = remembered(id) || firstSelection();
    const stash = takeStash(course.path);
    if (stash && stash.text !== stash.savedText) {
        // Back from a reconnect with unsaved edits. Keeping the old mtime means a save
        // still asks first if the file changed on disk in between.
        state.source = new Source(stash.text);
        state.mtime = stash.mtime;
        state.selected = stash.selected || state.selected;
        toast('Reconnected. Your unsaved edits are back.');
        setTimeout(pushDraft, 0);
    }
    if (!sectionExists(state.selected)) state.selected = firstSelection();

    $('[data-launcher]').hidden = true;
    $('[data-workspace]').hidden = false;
    $('[data-tools]').hidden = false;
    $('[data-course-name]').textContent = `${course.code} · ${course.name}`;
    $('[data-course-name]').title = course.path;
    document.title = `${course.code} · Edit Course`;
    if (!course.checker) toast('Node was not found, so check-course will not run on save. Validation while you type still works.', 'warn');
    validate();
    render();
    showPreview(true);
}

// ---------------------------------------------------------------- selection

function data() {
    return state.source.data;
}

function partIds() {
    return Object.keys(data().parts || {});
}

function sections(part) {
    return (data().parts[part] && data().parts[part].sections) || [];
}

function firstSelection() {
    const part = partIds()[0];
    if (part && sections(part).length) return { kind: 'section', part, index: 0 };
    return { kind: 'course' };
}

function sectionExists(sel) {
    if (sel.kind === 'course') return true;
    if (!data().parts || !data().parts[sel.part]) return false;
    return sel.kind === 'part' || !!sections(sel.part)[sel.index];
}

function select(sel) {
    state.selected = sel;
    try { localStorage.setItem(`edit-course:${state.course.id}`, JSON.stringify(sel)); } catch (error) { /* private window */ }
    render();
    $('[data-editor]').scrollTop = 0;
    showPreview();
}

function remembered(id) {
    try { return JSON.parse(localStorage.getItem(`edit-course:${id}`)); } catch (error) { return null; }
}

function selectedPath() {
    const sel = state.selected;
    if (sel.kind === 'course') return ['course'];
    if (sel.kind === 'part') return ['parts', sel.part];
    return ['parts', sel.part, 'sections', sel.index];
}

// ---------------------------------------------------------------- validation

function validate() {
    const result = Schema.validate(data());
    state.schemaErrors = result.errors.map(parseError);
}

function parseError(text) {
    const at = text.indexOf(': ');
    const where = at < 0 ? '' : text.slice(0, at);
    const message = at < 0 ? text : text.slice(at + 2);
    const path = [];
    if (/^(parts|course)\b/.test(where)) {
        where.replace(/([^.[\]]+)|\[(\d+)\]/g, (match, name, index) => { path.push(index !== undefined ? Number(index) : name); });
    }
    return { text, where, message, path };
}

function allErrors() {
    const seen = new Set(state.schemaErrors.map(error => error.text));
    return [...state.schemaErrors, ...state.checkErrors.filter(error => !seen.has(error.text)).map(error => ({ ...error, checker: true }))];
}

function errorMap() {
    const map = new Map();
    allErrors().forEach(error => {
        const k = key(error.path);
        if (!map.has(k)) map.set(k, []);
        map.get(k).push(error.message);
    });
    return map;
}

function startsWith(path, prefix) {
    return prefix.length <= path.length && prefix.every((part, i) => path[i] === part);
}

// ---------------------------------------------------------------- editing

// Every change goes through here: it keeps undo history (typing into one field within two
// seconds is one step), revalidates, and schedules the redraw and the preview draft.
function edit(fn, path) {
    const before = state.source.text;
    let result;
    try {
        result = fn();
    } catch (error) {
        toast(`That edit could not be made: ${error.message}`, 'error');
        return false;
    }
    if (!result || !result.changed) return false;
    const k = path ? key(path) : null;
    const coalesce = k && state.lastEdit && state.lastEdit.key === k && Date.now() - state.lastEdit.time < 2000;
    if (!coalesce) {
        state.undo.push(before);
        if (state.undo.length > 200) state.undo.shift();
    }
    state.redo = [];
    state.lastEdit = k ? { key: k, time: Date.now() } : null;
    if (result.fallback) toast('That edit could not be made in place, so the file was re-serialised. Check the diff before committing.', 'warn');
    changed();
    return true;
}

function changed() {
    validate();
    updateChrome();
    pushDraft();
}

function commitField(input) {
    const path = JSON.parse(input.dataset.path);
    const type = input.dataset.type;
    let value;
    if (type === 'bool') value = input.checked ? true : undefined;
    else if (type === 'int') value = input.value === '' ? undefined : Number(input.value);
    else {
        value = input.value;
        if (type === 'base' && value.trim() === 'false') value = false;
        if (value === '' && !input.dataset.required) value = undefined;
    }
    if (typeof value === 'string' && (value.includes('`') || value.includes('${'))) {
        toast('A backtick or ${ cannot go in course-content.yaml.js (it would break the JavaScript wrapper).', 'error');
        return;
    }
    edit(() => state.source.set(path, value), path);
}

function listAction(action, path, button) {
    const index = path[path.length - 1];
    const list = path.slice(0, -1);
    if (action === 'add') {
        const current = getIn(data(), path);
        const value = JSON.parse(button.dataset.new);
        if (edit(() => state.source.insert(path, Array.isArray(current) ? current.length : 0, value))) {
            render();
            focusIn(key([...path, Array.isArray(current) ? current.length : 0]));
        }
    } else if (action === 'remove') {
        if (edit(() => state.source.remove(path))) render();
    } else if (action === 'up' || action === 'down') {
        if (edit(() => state.source.move(list, index, index + (action === 'up' ? -1 : 1)))) render();
    } else if (action === 'clear') {
        if (confirm(`Remove ${path[path.length - 1]}: and everything in it?`) && edit(() => state.source.remove(path))) render();
    } else if (action === 'set') {
        if (edit(() => state.source.set(path, JSON.parse(button.dataset.value)))) render();
    }
}

// ---------------------------------------------------------------- blocks

function blockIds() {
    return partIds().flatMap(part => sections(part).filter(s => s && s.block !== undefined).map(s => String(s.block)));
}

function nextBlockId(part, after) {
    const taken = new Set(blockIds());
    const base = after || `${part}0`;
    const match = String(base).match(/^(.*?)(\d+)$/);
    let n = match ? Number(match[2]) + 1 : 2;
    let candidate;
    do {
        candidate = match ? `${match[1]}${n}` : `${base}_${n}`;
        n += 1;
    } while (taken.has(candidate));
    return candidate;
}

function newBlock(part, id) {
    // Follow the course's own habit: most blocks either list steps or use the vignette triad.
    const blocks = partIds().flatMap(p => sections(p).filter(s => s && s.block !== undefined));
    const usesSteps = blocks.filter(s => s.steps).length > blocks.length / 2;
    const block = { block: id, nav: 'New block', title: 'New block', description: 'One line about this block.', episode: { description: '' } };
    if (usesSteps) block.steps = [{ name: `Exercise ${id}`, kind: 'exercise' }];
    else block.vignette = { description: '' };
    return block;
}

function addBlock(part, index) {
    const list = sections(part);
    const before = list.slice(0, index).reverse().find(s => s && s.block !== undefined);
    const id = nextBlockId(part, before && before.block);
    if (edit(() => state.source.insert(['parts', part, 'sections'], index, newBlock(part, id)))) {
        select({ kind: 'section', part, index });
        focusIn(key(['parts', part, 'sections', index, 'nav']));
    }
}

function sectionAction(action) {
    const { part, index } = state.selected;
    const list = sections(part);
    const section = list[index];
    const path = ['parts', part, 'sections'];
    if (action === 'up' || action === 'down') {
        const to = index + (action === 'up' ? -1 : 1);
        if (edit(() => state.source.move(path, index, to))) select({ kind: 'section', part, index: to });
    } else if (action === 'duplicate') {
        const copy = structuredClone(section);
        if (copy.block !== undefined) copy.block = nextBlockId(part, copy.block);
        if (edit(() => state.source.insert(path, index + 1, copy))) select({ kind: 'section', part, index: index + 1 });
    } else if (action === 'delete') {
        const name = section.block !== undefined ? `block ${section.block} (“${section.title || ''}”)` : 'this section';
        if (!confirm(`Delete ${name}? Undo brings it back.`)) return;
        if (edit(() => state.source.remove([...path, index]))) {
            select(list.length > 1 ? { kind: 'section', part, index: Math.max(0, index - 1) } : { kind: 'part', part });
        }
    } else if (action === 'add-after') {
        addBlock(part, index + 1);
    }
}

// ---------------------------------------------------------------- drawing

function render() {
    if (!sectionExists(state.selected)) state.selected = firstSelection();
    renderSidebar();
    renderForm();
    updateChrome();
}

function renderSidebar() {
    const errors = allErrors();
    const hasErrors = prefix => errors.some(error => startsWith(error.path, prefix));
    const sel = state.selected;
    const item = (attrs, current, ...children) => h('a', { href: '#', ...attrs, 'aria-current': current ? 'true' : 'false' }, ...children);
    const nodes = [item({ 'data-select': JSON.stringify({ kind: 'course' }), class: 'part' }, sel.kind === 'course',
        h('span', { class: 'label' }, 'Course'), hasErrors(['course']) ? h('span', { class: 'dot' }) : null)];
    partIds().forEach(part => {
        const info = data().parts[part] || {};
        const partPath = ['parts', part];
        nodes.push(item({ 'data-select': JSON.stringify({ kind: 'part', part }), class: 'part' }, sel.kind === 'part' && sel.part === part,
            h('span', { class: 'label' }, h('span', { class: 'id' }, `${part} `), info.title || ''),
            errors.some(error => startsWith(error.path, partPath) && !(error.path[2] === 'sections' && error.path.length > 3)) ? h('span', { class: 'dot' }) : null));
        sections(part).forEach((section, index) => {
            if (!section) return;
            const label = section.block !== undefined ? section.nav || section.title || ''
                : section.checkpoint !== undefined ? (Schema.checkpointWord(data()))
                : section.project ? section.project.nav || 'Project' : '?';
            const id = section.block !== undefined ? String(section.block) : section.checkpoint !== undefined ? '✓' : '◆';
            nodes.push(item({ 'data-select': JSON.stringify({ kind: 'section', part, index }), class: 'section' },
                sel.kind === 'section' && sel.part === part && sel.index === index,
                h('span', { class: 'id' }, id), h('span', { class: 'label' }, label),
                hasErrors(['parts', part, 'sections', index]) ? h('span', { class: 'dot' }) : null));
        });
        const list = sections(part);
        const checkpointAt = list.findIndex(s => s && s.checkpoint !== undefined);
        nodes.push(h('button', { type: 'button', class: 'add-block', 'data-add-block': JSON.stringify({ part, index: checkpointAt >= 0 ? checkpointAt : list.length }) }, '+ block'));
    });
    const sidebar = $('[data-sidebar]');
    const scroll = sidebar.scrollTop;
    sidebar.replaceChildren(...nodes);
    sidebar.scrollTop = scroll;
}

function renderForm() {
    const pane = $('[data-editor]');
    const focus = captureFocus();
    const scroll = pane.scrollTop;
    const ctx = { data: data(), errors: errorMap(), folders: state.course.folders, partIds: partIds(), materials: (data().course || {}).materials || 'Blocks' };
    const sel = state.selected;
    const path = selectedPath();
    const value = getIn(data(), path) || {};
    let nodes;
    if (sel.kind === 'course') {
        nodes = [head('Course', value.title || 'Course settings'), ...Forms.renderFields(Forms.COURSE, value, path, ctx)];
    } else if (sel.kind === 'part') {
        nodes = [head(`Part ${sel.part}`, value.title || ''), ...Forms.renderFields(Forms.PART, value, path, ctx)];
    } else if (value.block !== undefined) {
        nodes = [head(`Block ${value.block}`, value.title || '', true), fileStrip(value), ...Forms.renderFields(Forms.BLOCK, value, path, ctx)];
    } else if (value.checkpoint !== undefined) {
        nodes = [head(Schema.checkpointWord(data()), `Part ${sel.part}`, true), ...Forms.renderFields(Forms.CHECKPOINT, value.checkpoint || {}, [...path, 'checkpoint'], ctx)];
    } else if (value.project !== undefined) {
        nodes = [head('Project', (value.project || {}).title || '', true), ...Forms.renderFields(Forms.PROJECT, value.project || {}, [...path, 'project'], ctx)];
    } else {
        nodes = [head('Section', 'Unrecognised section', true)];
    }
    const own = ctx.errors.get(key(path));
    if (own) nodes.splice(1, 0, h('ul', { class: 'errors' }, ...own.map(message => h('li', {}, message))));
    pane.replaceChildren(...nodes);
    pane.scrollTop = scroll;
    restoreFocus(focus);
    refreshFiles();
}

function head(kind, title, sectionTools = false) {
    const sel = state.selected;
    const count = sel.kind === 'section' ? sections(sel.part).length : 0;
    return h('div', { class: 'form-head' },
        h('h1', {}, h('span', { class: 'kind' }, kind), title),
        sectionTools ? h('div', { class: 'form-actions' },
            h('button', { type: 'button', 'data-section': 'up', disabled: sel.index === 0, title: 'Move up' }, '↑'),
            h('button', { type: 'button', 'data-section': 'down', disabled: sel.index === count - 1, title: 'Move down' }, '↓'),
            h('button', { type: 'button', 'data-section': 'duplicate' }, 'Duplicate'),
            h('button', { type: 'button', 'data-section': 'add-after' }, '+ Block after'),
            h('button', { type: 'button', 'data-section': 'delete', class: 'danger' }, 'Delete')) : null);
}

// The conventional PDFs the page looks for, and whether each is on disk.
function fileStrip(section) {
    const chips = Schema.blockCandidates(data(), section).map(([kind, path]) =>
        h('button', { type: 'button', class: 'chip', 'data-action': 'reveal', 'data-file': path, 'data-kind': kind, title: `${path}\nThe page links it when it exists.` }, path.split('/').pop()));
    const reading = section.reading || {};
    if (reading.chapter !== undefined && reading.file === undefined) {
        const path = Schema.readingFile(data(), reading.chapter);
        if (path) chips.push(h('button', { type: 'button', class: 'chip needed', 'data-action': 'reveal', 'data-file': path, title: path }, path.split('/').pop()));
    }
    if (!section.folder) return h('p', { class: 'hint' }, 'No folder yet, so the page cannot look for this block’s PDFs.');
    return h('div', { class: 'files' }, ...chips);
}

async function refreshFiles() {
    const nodes = [...document.querySelectorAll('[data-editor] [data-file]')].filter(node => node.dataset.file);
    const paths = [...new Set(nodes.map(node => node.dataset.file))];
    if (!paths.length) return;
    const found = await api('/api/exists', { c: state.course.id, paths }).catch(() => ({}));
    nodes.forEach(node => {
        const ok = found[node.dataset.file];
        if (ok === undefined) return;
        if (node.classList.contains('chip')) {
            node.classList.toggle('ok', ok);
            node.classList.toggle('missing', !ok);
            if (!ok) node.title = `${node.dataset.file}\nNot on disk yet${node.classList.contains('needed') ? '' : '; the page leaves it out'}.`;
        } else {
            node.dataset.state = ok ? 'ok' : 'missing';
            node.title = ok ? 'On disk' : 'Not on disk';
        }
    });
}

function updateChrome() {
    const dirty = state.source && state.source.text !== state.savedText;
    const errors = state.source ? allErrors() : [];
    const problems = $('[data-do="problems"]');
    problems.textContent = errors.length ? `${errors.length} problem${errors.length === 1 ? '' : 's'}` : 'No problems';
    problems.classList.toggle('has', errors.length > 0);
    $('[data-do="undo"]').disabled = !state.undo.length;
    $('[data-do="redo"]').disabled = !state.redo.length;
    $('[data-do="save"]').disabled = !dirty;
    if (dirty) setStatus('Unsaved changes', 'dirty');
    else if (state.check && state.check.ran) setStatus(state.check.errors.length ? `Saved · check-course found ${state.check.errors.length} problem${state.check.errors.length === 1 ? '' : 's'}` : `Saved · ${state.check.summary}`, state.check.errors.length ? 'bad' : '');
    else if (state.source) setStatus('No unsaved changes');
    if (!$('[data-drawer]').hidden) renderProblems();
}

function setStatus(text, kind = '') {
    const status = $('[data-status]');
    status.textContent = text;
    status.title = text;
    status.className = `status ${kind}`;
}

function captureFocus() {
    const active = document.activeElement;
    if (!active || !active.dataset || !active.dataset.path) return null;
    return { path: active.dataset.path, start: active.selectionStart, end: active.selectionEnd };
}

function restoreFocus(focus) {
    if (!focus) return;
    const node = [...document.querySelectorAll('[data-editor] [data-path]')].find(n => n.dataset.path === focus.path && !n.dataset.action);
    if (!node) return;
    node.focus({ preventScroll: true });
    try { if (focus.start !== null && focus.start !== undefined) node.setSelectionRange(focus.start, focus.end); } catch (error) { /* not a text field */ }
}

function focusIn(pathKey) {
    requestAnimationFrame(() => {
        const box = [...document.querySelectorAll('[data-editor] [data-at]')].find(n => n.dataset.at === pathKey)
            || [...document.querySelectorAll('[data-editor] [data-path]')].find(n => n.dataset.path === pathKey);
        if (!box) return;
        const input = box.matches('input, textarea, select') ? box : box.querySelector('input, textarea, select');
        box.scrollIntoView({ block: 'nearest' });
        if (input) { input.focus(); if (input.select) input.select(); }
    });
}

// ---------------------------------------------------------------- problems

function renderProblems() {
    const list = $('[data-problem-list]');
    const errors = allErrors();
    list.replaceChildren(...(errors.length ? errors : [{ message: 'No problems.', where: '' }]).map(error =>
        h('li', { class: error.checker ? 'checker' : '', 'data-goto': error.path ? JSON.stringify(error.path) : '' },
            error.message, h('span', { class: 'where' }, error.where))));
}

function goTo(path) {
    let sel = { kind: 'course' };
    if (path[0] === 'parts' && path[1] !== undefined) {
        sel = path[2] === 'sections' && typeof path[3] === 'number' ? { kind: 'section', part: path[1], index: path[3] } : { kind: 'part', part: path[1] };
    }
    if (!sectionExists(sel)) return;
    select(sel);
    requestAnimationFrame(() => {
        for (let n = path.length; n > 0; n -= 1) {
            const target = [...document.querySelectorAll('[data-editor] [data-at]')].find(node => node.dataset.at === key(path.slice(0, n)));
            if (target) {
                target.scrollIntoView({ block: 'center' });
                target.classList.remove('flash');
                void target.offsetWidth;
                target.classList.add('flash');
                return;
            }
        }
    });
}

// ---------------------------------------------------------------- preview

function currentPart() {
    return state.selected.kind === 'course' ? partIds()[0] : state.selected.part;
}

function anchor() {
    const sel = state.selected;
    if (sel.kind !== 'section') return null;
    const section = sections(sel.part)[sel.index] || {};
    if (section.block !== undefined) return Schema.blockElementId(section.block);
    if (section.checkpoint !== undefined) return Schema.checkpointElementId(data());
    if (section.project) return section.project.id;
    return null;
}

function showPreview(reload = false) {
    if (!state.preview || !state.course) return;
    const frame = $('[data-preview]');
    const part = currentPart();
    if (!part) return;
    const url = `/site/${state.course.id}/part-${String(part).toLowerCase()}.html`;
    if (reload || frame.dataset.url !== url) {
        frame.dataset.url = url;
        frame.onload = () => scrollPreview();
        frame.src = `${url}?v=${Date.now()}`;
    } else {
        scrollPreview();
    }
}

function scrollPreview(tries = 40) {
    const frame = $('[data-preview]');
    const doc = frame.contentDocument;
    if (!doc) return;
    const target = anchor();
    const node = target && doc.getElementById(target);
    if (node) {
        node.scrollIntoView({ block: 'start' });
        doc.defaultView.scrollBy(0, -28);   // the embedded page is zoomed, which scrollIntoView undershoots
    }
    else if (target && tries) setTimeout(() => scrollPreview(tries - 1), 100);
    else if (!target && doc.scrollingElement) doc.scrollingElement.scrollTop = 0;
}

let draftTimer = null;
function pushDraft() {
    clearTimeout(draftTimer);
    draftTimer = setTimeout(async () => {
        const dirty = state.source.text !== state.savedText;
        await api('/api/draft', { c: state.course.id, yaml: dirty ? state.source.text : null }).catch(() => {});
        showPreview(true);
    }, 600);
}

// ---------------------------------------------------------------- saving and the file on disk

let saving = false;
async function save(force = false) {
    if (saving || !state.source) return;
    const text = state.source.text;
    if (text === state.savedText && !force) return;
    saving = true;
    setStatus('Saving…');
    try {
        const result = await api('/api/save', { c: state.course.id, yaml: text, mtime: state.mtime, force });
        state.mtime = result.mtime;
        state.savedText = text;
        state.check = result.check;
        state.checkErrors = (result.check.errors || []).map(parseError);
        hideBanner();
        saving = false;
        render();
    } catch (error) {
        saving = false;
        if (error.status === 409) {
            if (confirm('course-content.yaml.js changed on disk after you opened it. Save anyway, replacing that change with your version?')) return save(true);
            showConflict();
        } else {
            toast(`Not saved: ${error.message}`, 'error');
        }
        updateChrome();
    }
}

async function reloadFromDisk(message) {
    const course = await api(`/api/course?c=${encodeURIComponent(state.course.id)}`);
    state.course = course;
    state.source = new Source(course.yaml);
    state.savedText = state.source.text;
    state.mtime = course.mtime;
    state.undo = [];
    state.redo = [];
    hideBanner();
    validate();
    render();
    await api('/api/draft', { c: state.course.id, yaml: null }).catch(() => {});
    showPreview(true);
    if (message) toast(message);
}

function showConflict() {
    const banner = $('[data-banner]');
    banner.replaceChildren(
        h('span', {}, 'course-content.yaml.js changed on disk (another editor?) while you have unsaved changes here.'),
        h('button', { type: 'button', 'data-do': 'load-disk' }, 'Load the disk version'),
        h('button', { type: 'button', 'data-do': 'keep-mine' }, 'Keep mine'));
    banner.hidden = false;
    state.banner = 'conflict';
}

function hideBanner() {
    $('[data-banner]').hidden = true;
    state.banner = null;
}

async function poll() {
    if (!state.course || saving || document.hidden || state.banner === 'lost') return;
    try {
        const { mtime } = await api(`/api/mtime?c=${encodeURIComponent(state.course.id)}`);
        if (mtime === state.mtime || state.banner) return;
        if (state.source.text === state.savedText) await reloadFromDisk('Reloaded: the file changed on disk.');
        else showConflict();
    } catch (error) { /* the server may be stopping */ }
}

async function showDiff() {
    const { diff } = await api(`/api/diff?c=${encodeURIComponent(state.course.id)}`);
    const body = $('[data-dialog-body]');
    const lines = (diff || 'No changes since the last commit.').split('\n');
    body.replaceChildren(...lines.map(line => h('span', {
        class: line.startsWith('@@') ? 'hunk' : line.startsWith('+') && !line.startsWith('+++') ? 'add-line' : line.startsWith('-') && !line.startsWith('---') ? 'del-line' : ''
    }, line + '\n')));
    $('[data-dialog-title]').textContent = state.source.text !== state.savedText ? 'Saved changes since the last commit (unsaved edits not shown)' : 'Changes since the last commit';
    $('[data-dialog]').showModal();
}

async function quit() {
    if (state.source && state.source.text !== state.savedText && !confirm('Quit without saving your changes?')) return;
    state.savedText = state.source ? state.source.text : '';
    await api('/api/quit', {}).catch(() => {});
    document.body.replaceChildren(h('div', { class: 'stopped' }, h('h1', {}, 'Edit Course has stopped.'), h('p', {}, 'You can close this tab. Open Edit Course again to keep editing.')));
}

// ---------------------------------------------------------------- toasts

function toast(message, kind = '') {
    const node = h('div', { class: `toast ${kind}` }, message);
    $('[data-toasts]').append(node);
    setTimeout(() => node.remove(), kind ? 7000 : 3500);
}

// ---------------------------------------------------------------- events

let renderTimer = null;
document.addEventListener('input', event => {
    const input = event.target;
    if (!input.dataset || !input.dataset.path || !input.closest('[data-editor]')) return;
    if (input.type === 'checkbox' || input.type === 'date' || input.tagName === 'SELECT') return;
    commitField(input);
    // Redraw once typing pauses, so titles, errors and the sidebar catch up without stealing the caret.
    clearTimeout(renderTimer);
    renderTimer = setTimeout(render, 400);
});

document.addEventListener('change', event => {
    const input = event.target;
    if (!input.dataset || !input.dataset.path || !input.closest('[data-editor]')) return;
    if (input.type === 'checkbox' || input.type === 'date' || input.tagName === 'SELECT' || input.type === 'number') {
        commitField(input);
        render();
    }
});

document.addEventListener('click', event => {
    const target = event.target.closest('button, a, li[data-goto]');
    if (!target) return;
    if (target.dataset.select) {
        event.preventDefault();
        select(JSON.parse(target.dataset.select));
    } else if (target.dataset.addBlock) {
        const { part, index } = JSON.parse(target.dataset.addBlock);
        addBlock(part, index);
    } else if (target.dataset.section) {
        sectionAction(target.dataset.section);
    } else if (target.dataset.action === 'reveal') {
        api('/api/reveal', { c: state.course.id, path: target.dataset.file }).catch(error => toast(error.message, 'error'));
    } else if (target.dataset.action) {
        listAction(target.dataset.action, JSON.parse(target.dataset.path), target);
    } else if (target.dataset.goto !== undefined && target.dataset.goto) {
        goTo(JSON.parse(target.dataset.goto));
    } else if (target.dataset.do) {
        command(target.dataset.do);
    }
});

function command(name) {
    if (name === 'save') save();
    else if (name === 'undo') undo();
    else if (name === 'redo') redo();
    else if (name === 'quit') quit();
    else if (name === 'diff') showDiff().catch(error => toast(error.message, 'error'));
    else if (name === 'close-dialog') $('[data-dialog]').close();
    else if (name === 'problems') { const drawer = $('[data-drawer]'); drawer.hidden = !drawer.hidden; renderProblems(); }
    else if (name === 'close-drawer') $('[data-drawer]').hidden = true;
    else if (name === 'preview') {
        state.preview = !state.preview;
        $('[data-do="preview"]').setAttribute('aria-pressed', String(state.preview));
        $('[data-workspace]').classList.toggle('no-preview', !state.preview);
        if (state.preview) showPreview(true);
    } else if (name === 'choose') {
        api('/api/choose', {}).then(result => { if (result.id) location.href = `/?c=${result.id}`; }).catch(error => toast(error.message, 'error'));
    } else if (name === 'reconnect') reconnect();
    else if (name === 'load-disk') reloadFromDisk('Loaded the version on disk.');
    else if (name === 'keep-mine') {
        hideBanner();
        state.banner = 'kept';
        toast('Keeping your version. Saving will ask before it replaces the file on disk.');
    }
}

function undo() {
    if (!state.undo.length) return;
    state.redo.push(state.source.text);
    state.source.load(state.undo.pop());
    state.lastEdit = null;
    changed();
    render();
}

function redo() {
    if (!state.redo.length) return;
    state.undo.push(state.source.text);
    state.source.load(state.redo.pop());
    state.lastEdit = null;
    changed();
    render();
}

document.addEventListener('keydown', event => {
    const mod = event.metaKey || event.ctrlKey;
    if (!mod) return;
    if (event.key === 's') { event.preventDefault(); save(); return; }
    const typing = event.target.matches && event.target.matches('input[type=text], input:not([type]), textarea');
    if (event.key.toLowerCase() === 'z' && !typing && state.source) {
        event.preventDefault();
        if (event.shiftKey) redo(); else undo();
    }
});

window.addEventListener('beforeunload', event => {
    if (state.source && state.source.text !== state.savedText) event.preventDefault();
});

// Keep the server alive while a tab is open; tell it when the last one goes.
setInterval(() => api('/api/ping', {}).catch(() => {}), 20000);
window.addEventListener('pagehide', () => navigator.sendBeacon(`/api/bye?token=${encodeURIComponent(TOKEN)}`));
setInterval(poll, 2000);

start();
