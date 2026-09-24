// source.js — edits course-content YAML as text, so a save changes only what was edited.
//
// Re-serialising a parsed YAML document keeps its comments but still rewrites the file:
// aligned comments, wrapped lines and list indentation all come out differently. So every
// edit here is a small splice of the source text — replace one scalar, add or drop the
// lines of one key or list item, swap the lines of two items — found through the node
// positions the yaml parser records. After each splice the text is parsed again and must
// equal the intended data; if it does not, the whole document is re-serialised instead
// and the edit reports fallback: true so the page can say the file was reformatted.
//
//   const source = new Source(text)
//   source.set(path, value)          value null / undefined removes the key
//   source.insert(path, index, value)   into the list at path (created if missing)
//   source.remove(path)               a key or a list item; empty parents go with it
//   source.move(path, from, to)       reorder a list
//
// A path is a list of keys and indexes, e.g. ['parts', 'A', 'sections', 3, 'title'].

import * as YAML from './yaml.min.mjs';

// Where a new key goes among its siblings: after the nearest existing key that precedes it here.
const KEY_ORDER = [
    'block', 'checkpoint', 'project', 'id', 'folder', 'code', 'name', 'label', 'kind', 'where', 'sub',
    'nav', 'title', 'brand', 'home', 'tagline', 'introduction', 'text', 'description', 'requirements', 'prompts',
    'file', 'files', 'image', 'button', 'lines', 'optional', 'icon',
    'date', 'when', 'due', 'reattempt', 'reattempt_when', 'next', 'practice', 'steps',
    'episode', 'reading', 'chapter', 'topic', 'video', 'links', 'materials',
    'exercise', 'vignette', 'homework', 'solutions', 'solution_file', 'empty', 'demo',
    'homework_defaults', 'sections', 'dates', 'class', 'recitation', 'extras'
];

const STRINGIFY = { version: '1.1', lineWidth: 0, minContentWidth: 0, flowCollectionPadding: false, singleQuote: true, doubleQuotedAsJSON: true };

export class Source {
    constructor(text) {
        this.load(text);
    }

    load(text) {
        const doc = parse(text);
        if (doc.errors.length) throw new Error(doc.errors[0].message.split('\n')[0]);
        this.text = text.endsWith('\n') ? text : text + '\n';
        this.doc = parse(this.text);
        this.data = this.doc.toJS();
        this.style = detectStyle(this.text, this.doc);
    }

    set(path, value) {
        if (value === undefined || value === null) return this.remove(path);
        if (deepEqual(getIn(this.data, path), value)) return { changed: false };
        return this.apply({ op: 'set', path, value });
    }

    remove(path) {
        if (getIn(this.data, path) === undefined) return { changed: false };
        return this.apply({ op: 'remove', path: pruned(this.data, path) });
    }

    insert(path, index, value) {
        const list = getIn(this.data, path);
        if (!Array.isArray(list)) return this.set(path, [value]);
        return this.apply({ op: 'insert', path, index: Math.max(0, Math.min(index, list.length)), value });
    }

    move(path, from, to) {
        const list = getIn(this.data, path);
        if (!Array.isArray(list) || from === to || to < 0 || to >= list.length) return { changed: false };
        return this.apply({ op: 'move', path, from, to });
    }

    apply(op) {
        const expected = applyToData(structuredClone(this.data), op);
        let text = null;
        try { text = splice(this.text, this.doc, op, expected, this.style); } catch (error) { text = null; }
        let fallback = false;
        if (text === null || !matches(text, expected)) {
            const doc = this.doc.clone();
            applyToDoc(doc, op);
            text = doc.toString({ ...STRINGIFY, indentSeq: this.style.indentSeq });
            fallback = true;
            if (!matches(text, expected)) throw new Error('could not apply the edit');
        }
        this.load(text);
        return { changed: true, fallback };
    }
}

// ---------------------------------------------------------------- data-level semantics

