// forms.js — what each part of course-content looks like as a form, and the DOM for it.
//
// The field lists below mirror course-schema.js (which stays the one judge of validity);
// they only decide which widget edits each key. Rendering is plain DOM: every input
// carries its YAML path in data-path, every list button a data-action, and editor.js
// turns those into Source edits through one delegated listener.

const LINK = [
    { key: 'label', type: 'text', required: true, size: 'sm' },
    { key: 'file', type: 'file', required: true, placeholder: 'path or https:// URL' },
    { key: 'icon', type: 'text', size: 'xs', placeholder: 'fa-…' }
];

const STEP = [
    { key: 'name', type: 'text', required: true },
    { key: 'kind', type: 'select', options: ['exercise', 'vignette', 'homework', 'livestream'] },
    { key: 'where', type: 'text', hint: 'label under the dot; the kind supplies one' },
    { key: 'sub', type: 'text' },
    { key: 'date', type: 'date', hint: 'homework shows it as the due date' },
    { key: 'due', label: 'Due text', type: 'text', hint: 'replaces the date’s wording, e.g. Friday, Sept. 4 at 5PM' },
    { key: 'video', type: 'video' },
    { key: 'links', type: 'links' }
];

const EXTRA = [
    { key: 'name', type: 'text', required: true },
    { key: 'description', type: 'text' },
    { key: 'video', type: 'video' },
    { key: 'image', type: 'file', hint: 'thumbnail when there is no video' },
    { key: 'files', type: 'base' },
    { key: 'file', type: 'base' },
    { key: 'links', type: 'links' }
];

export const BLOCK = [
    { key: 'block', label: 'Block ID', type: 'text', required: true, size: 'sm' },
    { key: 'folder', type: 'folder', always: true },
    { key: 'nav', label: 'Nav label', type: 'text', required: true },
    { key: 'title', type: 'text', required: true },
    { key: 'description', type: 'long', required: true },
    { group: 'episode', fields: [
        { key: 'description', type: 'long', required: true },
        { key: 'video', type: 'video' },
        { key: 'name', type: 'text' },
        { key: 'links', type: 'links' }
    ] },
    { group: 'reading', fields: [
        { key: 'chapter', type: 'int' },
        { key: 'topic', type: 'text' },
        { key: 'name', type: 'text' },
        { key: 'description', type: 'text' },
        { key: 'file', type: 'file' },
        { key: 'video', type: 'video' },
        { key: 'links', type: 'links' }
    ] },
    { key: 'steps', type: 'records', fields: STEP, title: step => step.name, blank: { name: 'New step', kind: 'exercise' }, onlyIfPresent: true },
    // Each card carries its own date; the dates live together under dates: in the file.
    { group: 'exercise', unlessSteps: true, fields: [
        { key: 'class', label: 'Class date', type: 'date', outside: ['dates', 'class'] },
        { key: 'name', type: 'text' },
        { key: 'video', type: 'video' },
        { key: 'links', type: 'links' }
    ] },
    { group: 'vignette', unlessSteps: true, fields: [
        { key: 'recitation', label: 'Recitation date', type: 'date', outside: ['dates', 'recitation'] },
        { key: 'description', type: 'long' },
        { key: 'name', type: 'text' },
        { key: 'video', type: 'video' },
        { key: 'files', type: 'base', hint: 'another block’s PDFs (F2), a path, or false for none' },
        { key: 'solutions', type: 'bool', label: 'Show solutions' },
        { key: 'solution_file', type: 'file' },
        { key: 'links', type: 'links' }
    ] },
    { group: 'homework', unlessSteps: true, fields: [
        { key: 'homework', label: 'Due date', type: 'date', outside: ['dates', 'homework'], hint: 'the page shows this as the due date' },
        { key: 'due', label: 'Due text', type: 'text', placeholder: 'Sunday, September 6', hint: 'used only when there is no due date' },
        { key: 'file', type: 'base', hint: 'the block ID (A1) links the conventional PDF' },
        { key: 'solutions', type: 'bool', label: 'Show solutions' },
        { key: 'solution_file', type: 'file' },
        { key: 'video', type: 'video' },
        { key: 'links', type: 'links' }
    ] },
    { key: 'dates', type: 'hidden' },   // shown on the exercise, vignette and homework cards
    { key: 'extras', type: 'records', fields: EXTRA, title: extra => extra.name, blank: { name: 'New extra' } }
];

