'use strict';

// Regression tests for check-course and course-schema.js, run with:
//   node --test course-assets/tests/*.test.js
// Each test builds a throwaway site in a temp directory in one of the two dialects the
// courses use -- the conventional exercise/vignette/homework triad with folder discovery
// (econ-0100), and explicit steps with a MiniExam checkpoint and a project (econ-0150) --
// then runs the checker on it.

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const ASSETS = path.resolve(__dirname, '..');
const CHECKER = path.join(ASSETS, 'check-course');
const schema = require(path.join(ASSETS, 'course-schema.js'));

const TRIAD = `course:
  code: ECON 0100
  title: Microeconomics
  brand: [MICRO, ECON]
  nav:
    - label: Syllabus
      file: Syllabus/Syllabus.pdf
      button: true
  reading: Reading/Ch_{nn}.pdf
  materials: Blocks
parts:
  A:
    title: The Core Idea
    tagline: better choices
    introduction: Part A introduces the course.
    sections:
      - block: A1
        folder: A1_The_PPF
        nav: PPF
        title: The frontier
        description: What is attainable.
        episode:
          video: dQw4w9WgXcQ
          description: The landscape of what's possible
        reading:
          chapter: 2
          topic: Thinking like an economist
        vignette:
          description: PPF practice
        homework:
          due: Sunday
      - checkpoint:
          date: '2026-09-09'
          description: Covers Part A.
          demo:
            video: dQw4w9WgXcQ
          reattempt: TBA
`;

const STEPS = `course:
  code: ECON 0150
  title: Economic Data Analysis
  brand: [ECONOMIC, DATA, ANALYSIS]
  home: econ-0150.html
  nav:
    - label: Projects
      file: projects.html
  checkpoint: MiniExam
parts:
  '1':
    title: Univariate EDA
    tagline: Summarize single variables
    introduction: Part 1 introduces the tools.
    sections:
      - block: '1.1'
        nav: Categorical
        title: Categorical Data
        description: Bar charts.
        episode:
          name: Categorical Variables
          description: Summarizing categorical variables
          video: dQw4w9WgXcQ
          links:
            - label: Slides
              file: parts/part-1-1/concept_1_1.pdf
        steps:
          - name: Exercise 1.1
            kind: exercise
            sub: Coffee Shop Locations
            links:
              - label: Notebook
                file: https://colab.research.google.com/example
          - name: Livestream 1.1
            kind: livestream
            video: dQw4w9WgXcQ
          - name: Homework 1.1
            kind: homework
      - checkpoint:
          description: MiniExam 1 covers Part 1.
          demo:
            name: Demo 1 Walkthrough
            video: dQw4w9WgXcQ
            description: Practice exam.
            links:
              - label: Demo
                file: ME/ME_1/ME_1_Demo.pdf
          next: 2
  '2':
    title: Final
    tagline: Tie it together
    introduction: Part 2.
    sections:
      - project:
          id: final-project
          nav: Final Project
          title: Final Project
          description: Here's where we tie it all together.
          prompts:
            - label: Research Question.
              kind: research
              text: What is interesting to you?
          requirements:
            - Prepare a short presentation.
          links:
            - label: Guidelines
              file: projects/project_guidelines.pdf
`;

function shell(partId) {
    return `<!doctype html><html><head><script>var base='https://tayweid.github.io/course-assets/';</script>
<script defer src="course-content.yaml.js"></script></head>
<body><div class="wrapper"><div class="left_div" data-course-left-nav></div>
<main class="content" data-course-part="${partId}"><div data-course-description></div><div data-course-output></div></main>
<div class="right_div" data-course-right-nav></div></div></body></html>`;
}