export function getIn(data, path) {
    return path.reduce((node, key) => (node === undefined || node === null ? undefined : node[key]), data);
}

// Removing the last entry of a mapping removes the mapping's own key too, so that clearing
// every date leaves no empty dates: behind. Lists of blocks and the top level are kept.
function pruned(data, path) {
    let result = path;
    while (result.length > 2) {
        const parent = getIn(data, result.slice(0, -1));
        const grand = getIn(data, result.slice(0, -2));
        const size = Array.isArray(parent) ? parent.length : Object.keys(parent || {}).length;
        if (size !== 1 || !isPlainObject(grand)) break;
        result = result.slice(0, -1);
    }
    return result;
}

function applyToData(data, op) {
    const { path } = op;
    if (op.op === 'set') {
        let node = data;
        path.slice(0, -1).forEach((key, i) => {
            if (!isPlainObject(node[key]) && !Array.isArray(node[key])) node[key] = typeof path[i + 1] === 'number' ? [] : {};
            node = node[key];
        });
        node[path[path.length - 1]] = structuredClone(op.value);
    } else if (op.op === 'remove') {
        const parent = getIn(data, path.slice(0, -1));
        const key = path[path.length - 1];
        if (Array.isArray(parent)) parent.splice(key, 1); else delete parent[key];
    } else if (op.op === 'insert') {
        getIn(data, path).splice(op.index, 0, structuredClone(op.value));
    } else if (op.op === 'move') {
        const list = getIn(data, path);
        list.splice(op.to, 0, list.splice(op.from, 1)[0]);
    }
    return data;
}

function applyToDoc(doc, op) {
    if (op.op === 'set') doc.setIn(op.path, doc.createNode(op.value));
    else if (op.op === 'remove') doc.deleteIn(op.path);
    else if (op.op === 'insert') doc.getIn(op.path, true).items.splice(op.index, 0, doc.createNode(op.value));
    else if (op.op === 'move') {
        const items = doc.getIn(op.path, true).items;
        items.splice(op.to, 0, items.splice(op.from, 1)[0]);
    }
}

function matches(text, expected) {
    const doc = parse(text);
    return !doc.errors.length && deepEqual(doc.toJS(), expected);
}

// ---------------------------------------------------------------- text splices

function splice(text, doc, op, expected, style) {
    // The collection the edit changes. Inside a flow collection ([{label: ..., file: ...}]),
    // the outermost flow collection is rewritten whole — it is one line.
    const container = op.op === 'insert' || op.op === 'move' ? op.path : op.path.slice(0, -1);
    for (let depth = 0; depth <= container.length; depth += 1) {
        const node = doc.getIn(container.slice(0, depth), true);
        if (YAML.isCollection(node) && node.flow) {
            const value = getIn(expected, container.slice(0, depth));
            return replace(text, node.range[0], node.range[1], emitFlow(value, style));
        }
    }

    if (op.op === 'set') return spliceSet(text, doc, op.path, op.value, expected, style);
    if (op.op === 'remove') return spliceRemove(text, doc, op.path);
    if (op.op === 'insert') return spliceInsert(text, doc, op.path, op.index, op.value, style);
    if (op.op === 'move') return spliceMove(text, doc, op.path, op.from, op.to);
    return null;
}

function spliceSet(text, doc, path, value, expected, style) {
    const node = doc.getIn(path, true);
    const scalarValue = !isPlainObject(value) && !Array.isArray(value);

    if (YAML.isScalar(node) && node.value !== null && scalarValue) {
        return replaceScalar(text, node, value, ownerColumn(text, doc, path));
    }

    // Find the deepest existing mapping on the path; everything below it is new.
    let depth = path.length - 1;
    while (depth > 0 && !YAML.isMap(doc.getIn(path.slice(0, depth), true))) depth -= 1;
    const map = doc.getIn(path.slice(0, depth), true);
    if (!YAML.isMap(map)) return null;
    const key = path[depth];
    const pair = map.items.find(item => item.key && item.key.value === key);
    const newValue = getIn(expected, path.slice(0, depth + 1));

    if (pair) {
        // Present with no value (exercise: on its own) or with the wrong shape: replace the pair.
        return replacePair(text, map, pair, key, newValue, style);
    }
    return insertPair(text, map, key, newValue, style);
}