export const PART = [
    { key: 'title', type: 'text', required: true },
    { key: 'tagline', type: 'text', required: true },
    { key: 'introduction', type: 'long', required: true },
    { key: 'links', type: 'links' },
    { group: 'homework_defaults', label: 'Homework defaults', fields: [
        { key: 'due', type: 'text' },
        { key: 'file', type: 'base' },
        { key: 'solutions', type: 'bool', label: 'Show solutions' },
        { key: 'solution_file', type: 'file' }
    ] },
    { key: 'sections', type: 'hidden' }   // edited through the outline
];

export const CHECKPOINT = [
    { key: 'description', type: 'long', required: true },
    { key: 'when', type: 'text', placeholder: 'Final Exam Period' },
    { key: 'date', type: 'date' },
    { key: 'reattempt', type: 'text' },
    { key: 'reattempt_when', label: 'Reattempt when', type: 'text' },
    { key: 'next', type: 'part' },
    { group: 'demo', fields: [
        { key: 'name', type: 'text' },
        { key: 'video', type: 'video' },
        { key: 'description', type: 'long' },
        { key: 'file', type: 'base' },
        { key: 'links', type: 'links' }
    ] },
    { key: 'links', type: 'links' },
    { key: 'steps', type: 'records', fields: STEP, title: step => step.name, blank: { name: 'New step', where: 'home' } },
    { key: 'extras', type: 'records', fields: EXTRA, title: extra => extra.name, blank: { name: 'New extra' } }
];

export const PROJECT = [
    { key: 'id', type: 'text', required: true, size: 'sm' },
    { key: 'nav', label: 'Nav label', type: 'text', required: true },
    { key: 'title', type: 'text', required: true },
    { key: 'description', type: 'long', required: true },
    { key: 'prompts', type: 'records', title: prompt => prompt.label, blank: { label: 'New prompt', kind: 'research', text: '' }, fields: [
        { key: 'label', type: 'text', required: true },
        { key: 'kind', type: 'select', options: ['research', 'data', 'methods', 'finding'] },
        { key: 'text', type: 'long', required: true }
    ] },
    { key: 'requirements', type: 'lines' },
    { key: 'links', type: 'links' }
];

export const COURSE = [
    { key: 'code', type: 'text', required: true, size: 'sm' },
    { key: 'title', type: 'text', required: true },
    { key: 'brand', type: 'lines', hint: 'the stacked wordmark, one line each' },
    { key: 'home', type: 'file' },
    { key: 'checkpoint', type: 'text', hint: 'what the site calls a checkpoint' },
    { key: 'reading', type: 'text', hint: 'path pattern with {nn}, e.g. Reading/Ch_{nn}.pdf' },
    { key: 'materials', type: 'text', hint: 'directory holding the block folders' },
    { key: 'nav', label: 'Navigation', type: 'records', title: item => item.label, blank: { label: 'New link', file: '' }, fields: [
        { key: 'label', type: 'text', required: true },
        { key: 'file', type: 'file' },
        { key: 'button', type: 'bool', label: 'Show as a button' },
        { key: 'lines', type: 'lines', hint: 'a note instead of a link: *italic* for names' }
    ] }
];

// ---------------------------------------------------------------- rendering

// ctx: { data (whole course), errors: Map(pathKey -> [message]), open: Set(pathKey),
//        folders, partIds, materials }
//
// Only what is in use is drawn as a field: a value, a required key, or an error. Everything
// else waits as a chip ("+ Video") in a row under its card; clicking one adds its path to
// ctx.open and the field appears. A card opened that way shows all its fields at once.
export function renderFields(spec, value, path, ctx) {
    const known = new Set();
    const nodes = [];
    const chips = [];
    spec.forEach(field => {
        known.add(field.group || field.key);
        const entry = field.group ? groupEntry(field, value, path, ctx) : fieldEntry(field, value, path, ctx);
        if (!entry) return;
        if (entry.chip) chips.push(entry.chip);
        else nodes.push(entry.node);
    });
    const other = Object.keys(value || {}).filter(name => !known.has(name));
    if (other.length) nodes.push(h('p', { class: 'other' }, `Also in the file, edited there: ${other.join(', ')}`));
    if (chips.length) nodes.push(h('div', { class: 'chips' }, ...chips));
    return nodes;
}