function makeSite(t, yamlText, files) {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'course-'));
    t.after(() => fs.rmSync(root, { recursive: true, force: true }));
    fs.writeFileSync(path.join(root, 'course-content.yaml.js'), `window.COURSE_CONTENT_YAML = String.raw\`\n${yamlText.trimEnd()}\n\`;\n`);
    fs.writeFileSync(path.join(root, 'index.html'), '<!doctype html><meta http-equiv="refresh" content="0; url=part-a.html">');
    files.forEach(file => {
        if (file.endsWith('/')) { fs.mkdirSync(path.join(root, file), { recursive: true }); return; }
        fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
        fs.writeFileSync(path.join(root, file), 'x');
    });
    return root;
}

function triadSite(t, yamlText = TRIAD, extraFiles = []) {
    const root = makeSite(t, yamlText, ['Syllabus/Syllabus.pdf', 'Reading/Ch_02.pdf', 'Blocks/A1_The_PPF/', ...extraFiles]);
    fs.writeFileSync(path.join(root, 'part-a.html'), shell('A'));
    return root;
}

function stepsSite(t, yamlText = STEPS) {
    const root = makeSite(t, yamlText, ['econ-0150.html', 'projects.html', 'parts/part-1-1/concept_1_1.pdf', 'ME/ME_1/ME_1_Demo.pdf', 'projects/project_guidelines.pdf']);
    fs.writeFileSync(path.join(root, 'part-1.html'), shell('1'));
    fs.writeFileSync(path.join(root, 'part-2.html'), shell('2'));
    return root;
}

function run(root) {
    return spawnSync(process.execPath, [CHECKER, root], { encoding: 'utf8' });
}

function passes(result) {
    assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
}

function failsWith(result, fragment) {
    assert.notEqual(result.status, 0, `expected a failure mentioning ${fragment}\n${result.stdout}`);
    assert.match(result.stderr, new RegExp(fragment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), result.stderr);
}

test('accepts the conventional-triad dialect', t => passes(run(triadSite(t))));
test('accepts the explicit-steps dialect with a checkpoint and a project', t => passes(run(stepsSite(t))));

test('reports every problem at once, with paths', t => {
    const bad = TRIAD.replace('video: dQw4w9WgXcQ\n          description', 'video: short\n          description').replace('chapter: 2', 'chapter: 9');
    const result = run(triadSite(t, bad));
    failsWith(result, 'parts.A.sections[0].episode.video: must be the eleven-character YouTube video ID');
    failsWith(result, 'parts.A.sections[0].reading.chapter: missing local file Reading/Ch_09.pdf');
});