function replaceScalar(text, node, value, column) {
    const [start, valueEnd] = node.range;
    const string = typeof value === 'string' ? value : String(value);
    const block = node.type === 'BLOCK_FOLDED' || node.type === 'BLOCK_LITERAL';
    if (typeof value !== 'string' || (!block && !string.includes('\n'))) {
        return replace(text, start, valueEnd, emitInline(value, node.type));
    }
    // A block scalar, or a one-line scalar that has grown a line break and becomes one.
    const headerEnd = lineEnd(text, start);
    let indent = ' '.repeat(column + 2);
    let comment = '';
    let end = valueEnd;
    if (block) {
        const firstLine = text.slice(headerEnd, lineEnd(text, headerEnd));
        const match = firstLine.match(/^( +)\S/);
        if (match) indent = match[1];
        comment = text.slice(start, headerEnd).replace(/^[|>][-+0-9]*/, '').trim();
    } else {
        end = lineEnd(text, valueEnd);
        comment = text.slice(valueEnd, end).trim();
    }
    const body = emitBlockScalar(string, indent);
    return replace(text, start, end, body.header + (comment ? ' ' + comment : '') + '\n' + body.lines);
}

function replacePair(text, map, pair, key, value, style) {
    const [start, end] = pairSpan(text, pair, false);
    if (!onOwnLine(text, pair.key.range[0])) return null;
    const indent = ' '.repeat(column(text, pair.key.range[0]));
    return replace(text, start, end, indent + emitPair(key, value, style, indent));
}

function insertPair(text, map, key, value, style) {
    if (!map.items.length) return null;
    const rank = KEY_ORDER.indexOf(key);
    let after = map.items[map.items.length - 1];
    if (rank >= 0) {
        const earlier = map.items.filter(item => {
            const other = KEY_ORDER.indexOf(item.key && item.key.value);
            return other >= 0 && other < rank;
        });
        if (earlier.length) after = earlier[earlier.length - 1];
    }
    const indent = ' '.repeat(column(text, map.items[0].key.range[0]));
    const at = pairSpan(text, after, false)[1];
    return replace(text, at, at, indent + emitPair(key, value, style, indent));
}

function spliceRemove(text, doc, path) {
    const parent = doc.getIn(path.slice(0, -1), true);
    const key = path[path.length - 1];
    if (YAML.isSeq(parent)) {
        const [start, end] = withBlankLine(text, itemSpan(text, parent.items[key]));
        return replace(text, start, end, '');
    }
    if (!YAML.isMap(parent)) return null;
    const index = parent.items.findIndex(item => item.key && item.key.value === key);
    const pair = parent.items[index];
    if (!onOwnLine(text, pair.key.range[0])) {
        // The first key of a list item (- block: A1): the next key moves up onto the dash line.
        const next = parent.items[index + 1];
        if (!next) return null;
        return replace(text, pair.key.range[0], next.key.range[0], '');
    }
    const [start, end] = pairSpan(text, pair, true);
    return replace(text, start, end, '');
}

function spliceInsert(text, doc, path, index, value, style) {
    const seq = doc.getIn(path, true);
    if (!YAML.isSeq(seq) || !seq.items.length) return null;
    const dash = column(text, lineStart(text, seq.items[0].range[0]) + leadingSpaces(text, seq.items[0].range[0]));
    const indent = ' '.repeat(dash);
    const item = emitItem(value, style, indent);
    const gap = seq.items.slice(1).some(node => node.spaceBefore) ? '\n' : '';
    if (index < seq.items.length) {
        const at = itemSpan(text, seq.items[index])[0];
        return replace(text, at, at, item + gap);
    }
    const at = itemSpan(text, seq.items[seq.items.length - 1])[1];
    return replace(text, at, at, gap + item);
}