// A chip for a list adds its first item straight away, a yes/no chip turns it on, and any
// other chip opens the field.
function chip(label, path, field = {}) {
    const first = firstItem(field);
    return h('button', { type: 'button', class: 'chip-add', 'data-open': key(path),
        'data-new': first === undefined ? null : JSON.stringify(first),
        'data-turn-on': field.type === 'bool' ? '1' : null }, `+ ${label}`);
}

function firstItem(field) {
    if (field.type === 'links') return { label: 'Link', file: '' };
    if (field.type === 'lines') return '';
    if (field.type === 'records') return field.blank;
    return undefined;
}

function inUse(path, ctx) {
    const k = key(path);
    const prefix = k.slice(0, -1) + ',';
    return ctx.all || ctx.open.has(k) || [...ctx.errors.keys()].some(e => e === k || e.startsWith(prefix));
}

function empty(value) {
    return value === undefined || value === null || value === '' || value === false || (Array.isArray(value) && !value.length);
}

function fieldEntry(field, parent, path, ctx) {
    if (field.type === 'hidden') return null;
    const value = parent ? parent[field.key] : undefined;
    const fieldPath = [...path, field.key];
    const label = field.label || capitalise(field.key.replace(/_/g, ' '));
    if (field.type === 'records' && field.onlyIfPresent && value === undefined) return null;
    if (!field.required && !field.always && empty(value) && !inUse(fieldPath, ctx)) return { chip: chip(label, fieldPath, field) };
    return { node: renderField(field, value, fieldPath, label, parent, ctx) };
}

function groupEntry(group, parent, path, ctx) {
    const value = parent && parent[group.group];
    const groupPath = [...path, group.group];
    const present = value !== undefined && value !== null;
    // A block that lists its own steps has no use for the exercise / vignette / homework cards.
    if (group.unlessSteps && parent && parent.steps && !present) return null;
    // A field with outside: [...] lives elsewhere in the parent (dates.class on the exercise card).
    const outsideSet = group.fields.some(field => field.outside && !empty(getIn(parent, field.outside)));
    const label = group.label || capitalise(group.group);
    if (!present && !outsideSet && !inUse(groupPath, ctx)) return { chip: chip(label, groupPath) };
    const inner = present || outsideSet ? ctx : { ...ctx, all: true };
    const own = present && typeof value === 'object' ? value : {};
    const outside = group.fields.filter(field => field.outside).map(field => {
        const at = [...path, ...field.outside.slice(0, -1)];
        return fieldEntry({ ...field, key: field.outside[field.outside.length - 1] }, getIn(parent, field.outside.slice(0, -1)), at, inner);
    }).filter(Boolean);
    const rest = renderFields(group.fields.filter(field => !field.outside), own, groupPath, inner);
    const chipRow = rest.length && rest[rest.length - 1].classList.contains('chips') ? rest.pop() : h('div', { class: 'chips' });
    outside.filter(entry => entry.chip).reverse().forEach(entry => chipRow.prepend(entry.chip));
    return { node: h('fieldset', { class: present || outsideSet ? 'group' : 'group absent', 'data-at': key(groupPath) },
        h('legend', {}, label,
            present ? h('button', { class: 'quiet', type: 'button', 'data-action': 'clear', 'data-path': key(groupPath), title: `Remove ${group.group}: and everything in it` }, 'clear') : null),
        group.hint ? h('p', { class: 'hint' }, group.hint) : null,
        ...outside.filter(entry => entry.node).map(entry => entry.node),
        ...rest,
        chipRow.children.length ? chipRow : null,
        errorsFor(groupPath, ctx, true)) };
}