const NOTE = TRIAD.replace('  nav:\n', "  nav:\n    - label: Office Hours\n      lines: ['*Taylor* Wed 2:30-3:30, Posvar 4702', 'Zoe: Thu 11-12']\n");
test('accepts a nav note made of text lines', t => passes(run(triadSite(t, NOTE))));
test('rejects a nav note that also links', t => failsWith(run(triadSite(t, NOTE.replace("'Zoe: Thu 11-12']", "'Zoe: Thu 11-12']\n      file: Syllabus/Syllabus.pdf"))), 'neither file nor button'));
test('rejects a nav note with no lines', t => failsWith(run(triadSite(t, NOTE.replace("['*Taylor* Wed 2:30-3:30, Posvar 4702', 'Zoe: Thu 11-12']", '[]'))), 'needs at least one line'));
test('rejects a nav entry that neither links nor notes', t => failsWith(run(triadSite(t, TRIAD.replace('      file: Syllabus/Syllabus.pdf\n', ''))), 'course.nav[0].file: is required'));
test('rejects a backtick inside the YAML', t => failsWith(run(triadSite(t, TRIAD.replace('better choices', 'better `choices`'))), 'contains a backtick'));
test('rejects malformed YAML', t => failsWith(run(triadSite(t, "parts:\n  A: [\n")), 'invalid YAML'));
test('rejects an unknown field', t => failsWith(run(triadSite(t, TRIAD.replace('nav: PPF', 'nav: PPF\n        colour: red'))), 'unknown field colour'));
test('rejects HTML in text', t => failsWith(run(triadSite(t, TRIAD.replace('What is attainable.', '<b>What</b> is attainable.'))), 'must not contain HTML'));
test('rejects a missing link target', t => failsWith(run(stepsSite(t, STEPS.replace('concept_1_1.pdf', 'concept_9_9.pdf'))), 'missing local file parts/part-1-1/concept_9_9.pdf'));
test('rejects a non-https external link', t => failsWith(run(stepsSite(t, STEPS.replace('https://colab', 'http://colab'))), 'external links must be https'));
test('rejects a step with neither kind nor where', t => failsWith(run(stepsSite(t, STEPS.replace('            kind: exercise\n', ''))), 'needs a kind'));
test('rejects an unknown step kind', t => failsWith(run(stepsSite(t, STEPS.replace('kind: exercise', 'kind: quiz'))), 'must be one of exercise'));
test('rejects a checkpoint next that names a missing part', t => failsWith(run(stepsSite(t, STEPS.replace('next: 2', 'next: 7'))), 'names Part 7'));
test('rejects a duplicate block across parts', t => {
    const dup = STEPS.replace("      - project:", "      - block: '1.1'\n        nav: Dup\n        title: Dup\n        description: Dup.\n        episode:\n          description: Dup\n        steps: []\n      - project:");
    failsWith(run(stepsSite(t, dup)), 'duplicates block 1.1');
});
test('requires folder once the block has a directory', t => failsWith(run(triadSite(t, TRIAD.replace('        folder: A1_The_PPF\n', ''))), 'missing folder'));
test('requires the vignette unless the block lists steps or opts out', t => failsWith(run(triadSite(t, TRIAD.replace('        vignette:\n          description: PPF practice\n', ''))), 'vignette: is required'));
test('rejects a missing shell', t => {
    const root = triadSite(t);
    fs.rmSync(path.join(root, 'part-a.html'));
    failsWith(run(root), 'part-a.html: missing page for Part A');
});
test('rejects a shell that hard-codes blocks', t => {
    const root = triadSite(t);
    fs.appendFileSync(path.join(root, 'part-a.html'), '<div data-course-block="A1"></div>');
    failsWith(run(root), 'must not hard-code course blocks');
});

test('a solutions file is only checked when solutions are switched on', t => {
    const off = TRIAD.replace('          description: PPF practice\n', '          description: PPF practice\n          solution_file: Vignettes/nope.pdf\n');
    passes(run(triadSite(t, off)));
    const on = off.replace('solution_file: Vignettes/nope.pdf', 'solutions: true\n          solution_file: Vignettes/nope.pdf');
    failsWith(run(triadSite(t, on)), 'missing local file Vignettes/nope.pdf');
});

test('schema helpers agree with the page ids the sites already use', () => {
    assert.equal(schema.blockElementId('A1'), 'part-a1');
    assert.equal(schema.blockElementId('1.1'), 'part-11');
    assert.equal(schema.checkpointElementId({ course: { checkpoint: 'MiniExam' } }), 'miniexam');
    assert.equal(schema.checkpointElementId({ course: {} }), 'checkpoint');
    assert.equal(schema.readingFile({ course: { reading: 'Reading/Ch_{nn}.pdf' } }, 3), 'Reading/Ch_03.pdf');
    assert.deepEqual(
        schema.blockCandidates({ course: { materials: 'Blocks' } }, { block: 'A1', folder: 'A1_The_PPF', vignette: { solutions: true }, homework: { file: 'A1' } }),
        [
            ['exercise', 'Blocks/A1_The_PPF/Exercise/Exercise_A1.pdf'],
            ['homework', 'Blocks/A1_The_PPF/Homework/Homework_A1.pdf'],
            ['vignette', 'Blocks/A1_The_PPF/Vignette/Vignette_A1.pdf'],
            ['vignette_sols', 'Blocks/A1_The_PPF/Vignette/Vignette_A1_sols.pdf']
        ]
    );
});