function spliceMove(text, doc, path, from, to) {
    const seq = doc.getIn(path, true);
    if (!YAML.isSeq(seq)) return null;
    const spans = seq.items.map(item => itemSpan(text, item));
    const pieces = spans.map(([start, end]) => text.slice(start, end));
    const order = pieces.map((_, i) => i);
    order.splice(to, 0, order.splice(from, 1)[0]);
    let result = text;
    for (let slot = spans.length - 1; slot >= 0; slot -= 1) {
        result = replace(result, spans[slot][0], spans[slot][1], pieces[order[slot]]);
    }
    return result;
}

// ---------------------------------------------------------------- spans

// A list item's lines: from its dash (and any comment lines just above it) to the end of
// its last line. Blank lines around it are separators and stay out of the span.
function itemSpan(text, node) {
    const start = withComments(text, lineStart(text, node.range[0]));
    return [start, lineEnd(text, contentEnd(text, node.range[0], node.range[1]) - 1)];
}

function pairSpan(text, pair, comments) {
    const first = lineStart(text, pair.key.range[0]);
    const start = comments ? withComments(text, first) : first;
    const value = pair.value && pair.value.range ? pair.value.range : pair.key.range;
    const last = Math.max(pair.key.range[1], value[1]);
    return [start, lineEnd(text, contentEnd(text, pair.key.range[0], last) - 1)];
}