function renderField(field, value, fieldPath, label, parent, ctx) {
    if (field.type === 'records') return renderRecords(field, value, fieldPath, label, ctx);
    if (field.type === 'links') return renderLinks(value, fieldPath, label, ctx);
    if (field.type === 'lines') return renderLines(value, fieldPath, label, field, ctx);
    return h('div', { class: 'row', 'data-at': key(fieldPath) },
        h('label', { for: id(fieldPath) }, label, field.required ? h('span', { class: 'req', title: 'required' }, '*') : null),
        h('div', { class: 'control' }, widget(field, value, fieldPath, ctx, parent),
            field.hint ? h('p', { class: 'hint' }, field.hint) : null,
            errorsFor(fieldPath, ctx)));
}

function widget(field, value, path, ctx, parent = {}) {
    const common = { id: id(path), 'data-path': key(path), 'data-type': field.type, 'data-required': field.required ? '1' : '' };
    const text = value === undefined || value === null ? '' : String(value);
    switch (field.type) {
        case 'long':
            return h('textarea', { ...common, rows: 2, placeholder: field.placeholder || '' }, text);
        case 'int':
            return h('input', { ...common, type: 'number', min: 1, step: 1, value: text, class: 'xs' });
        case 'bool':
            return h('input', { ...common, type: 'checkbox', checked: value === true });
        case 'date':
            return h('span', { class: 'inline' }, h('input', { ...common, type: 'date', value: text }), h('span', { class: 'weekday' }, weekday(text)));
        case 'select':
            return select(common, text, field.options);
        case 'part':
            return select(common, text, ctx.partIds);
        case 'folder': {
            const options = [...ctx.folders];
            if (text && !options.includes(text)) options.unshift(text);
            const match = !text && parent && parent.block ? ctx.folders.find(name => name.startsWith(`${parent.block}_`)) : null;
            return h('span', { class: 'inline' }, select(common, text, options),
                text ? h('button', { class: 'quiet', type: 'button', 'data-action': 'reveal', 'data-file': `${ctx.materials}/${text}`, title: 'Show in Finder' }, 'show') : null,
                match ? h('button', { class: 'quiet', type: 'button', 'data-action': 'set', 'data-path': key(path), 'data-value': JSON.stringify(match) }, `use ${match}`) : null);
        }
        case 'video':
            return h('span', { class: 'inline' },
                h('input', { ...common, type: 'text', value: text, class: 'sm mono', spellcheck: 'false', placeholder: 'YouTube ID' }),
                h('a', { class: 'thumb', href: text ? `https://youtu.be/${text}` : null, target: '_blank', 'data-thumb': key(path) },
                    /^[A-Za-z0-9_-]{11}$/.test(text) ? h('img', { src: `https://i.ytimg.com/vi/${text}/default.jpg`, alt: '' }) : null));
        case 'file':
        case 'base':
            return h('span', { class: 'inline grow' },
                h('input', { ...common, type: 'text', value: text, class: 'mono', spellcheck: 'false', placeholder: field.placeholder || '' }),
                h('span', { class: 'exists', 'data-file': localPath(text) || '', title: '' }));
        default:
            return h('input', { ...common, type: 'text', value: text, class: field.size || '', placeholder: field.placeholder || '' });
    }
}

function select(common, text, options) {
    return h('select', common, h('option', { value: '' }, '—'),
        ...options.map(option => h('option', { value: option, selected: option === text }, option)));
}

function renderLinks(value, path, label, ctx) {
    const items = Array.isArray(value) ? value : [];
    return h('div', { class: 'row', 'data-at': key(path) },
        h('label', {}, label),
        h('div', { class: 'control' },
            h('div', { class: 'links' }, ...items.map((item, index) => {
                const itemPath = [...path, index];
                return h('div', { class: 'link', 'data-at': key(itemPath) },
                    ...LINK.map(field => {
                        const w = widget(field, item && item[field.key], [...itemPath, field.key], ctx);
                        w.setAttribute('title', field.key);
                        return w;
                    }),
                    listButtons(path, index, items.length),
                    errorsFor(itemPath, ctx, true));
            })),
            h('button', { class: 'add', type: 'button', 'data-action': 'add', 'data-path': key(path), 'data-new': JSON.stringify({ label: 'Link', file: '' }) }, '+ link'),
            errorsFor(path, ctx)));
}

