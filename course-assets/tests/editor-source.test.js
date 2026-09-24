'use strict';

// Tests for editor/source.js, the text-preserving YAML editor behind edit-course, run with:
//   node --test course-assets/tests/*.test.js
// Each edit must land as a splice (no whole-file reformat) and leave every other line alone.

const assert = require('node:assert/strict');
const test = require('node:test');

const SITE = `# A header comment that must survive.
course:
  code: ECON 0100
  title: Microeconomics
  brand: [MICRO, ECON]
  reading: Reading/Ch_{nn}.pdf    # an aligned comment
  materials: Blocks               # another

parts:
  A:
    title: The Core Economic Idea
    tagline: better choices
    introduction: >-
      Part A explores one of the most profound insights.
    sections:
      - block: A0
        folder: A0_Welcome
        nav: Econ
        title: What is microeconomics?
        description: >-
          Microeconomics is about decisions.
        episode:
          video: qMDU1QYKYss
          links: [{label: Animations, file: Blocks/A0_Welcome/media/, icon: fa fa-desktop}]
          description: Economics is not *about* money.
        vignette:
          description: Practice
        dates:
          class: '2026-08-26'

      # A comment that belongs to A1.
      - block: A1
        nav: PPF
        title: The PPF
        description: The PPF shows what is attainable.
        episode:
          description: The landscape
        exercise:
        vignette:
          description: PPF practice problems

      - checkpoint:
          description: Checkpoint A
          demo:
            video: zkn0CXaNOJY
`;

const BLOCK_LEVEL = `course:
  code: ECON 0150
  title: Data
  brand:
  - ECONOMIC
  - DATA
parts:
  '1':
    title: One
    tagline: t
    introduction: Before exploring relationships, we start
      by understanding what each variable contains.
    sections:
    - block: '1.1'
      nav: Categorical
      title: Categorical Data
      description: Bar charts.
      episode:
        description: Summaries
        links:
        - label: Slides
          file: parts/1.pdf
      steps:
      - name: Exercise 1.1
        kind: exercise
`;

let Source;
test.before(async () => {
    ({ Source } = await import('../editor/source.js'));
});

// Lines of b that are not in a, and of a not in b: a rough measure of what an edit touched.
function changed(a, b) {
    const left = a.split('\n');
    const right = b.split('\n');
    const count = (lines, other) => {
        const pool = new Map();
        other.forEach(line => pool.set(line, (pool.get(line) || 0) + 1));
        return lines.filter(line => {
            const n = pool.get(line) || 0;
            if (n) { pool.set(line, n - 1); return false; }
            return true;
        });
    };
    return { added: count(right, left), removed: count(left, right) };
}

function edit(text, fn) {
    const source = new Source(text);
    const result = fn(source);
    assert.equal(result.fallback, false, 'the edit fell back to reformatting the file');
    return { source, diff: changed(text, source.text) };
}

test('changing a plain scalar touches one line', () => {
    const { source, diff } = edit(SITE, s => s.set(['parts', 'A', 'sections', 1, 'title'], 'The production possibility frontier'));
    assert.deepEqual(diff.added, ['        title: The production possibility frontier']);
    assert.equal(diff.removed.length, 1);
    assert.equal(source.data.parts.A.sections[1].title, 'The production possibility frontier');
});

test('a value that needs quoting gets quoted, and dates stay strings', () => {
    let { source } = edit(SITE, s => s.set(['parts', 'A', 'sections', 1, 'title'], 'Choice: a model'));
    assert.match(source.text, /title: 'Choice: a model'/);
    ({ source } = edit(SITE, s => s.set(['parts', 'A', 'sections', 0, 'dates', 'class'], '2026-09-01')));
    assert.match(source.text, /class: '2026-09-01'/);
    ({ source } = edit(SITE, s => s.set(['parts', 'A', 'sections', 0, 'dates', 'recitation'], '2026-09-04')));
    assert.match(source.text, /recitation: '2026-09-04'/);
});