function withComments(text, start) {
    const indent = leadingSpaces(text, start);
    let at = start;
    while (at > 0) {
        const previous = lineStart(text, at - 1);
        const line = text.slice(previous, at);
        if (!/^\s*#/.test(line) || leadingSpaces(text, previous) !== indent) break;
        at = previous;
    }
    return at;
}

// Deleting a list item also deletes the blank line that separated it, before if there is one.
function withBlankLine(text, [start, end]) {
    const blank = /^[ \t]*\n/;
    if (start > 0) {
        const previous = lineStart(text, start - 1);
        if (blank.test(text.slice(previous, start))) return [previous, end];
    }
    const match = text.slice(end).match(blank);
    return match ? [start, end + match[0].length] : [start, end];
}

function contentEnd(text, start, end) {
    let at = end;
    while (at > start && /\s/.test(text[at - 1])) at -= 1;
    return at;
}

function lineStart(text, at) {
    return text.lastIndexOf('\n', at - 1) + 1;
}

function lineEnd(text, at) {
    const newline = text.indexOf('\n', at);
    return newline < 0 ? text.length : newline + 1;
}

function column(text, at) {
    return at - lineStart(text, at);
}

function leadingSpaces(text, at) {
    return text.slice(lineStart(text, at)).match(/^ */)[0].length;
}

function onOwnLine(text, at) {
    return /^ *$/.test(text.slice(lineStart(text, at), at));
}

// The column a scalar's block content indents from: its key's, or its list dash's.
function ownerColumn(text, doc, path) {
    const parent = doc.getIn(path.slice(0, -1), true);
    const key = path[path.length - 1];
    if (YAML.isMap(parent)) {
        const pair = parent.items.find(item => item.key && item.key.value === key);
        if (pair) return column(text, pair.key.range[0]);
    }
    const node = doc.getIn(path, true);
    return leadingSpaces(text, node.range[0]);
}

function replace(text, start, end, insert) {
    return text.slice(0, start) + insert + text.slice(end);
}

// ---------------------------------------------------------------- emitting new text

function detectStyle(text, doc) {
    // Lists written flow ([a, b]) under a key stay flow when that key is written anew.
    const tally = {};
    YAML.visit(doc, {
        Pair(_, pair) {
            if (!YAML.isSeq(pair.value) || !pair.key) return;
            const counts = tally[pair.key.value] || (tally[pair.key.value] = { flow: 0, block: 0 });
            counts[pair.value.flow ? 'flow' : 'block'] += 1;
        }
    });
    const flowKeys = new Set(Object.keys(tally).filter(key => tally[key].flow > tally[key].block));
    // A block list under a key is either indented past it or level with it.
    const levels = [...text.matchAll(/^( *)[^\s#-][^\n]*:[ \t]*\n\1(  )?- /gm)];
    const indented = levels.filter(match => match[2]).length;
    return { flowKeys, indentSeq: indented >= levels.length - indented };
}

function makeDoc(value, style, blocks = true) {
    const doc = new YAML.Document(value, { version: '1.1' });
    YAML.visit(doc, {
        Pair(_, pair) {
            if (pair.key && style.flowKeys.has(pair.key.value) && YAML.isSeq(pair.value)) pair.value.flow = true;
        },
        Scalar(_, node) {
            // Line breaks: a folded block where blocks are allowed, else "\n" escapes on one line.
            if (typeof node.value === 'string' && node.value.includes('\n')) node.type = blocks ? 'BLOCK_FOLDED' : 'QUOTE_DOUBLE';
        }
    });
    return doc;
}

function emitPair(key, value, style, indent) {
    const out = makeDoc({ [key]: value }, style).toString({ ...STRINGIFY, indentSeq: style.indentSeq });
    return reindent(out, indent);
}

function emitItem(value, style, indent) {
    const out = makeDoc([value], style).toString({ ...STRINGIFY, indentSeq: style.indentSeq });
    return indent + reindent(out, indent);
}

function emitFlow(value, style) {
    const doc = makeDoc(value, style, false);
    if (YAML.isCollection(doc.contents)) doc.contents.flow = true;
    return doc.toString(STRINGIFY).trimEnd();
}

// Every line after the first gains the indent; the caller places the first.
function reindent(out, indent) {
    return out.replace(/\n(?=.)/g, '\n' + indent);
}

function emitInline(value, type) {
    if (typeof value !== 'string') return String(value);
    if (type === 'QUOTE_SINGLE') return `'${value.replace(/'/g, "''")}'`;
    if (type === 'QUOTE_DOUBLE') return JSON.stringify(value);
    return YAML.stringify(value, STRINGIFY).trimEnd();
}

// >- folds single line breaks into spaces, so each line break in the value becomes a blank
// line. Text whose lines start or end with spaces cannot be folded and is kept literally.
function emitBlockScalar(value, indent) {
    const trailing = value.match(/\n*$/)[0].length;
    const chomp = trailing === 0 ? '-' : trailing === 1 ? '' : '+';
    const core = value.slice(0, value.length - trailing);
    const lines = core.split('\n');
    const literal = lines.some(line => /^\s|\s$/.test(line) && line.trim() !== '');
    let body;
    if (literal) {
        body = lines;
    } else {
        body = [];
        let run = 0;
        lines.forEach((line, i) => {
            if (line === '') { run += 1; return; }
            if (i > 0) body.push(...Array(run === 0 ? 1 : run + 1).fill(''));
            run = 0;
            body.push(line);
        });
        body = body.slice(body[0] === '' ? 1 : 0);
    }
    const header = (literal ? '|' : '>') + chomp;
    const text = body.map(line => (line === '' ? '' : indent + line)).join('\n') + '\n' + '\n'.repeat(Math.max(0, trailing - 1));
    return { header, lines: text };
}

// ---------------------------------------------------------------- utilities

function parse(text) {
    return YAML.parseDocument(text, { prettyErrors: false });
}

function isPlainObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function deepEqual(a, b) {
    if (a === b) return true;
    if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false;
    if (Array.isArray(a) !== Array.isArray(b)) return false;
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    return keysA.length === keysB.length && keysA.every(key => deepEqual(a[key], b[key]));
}