function renderLines(value, path, label, field, ctx) {
    const items = Array.isArray(value) ? value : [];
    return h('div', { class: 'row', 'data-at': key(path) },
        h('label', {}, label),
        h('div', { class: 'control' },
            ...items.map((line, index) => h('div', { class: 'line' },
                h('input', { type: 'text', value: String(line), 'data-path': key([...path, index]), 'data-type': 'text', 'data-required': '1' }),
                listButtons(path, index, items.length))),
            h('button', { class: 'add', type: 'button', 'data-action': 'add', 'data-path': key(path), 'data-new': JSON.stringify('') }, '+ line'),
            field.hint ? h('p', { class: 'hint' }, field.hint) : null,
            errorsFor(path, ctx)));
}

function renderRecords(field, value, path, label, ctx) {
    const items = Array.isArray(value) ? value : [];
    return h('fieldset', { class: 'group records', 'data-at': key(path) },
        h('legend', {}, label),
        ...items.map((item, index) => {
            const itemPath = [...path, index];
            return h('div', { class: 'record', 'data-at': key(itemPath) },
                h('div', { class: 'record-head' }, h('span', {}, (field.title && item && field.title(item)) || `${label} ${index + 1}`), listButtons(path, index, items.length)),
                ...renderFields(field.fields, item || {}, itemPath, ctx),
                errorsFor(itemPath, ctx, true));
        }),
        h('button', { class: 'add', type: 'button', 'data-action': 'add', 'data-path': key(path), 'data-new': JSON.stringify(field.blank) }, `+ ${label.toLowerCase().replace(/s$/, '')}`),
        errorsFor(path, ctx));
}

function listButtons(path, index, length) {
    const at = key([...path, index]);
    return h('span', { class: 'list-buttons' },
        h('button', { type: 'button', class: 'quiet', 'data-action': 'up', 'data-path': at, disabled: index === 0, title: 'Move up' }, '↑'),
        h('button', { type: 'button', class: 'quiet', 'data-action': 'down', 'data-path': at, disabled: index === length - 1, title: 'Move down' }, '↓'),
        h('button', { type: 'button', class: 'quiet danger', 'data-action': 'remove', 'data-path': at, title: 'Remove' }, '×'));
}

// Errors that name this exact path; with own=true, only those not claimed by a field below.
function errorsFor(path, ctx, own = false) {
    const messages = ctx.errors.get(key(path)) || [];
    if (!messages.length) return null;
    return h('ul', { class: own ? 'errors own' : 'errors' }, ...messages.map(message => h('li', {}, message)));
}

// ---------------------------------------------------------------- helpers

export function key(path) {
    return JSON.stringify(path);
}

function id(path) {
    return 'f-' + path.join('-').replace(/[^A-Za-z0-9_-]/g, '_');
}

export function localPath(value) {
    if (typeof value !== 'string' || !value.includes('/') || /^[A-Za-z][A-Za-z0-9+.-]*:/.test(value)) return null;
    return value.split(/[?#]/, 1)[0];
}

export function weekday(date) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '')) return '';
    return new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function getIn(value, path) {
    return path.reduce((node, part) => (node === undefined || node === null ? undefined : node[part]), value);
}

function capitalise(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

export function h(tag, attrs, ...children) {
    const node = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([name, value]) => {
        if (value === null || value === undefined || value === false) return;
        if (name === 'value' && (tag === 'input')) node.value = value;
        if (name === 'checked') node.checked = true;
        if (name === 'selected') node.selected = true;
        node.setAttribute(name, value === true ? '' : value);
    });
    children.flat().forEach(child => {
        if (child === null || child === undefined || child === false) return;
        node.append(child instanceof Node ? child : document.createTextNode(String(child)));
    });
    return node;
}