test('aligned comments survive an edit on their line', () => {
    const { source } = edit(SITE, s => s.set(['course', 'reading'], 'Readings/Ch_{nn}.pdf'));
    assert.match(source.text, /reading: Readings\/Ch_\{nn\}\.pdf {4}# an aligned comment/);
    assert.match(source.text, /^# A header comment that must survive\./);
});

test('a folded block keeps its style and gains paragraphs', () => {
    const { source, diff } = edit(SITE, s => s.set(['parts', 'A', 'introduction'], 'First paragraph.\nSecond paragraph.'));
    assert.match(source.text, / {4}introduction: >-\n {6}First paragraph\.\n\n {6}Second paragraph\.\n {4}sections:/);
    assert.equal(diff.removed.length, 1);
    assert.equal(source.data.parts.A.introduction, 'First paragraph.\nSecond paragraph.');
});

test('a one-line value that gains a line break becomes a block', () => {
    const { source } = edit(SITE, s => s.set(['parts', 'A', 'sections', 1, 'description'], 'One.\nTwo.'));
    assert.equal(source.data.parts.A.sections[1].description, 'One.\nTwo.');
    assert.match(source.text, /description: >-\n {10}One\.\n\n {10}Two\.\n/);
});

test('a new key lands in its conventional place', () => {
    const { source, diff } = edit(SITE, s => s.set(['parts', 'A', 'sections', 1, 'folder'], 'A1_The_PPF'));
    assert.deepEqual(diff.added, ['        folder: A1_The_PPF']);
    assert.deepEqual(diff.removed, []);
    assert.match(source.text, /- block: A1\n {8}folder: A1_The_PPF\n {8}nav: PPF/);
});

test('a key under an empty one (exercise:) fills it in', () => {
    const { source } = edit(SITE, s => s.set(['parts', 'A', 'sections', 1, 'exercise', 'video'], 'po4kip5m_QY'));
    assert.match(source.text, / {8}exercise:\n {10}video: po4kip5m_QY\n {8}vignette:/);
});

test('a new group is written as a block of keys', () => {
    const { source } = edit(SITE, s => s.set(['parts', 'A', 'sections', 1, 'dates', 'class'], '2026-08-26'));
    assert.match(source.text, / {8}dates:\n {10}class: '2026-08-26'\n/);
});

test('removing the last key of a group removes the group', () => {
    const { source, diff } = edit(SITE, s => s.remove(['parts', 'A', 'sections', 0, 'dates', 'class']));
    assert.equal(source.data.parts.A.sections[0].dates, undefined);
    assert.equal(diff.added.length, 0);
    assert.equal(diff.removed.length, 2);
});

test('links inside a flow list are rewritten on their one line', () => {
    const path = ['parts', 'A', 'sections', 0, 'episode', 'links'];
    let { source, diff } = edit(SITE, s => s.insert(path, 1, { label: 'Notes', file: 'Blocks/A0_Welcome/notes.pdf' }));
    assert.equal(diff.removed.length, 1);
    assert.deepEqual(diff.added, ['          links: [{label: Animations, file: Blocks/A0_Welcome/media/, icon: fa fa-desktop}, {label: Notes, file: Blocks/A0_Welcome/notes.pdf}]']);
    ({ source } = edit(source.text, s => s.set([...path, 1, 'label'], 'Lecture notes')));
    assert.equal(source.data.parts.A.sections[0].episode.links[1].label, 'Lecture notes');
    ({ source } = edit(source.text, s => s.remove([...path, 0])));
    assert.equal(source.data.parts.A.sections[0].episode.links.length, 1);
});

test('new links follow the file’s own style', () => {
    const { source } = edit(SITE, s => s.set(['parts', 'A', 'sections', 1, 'episode', 'links'], [{ label: 'Slides', file: 'x.pdf' }]));
    assert.match(source.text, /links: \[\{label: Slides, file: x\.pdf\}\]/);
    const other = edit(BLOCK_LEVEL, s => s.insert(['parts', '1', 'sections', 0, 'episode', 'links'], 1, { label: 'Notes', file: 'n.pdf' }));
    assert.match(other.source.text, / {8}- label: Slides\n {10}file: parts\/1\.pdf\n {8}- label: Notes\n {10}file: n\.pdf\n/);
});

test('a new block is inserted with the blank line blocks are separated by', () => {
    const block = { block: 'A2', nav: 'New', title: 'New block', description: 'About it.', episode: { description: '' }, vignette: { description: '' } };
    const { source, diff } = edit(SITE, s => s.insert(['parts', 'A', 'sections'], 2, block));
    assert.equal(diff.removed.length, 0);
    assert.match(source.text, /PPF practice problems\n\n {6}- block: A2\n {8}nav: New\n[\s\S]*?\n\n {6}- checkpoint:/);
    assert.match(source.text, /episode:\n {10}description: ''/);
});

test('removing a block takes its comment and one separating blank line', () => {
    const { source, diff } = edit(SITE, s => s.remove(['parts', 'A', 'sections', 1]));
    assert.equal(diff.added.length, 0);
    assert.ok(!source.text.includes('A comment that belongs to A1'));
    assert.match(source.text, /class: '2026-08-26'\n\n {6}- checkpoint:/);
});

test('moving a block swaps whole blocks, comments included', () => {
    const { source, diff } = edit(SITE, s => s.move(['parts', 'A', 'sections'], 1, 0));
    assert.deepEqual(diff.added, []);
    assert.deepEqual(diff.removed, []);
    assert.equal(source.data.parts.A.sections[0].block, 'A1');
    assert.match(source.text, /sections:\n {6}# A comment that belongs to A1\.\n {6}- block: A1/);
});

test('level-with-key lists keep their style and multi-line plain scalars can be replaced', () => {
    let { source } = edit(BLOCK_LEVEL, s => s.insert(['parts', '1', 'sections', 0, 'steps'], 1, { name: 'Homework 1.1', kind: 'homework' }));
    assert.match(source.text, / {6}- name: Exercise 1\.1\n {8}kind: exercise\n {6}- name: Homework 1\.1\n {8}kind: homework\n/);
    ({ source } = edit(BLOCK_LEVEL, s => s.set(['parts', '1', 'introduction'], 'Shorter.')));
    assert.match(source.text, / {4}introduction: Shorter\.\n {4}sections:/);
    ({ source } = edit(BLOCK_LEVEL, s => s.set(['course', 'brand', 1], 'DATA SCIENCE')));
    assert.match(source.text, /  - DATA SCIENCE\n/);
});

test('removing the first key of a list item pulls the next key onto the dash', () => {
    const { source } = edit(BLOCK_LEVEL, s => s.remove(['parts', '1', 'sections', 0, 'steps', 0, 'name']));
    assert.match(source.text, / {6}- kind: exercise\n/);
});

test('clearing a value removes it, and no-op edits report no change', () => {
    const source = new Source(SITE);
    assert.equal(source.set(['parts', 'A', 'title'], 'The Core Economic Idea').changed, false);
    assert.equal(source.remove(['parts', 'A', 'nope']).changed, false);
    source.remove(['parts', 'A', 'sections', 1, 'nav']);
    assert.equal(source.data.parts.A.sections[1].nav, undefined);
    source.set(['parts', 'A', 'sections', 1, 'title'], '');
    assert.equal(source.data.parts.A.sections[1].title, '');
});
