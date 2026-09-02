/* course-schema.js — the one description of course-content.yaml.js.
 *
 * Shared by the browser renderer (course-page.js) and the Node checker (check-course), so
 * the two can never disagree about what the content file may contain. Pure: no DOM, no
 * filesystem. The format itself is documented in COURSE_CONTENT.md beside this file.
 *
 *   CourseSchema.validate(data)        -> { course, errors }   every problem, not just the first
 *   CourseSchema.localFiles(course)    -> [{ path, at }]       every local file the YAML names outright
 *   CourseSchema.blockCandidates(...)  -> [[key, path], ...]   conventional PDFs a block may have
 */
(function (root, factory) {
    if (typeof module === 'object' && module.exports) module.exports = factory();
    else root.CourseSchema = factory();
}(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    // A step's kind supplies its default "where" label; livestream also draws it as an aside.
    const STEP_KINDS = { exercise: 'in class', vignette: 'recitation', homework: 'home', livestream: 'optional' };
    const PROMPT_KINDS = ['research', 'data', 'methods', 'finding'];

    function present(value) {
        return value !== undefined && value !== null;
    }

    function isRecord(value) {
        return value !== null && typeof value === 'object' && !Array.isArray(value);
    }

    function explicitPath(value) {
        return typeof value === 'string' && value.includes('/');
    }

    function externalUrl(value) {
        return typeof value === 'string' && /^[A-Za-z][A-Za-z0-9+.-]*:/.test(value);
    }

    // #part-a1 for A1, #part-11 for 1.1: the lowercase id with punctuation dropped.
    function blockElementId(blockId) {
        return `part-${String(blockId).toLowerCase().replace(/[^a-z0-9]/g, '')}`;
    }

    function checkpointWord(course) {
        return (course && course.course && course.course.checkpoint) || 'Checkpoint';
    }

    function checkpointElementId(course) {
        return checkpointWord(course).toLowerCase().replace(/[^a-z0-9]/g, '');
    }

    function readingFile(course, chapter) {
        const pattern = course && course.course && course.course.reading;
        if (!pattern) return null;
        return pattern.replace('{nn}', String(chapter).padStart(2, '0'));
    }

    // <materials>/<folder>/<Type>/<Type>_<base>[_sols].pdf, e.g. Blocks/A1_The_PPF/Exercise/Exercise_A1.pdf
    function conventionalPath(materials, folder, type, base, suffix) {
        const name = [type, base, suffix].filter(Boolean).join('_');
        return `${materials}/${folder}/${type}/${name}.pdf`;
    }

    // The conventional files a block may have on disk, as [key, path] pairs. Exercise and
    // vignette are always candidates; homework and every solutions file only when the YAML
    // asks (solutions are opt-in, so an answer key on disk never surfaces by itself).
    function blockCandidates(course, section) {
        const materials = course && course.course && course.course.materials;
        const blockId = section.block;
        const folder = section.folder;
        if (!materials || !blockId || !folder || section.steps) return [];
        const wanted = [];
        const exercise = section.exercise || {};
        if (!exercise.links) wanted.push(['exercise', conventionalPath(materials, folder, 'Exercise', blockId)]);
        const homework = section.homework || {};
        if (!homework.links) {
            if (homework.file && !explicitPath(homework.file)) {
                wanted.push(['homework', conventionalPath(materials, folder, 'Homework', blockId)]);
            }
            if (homework.solutions === true && !explicitPath(homework.solution_file)) {
                wanted.push(['homework_sols', conventionalPath(materials, folder, 'Homework', blockId, 'sols')]);
            }
        }
        const vignette = section.vignette || {};
        if (!vignette.links && vignette.files !== false) {
            const base = typeof vignette.files === 'string' ? vignette.files : blockId;
            if (!explicitPath(base)) {
                wanted.push(['vignette', conventionalPath(materials, folder, 'Vignette', base)]);
                if (vignette.solutions === true && !explicitPath(vignette.solution_file)) {
                    wanted.push(['vignette_sols', conventionalPath(materials, folder, 'Vignette', base, 'sols')]);
                }
            }
        }
        return wanted;
    }

    function validate(data) {
        const errors = [];
        const fail = (path, message) => { errors.push(`${path}: ${message}`); };

        function record(value, path) {
            if (!isRecord(value)) { fail(path, 'must be a mapping'); return null; }
            return value;
        }
        function keys(value, path, required, optional) {
            if (!isRecord(value)) return;
            required.forEach(key => { if (!(key in value)) fail(path, `missing required field ${key}`); });
            Object.keys(value).forEach(key => {
                if (!required.includes(key) && !optional.includes(key)) fail(path, `unknown field ${key}`);
            });
        }
        function text(value, path, options = {}) {
            if (value === undefined || value === null) {
                if (!options.optional) fail(path, 'is required');
                return false;
            }
            if (typeof value !== 'string' && typeof value !== 'number') { fail(path, 'must be text'); return false; }
            const string = String(value);
            if (!options.allowEmpty && string.trim() === '') { fail(path, 'must not be empty'); return false; }
            if (/<[A-Za-z/!]/.test(string)) { fail(path, 'must not contain HTML; put words between *asterisks* for italics'); return false; }
            return true;
        }
        function list(value, path, options = {}) {
            if (value === undefined || value === null) {
                if (!options.optional) fail(path, 'is required');
                return [];
            }
            if (!Array.isArray(value)) { fail(path, 'must be a list'); return []; }
            return value;
        }
        function boolean(value, path) {
            if (value !== undefined && typeof value !== 'boolean') fail(path, 'must be true or false');
        }
        function video(value, path, options = {}) {
            if (value === undefined || value === null) {
                if (!options.optional) fail(path, 'is required');
                return;
            }
            if (typeof value !== 'string' || !/^[A-Za-z0-9_-]{11}$/.test(value)) {
                fail(path, `must be the eleven-character YouTube video ID, not ${JSON.stringify(value)}`);
            }
        }
        function date(value, path) {
            if (value === undefined) return;
            if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) fail(path, "must be a quoted yyyy-mm-dd date, such as '2026-09-04'");
        }
        function icon(value, path) {
            if (value === undefined) return;
            if (typeof value !== 'string' || !/^(?:fa )?fa-[a-z0-9-]+$/.test(value)) fail(path, 'must be a Font Awesome class such as fa-file-pdf-o');
        }
        function url(value, path) {
            if (!text(value, path)) return;
            const href = String(value);
            if (/[\u0000-\u001F\u007F]/.test(href) || href.includes('\\')) { fail(path, 'must not contain control characters or backslashes'); return; }
            if (externalUrl(href)) {
                if (!/^https:\/\/\S+$/i.test(href)) fail(path, 'external links must be https URLs');
                return;
            }
            if (href.startsWith('/')) { fail(path, 'must be a path relative to the site root, without a leading slash'); return; }
            const pathOnly = href.split(/[?#]/, 1)[0];
            if (pathOnly === '') { fail(path, 'must name a file'); return; }
            if (pathOnly.split('/').some(segment => segment === '..' || segment === '.')) fail(path, 'must not step outside the site');
        }
        // file: A1 is a conventional base the page resolves itself; anything with a slash is a path.
        function fileOrBase(value, path) {
            if (value === undefined || value === false) return;
            if (explicitPath(value) || externalUrl(value)) url(value, path);
            else text(value, path);
        }
        function links(value, path) {
            list(value, path, { optional: true }).forEach((item, index) => {
                const itemPath = `${path}[${index}]`;
                if (!record(item, itemPath)) return;
                keys(item, itemPath, ['label', 'file'], ['optional', 'icon']);
                text(item.label, `${itemPath}.label`);
                url(item.file, `${itemPath}.file`);
                boolean(item.optional, `${itemPath}.optional`);
                icon(item.icon, `${itemPath}.icon`);
            });
        }
        function extras(value, path) {
            list(value, path, { optional: true }).forEach((extra, index) => {
                const extraPath = `${path}[${index}]`;
                if (!record(extra, extraPath)) return;
                keys(extra, extraPath, ['name'], ['video', 'description', 'links', 'files', 'file', 'image']);
                if (extra.image !== undefined) url(extra.image, `${extraPath}.image`);
                text(extra.name, `${extraPath}.name`);
                video(extra.video, `${extraPath}.video`, { optional: true });
                text(extra.description, `${extraPath}.description`, { optional: true });
                links(extra.links, `${extraPath}.links`);
            });
        }

        const top = record(data, 'course-content');
        if (!top) return { course: null, errors };
        keys(top, 'top level', ['course', 'parts'], []);

        const meta = record(top.course, 'course');
        if (meta) {
            keys(meta, 'course', ['code', 'title', 'brand'], ['home', 'nav', 'checkpoint', 'reading', 'materials']);
            text(meta.code, 'course.code');
            text(meta.title, 'course.title');
            const brand = list(meta.brand, 'course.brand');
            if (!brand.length) fail('course.brand', 'needs at least one line');
            brand.forEach((line, index) => text(line, `course.brand[${index}]`));
            if (meta.home !== undefined) url(meta.home, 'course.home');
            list(meta.nav, 'course.nav', { optional: true }).forEach((item, index) => {
                const itemPath = `course.nav[${index}]`;
                if (!record(item, itemPath)) return;
                keys(item, itemPath, ['label'], ['file', 'button', 'lines']);
                text(item.label, `${itemPath}.label`);
                if (item.lines !== undefined) {
                    // A note: a labelled run of text lines above the buttons, nothing to click.
                    if (item.file !== undefined || item.button !== undefined) fail(itemPath, 'a note with lines: takes neither file nor button');
                    const lines = list(item.lines, `${itemPath}.lines`);
                    if (!lines.length) fail(`${itemPath}.lines`, 'needs at least one line');
                    lines.forEach((line, lineIndex) => text(line, `${itemPath}.lines[${lineIndex}]`));
                } else {
                    url(item.file, `${itemPath}.file`);
                    boolean(item.button, `${itemPath}.button`);
                }
            });
            text(meta.checkpoint, 'course.checkpoint', { optional: true });
            if (meta.reading !== undefined && (!text(meta.reading, 'course.reading') || !String(meta.reading).includes('{nn}'))) {
                fail('course.reading', 'must be a path pattern containing {nn}, such as Reading/Ch_{nn}.pdf');
            }
            text(meta.materials, 'course.materials', { optional: true });
        }
        const settings = meta || {};

        const parts = record(top.parts, 'parts');
        if (!parts) return { course: top, errors };
        const partIds = Object.keys(parts);
        if (!partIds.length) fail('parts', 'must contain at least one part');
        partIds.forEach(id => {
            if (!/^[A-Za-z0-9]+$/.test(id)) fail(`parts.${id}`, 'part IDs are letters or digits; they name part-<id>.html');
        });
        const seenBlocks = new Map();

        function validateBlock(section, path, partId) {
            keys(section, path, ['block', 'nav', 'title', 'description', 'episode'],
                ['folder', 'reading', 'steps', 'exercise', 'vignette', 'homework', 'dates', 'practice', 'extras']);
            if (text(section.block, `${path}.block`)) {
                const id = String(section.block);
                if (!/^[A-Za-z0-9.]+$/.test(id)) fail(`${path}.block`, 'block IDs are letters, digits, and dots');
                if (seenBlocks.has(id)) fail(`${path}.block`, `duplicates block ${id} in Part ${seenBlocks.get(id)}`);
                else seenBlocks.set(id, partId);
            }
            text(section.nav, `${path}.nav`);
            text(section.title, `${path}.title`);
            text(section.description, `${path}.description`);
            boolean(section.practice, `${path}.practice`);

            if (section.folder !== undefined && text(section.folder, `${path}.folder`)) {
                if (!settings.materials) fail(`${path}.folder`, 'needs course.materials to say which directory holds the block folders');
                if (String(section.folder).includes('/')) fail(`${path}.folder`, 'is a directory name, not a path');
            }

            const episode = record(section.episode, `${path}.episode`);
            if (episode) {
                keys(episode, `${path}.episode`, ['description'], ['name', 'video', 'links', 'empty']);
                text(episode.name, `${path}.episode.name`, { optional: true });
                text(episode.description, `${path}.episode.description`, { allowEmpty: true });
                video(episode.video, `${path}.episode.video`, { optional: true });
                links(episode.links, `${path}.episode.links`);
            }

            if (present(section.reading)) {
                const reading = record(section.reading, `${path}.reading`);
                if (reading) {
                    keys(reading, `${path}.reading`, [], ['chapter', 'name', 'topic', 'description', 'video', 'file', 'links', 'empty']);
                    if (!('chapter' in reading) && !('name' in reading)) fail(`${path}.reading`, 'needs a chapter or a name');
                    if ('chapter' in reading) {
                        if (!Number.isInteger(reading.chapter) || reading.chapter < 1) fail(`${path}.reading.chapter`, 'must be a positive whole number');
                        if (!settings.reading && reading.file === undefined) fail(`${path}.reading.chapter`, 'needs course.reading (a path pattern) or an explicit reading.file');
                    }
                    text(reading.name, `${path}.reading.name`, { optional: true });
                    text(reading.topic, `${path}.reading.topic`, { optional: true });
                    text(reading.description, `${path}.reading.description`, { optional: true });
                    video(reading.video, `${path}.reading.video`, { optional: true });
                    if (reading.file !== undefined && reading.file !== false) url(reading.file, `${path}.reading.file`);
                    links(reading.links, `${path}.reading.links`);
                }
            }

            if (present(section.steps)) {
                list(section.steps, `${path}.steps`).forEach((step, index) => {
                    const stepPath = `${path}.steps[${index}]`;
                    if (!record(step, stepPath)) return;
                    keys(step, stepPath, ['name'], ['kind', 'where', 'sub', 'due', 'date', 'video', 'links']);
                    text(step.name, `${stepPath}.name`);
                    if (step.kind !== undefined && !(step.kind in STEP_KINDS)) {
                        fail(`${stepPath}.kind`, `must be one of ${Object.keys(STEP_KINDS).join(', ')}`);
                    }
                    if (step.kind === undefined && step.where === undefined) fail(stepPath, 'needs a kind (exercise, homework, ...) or a where label');
                    text(step.where, `${stepPath}.where`, { optional: true });
                    text(step.sub, `${stepPath}.sub`, { optional: true });
                    text(step.due, `${stepPath}.due`, { optional: true });
                    date(step.date, `${stepPath}.date`);
                    video(step.video, `${stepPath}.video`, { optional: true });
                    links(step.links, `${stepPath}.links`);
                });
            } else if (section.practice !== false && !present(section.vignette)) {
                fail(`${path}.vignette`, 'is required unless the block lists its own steps or sets practice: false');
            }

            if (present(section.exercise) && record(section.exercise, `${path}.exercise`)) {
                keys(section.exercise, `${path}.exercise`, [], ['name', 'links', 'video']);
                text(section.exercise.name, `${path}.exercise.name`, { optional: true });
                video(section.exercise.video, `${path}.exercise.video`, { optional: true });
                links(section.exercise.links, `${path}.exercise.links`);
            }
            if (present(section.vignette) && record(section.vignette, `${path}.vignette`)) {
                const vignette = section.vignette;
                keys(vignette, `${path}.vignette`, [], ['name', 'description', 'video', 'links', 'files', 'solutions', 'solution_file', 'empty']);
                text(vignette.name, `${path}.vignette.name`, { optional: true });
                text(vignette.description, `${path}.vignette.description`, { optional: true, allowEmpty: true });
                video(vignette.video, `${path}.vignette.video`, { optional: true });
                fileOrBase(vignette.files, `${path}.vignette.files`);
                boolean(vignette.solutions, `${path}.vignette.solutions`);
                if (vignette.solution_file !== undefined) url(vignette.solution_file, `${path}.vignette.solution_file`);
                links(vignette.links, `${path}.vignette.links`);
            }
            if (present(section.homework) && record(section.homework, `${path}.homework`)) {
                const homework = section.homework;
                keys(homework, `${path}.homework`, [], ['due', 'file', 'links', 'solutions', 'solution_file', 'practice', 'video']);
                text(homework.due, `${path}.homework.due`, { optional: true });
                fileOrBase(homework.file, `${path}.homework.file`);
                boolean(homework.solutions, `${path}.homework.solutions`);
                if (homework.solution_file !== undefined) url(homework.solution_file, `${path}.homework.solution_file`);
                video(homework.video, `${path}.homework.video`, { optional: true });
                links(homework.links, `${path}.homework.links`);
            }
            if (present(section.dates) && record(section.dates, `${path}.dates`)) {
                keys(section.dates, `${path}.dates`, [], ['class', 'recitation', 'homework']);
                ['class', 'recitation', 'homework'].forEach(key => date(section.dates[key], `${path}.dates.${key}`));
            }
            extras(section.extras, `${path}.extras`);
        }

        function validateCheckpoint(value, path) {
            const checkpoint = record(value, path);
            if (!checkpoint) return;
            keys(checkpoint, path, ['description', 'demo'], ['date', 'when', 'reattempt', 'next', 'extras']);
            text(checkpoint.description, `${path}.description`, { allowEmpty: true });
            const demo = record(checkpoint.demo, `${path}.demo`);
            if (demo) {
                keys(demo, `${path}.demo`, [], ['name', 'video', 'description', 'file', 'links']);
                text(demo.name, `${path}.demo.name`, { optional: true });
                video(demo.video, `${path}.demo.video`, { optional: true });
                text(demo.description, `${path}.demo.description`, { optional: true, allowEmpty: true });
                links(demo.links, `${path}.demo.links`);
            }
            date(checkpoint.date, `${path}.date`);
            text(checkpoint.when, `${path}.when`, { optional: true });
            text(checkpoint.reattempt, `${path}.reattempt`, { optional: true });
            if (checkpoint.next !== undefined && !partIds.includes(String(checkpoint.next))) {
                fail(`${path}.next`, `names Part ${checkpoint.next}, which is not in parts`);
            }
            extras(checkpoint.extras, `${path}.extras`);
        }

        function validateProject(value, path) {
            const project = record(value, path);
            if (!project) return;
            keys(project, path, ['id', 'nav', 'title', 'description', 'prompts', 'requirements'], ['links']);
            if (text(project.id, `${path}.id`) && !/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(String(project.id))) {
                fail(`${path}.id`, 'must be a lowercase, hyphenated HTML id such as final-project');
            }
            text(project.nav, `${path}.nav`);
            text(project.title, `${path}.title`);
            text(project.description, `${path}.description`, { allowEmpty: true });
            const kinds = new Set();
            list(project.prompts, `${path}.prompts`).forEach((prompt, index) => {
                const promptPath = `${path}.prompts[${index}]`;
                if (!record(prompt, promptPath)) return;
                keys(prompt, promptPath, ['label', 'kind', 'text'], []);
                text(prompt.label, `${promptPath}.label`);
                if (!PROMPT_KINDS.includes(prompt.kind)) fail(`${promptPath}.kind`, `must be one of ${PROMPT_KINDS.join(', ')}`);
                else if (kinds.has(prompt.kind)) fail(`${promptPath}.kind`, 'repeats a kind');
                kinds.add(prompt.kind);
                text(prompt.text, `${promptPath}.text`);
            });
            list(project.requirements, `${path}.requirements`).forEach((item, index) => text(item, `${path}.requirements[${index}]`));
            links(project.links, `${path}.links`);
        }

        partIds.forEach(partId => {
            const path = `parts.${partId}`;
            const part = record(parts[partId], path);
            if (!part) return;
            keys(part, path, ['title', 'tagline', 'introduction', 'sections'], ['links', 'homework_defaults']);
            text(part.title, `${path}.title`);
            text(part.tagline, `${path}.tagline`);
            text(part.introduction, `${path}.introduction`);
            links(part.links, `${path}.links`);
            if (present(part.homework_defaults) && record(part.homework_defaults, `${path}.homework_defaults`)) {
                keys(part.homework_defaults, `${path}.homework_defaults`, [], ['due', 'file', 'solutions', 'solution_file', 'practice']);
            }
            let checkpoints = 0;
            let projects = 0;
            list(part.sections, `${path}.sections`).forEach((section, index) => {
                const sectionPath = `${path}.sections[${index}]`;
                if (!record(section, sectionPath)) return;
                const kinds = ['block', 'checkpoint', 'project'].filter(kind => kind in section);
                if (kinds.length !== 1) { fail(sectionPath, 'must be exactly one of: a block, a checkpoint, or a project'); return; }
                if (kinds[0] === 'block') {
                    validateBlock(section, sectionPath, partId);
                } else if (kinds[0] === 'checkpoint') {
                    checkpoints += 1;
                    keys(section, sectionPath, ['checkpoint'], []);
                    validateCheckpoint(section.checkpoint, `${sectionPath}.checkpoint`);
                } else {
                    projects += 1;
                    keys(section, sectionPath, ['project'], []);
                    validateProject(section.project, `${sectionPath}.project`);
                }
            });
            if (checkpoints > 1) fail(`${path}.sections`, 'has more than one checkpoint');
            if (projects > 1) fail(`${path}.sections`, 'has more than one project');
        });

        return { course: top, errors };
    }

    // Every local file the YAML names outright, so a checker can confirm each exists. Bare
    // bases (file: A1) are resolved against the filesystem by the page and are not listed.
    function localFiles(course) {
        const found = [];
        const add = (value, at) => {
            if (typeof value === 'string' && !externalUrl(value) && explicitPath(value)) found.push({ path: value.split(/[?#]/, 1)[0], at });
        };
        const addLinks = (items, at) => (Array.isArray(items) ? items : []).forEach((item, index) => item && add(item.file, `${at}[${index}].file`));
        const meta = (course && course.course) || {};
        add(meta.home, 'course.home');
        addLinks(meta.nav, 'course.nav');
        const parts = (course && course.parts) || {};
        Object.keys(parts).forEach(partId => {
            const part = parts[partId] || {};
            const at = `parts.${partId}`;
            addLinks(part.links, `${at}.links`);
            (Array.isArray(part.sections) ? part.sections : []).forEach((section, index) => {
                const sectionPath = `${at}.sections[${index}]`;
                if (!isRecord(section)) return;
                if (section.block !== undefined) {
                    const episode = section.episode || {};
                    addLinks(episode.links, `${sectionPath}.episode.links`);
                    const reading = section.reading || {};
                    if (reading.chapter !== undefined && reading.file === undefined) {
                        const file = readingFile(course, reading.chapter);
                        if (file) found.push({ path: file, at: `${sectionPath}.reading.chapter` });
                    }
                    if (reading.file) add(reading.file, `${sectionPath}.reading.file`);
                    addLinks(reading.links, `${sectionPath}.reading.links`);
                    (Array.isArray(section.steps) ? section.steps : []).forEach((step, stepIndex) => step && addLinks(step.links, `${sectionPath}.steps[${stepIndex}].links`));
                    ['exercise', 'vignette', 'homework'].forEach(key => {
                        const node = section[key] || {};
                        addLinks(node.links, `${sectionPath}.${key}.links`);
                        if (node.solutions === true) add(node.solution_file, `${sectionPath}.${key}.solution_file`);
                    });
                    if (section.homework && section.homework.file) add(section.homework.file, `${sectionPath}.homework.file`);
                    if (section.vignette && section.vignette.files) add(section.vignette.files, `${sectionPath}.vignette.files`);
                    (Array.isArray(section.extras) ? section.extras : []).forEach((extra, extraIndex) => extra && addLinks(extra.links, `${sectionPath}.extras[${extraIndex}].links`));
                } else if (section.checkpoint !== undefined) {
                    const checkpoint = section.checkpoint || {};
                    addLinks((checkpoint.demo || {}).links, `${sectionPath}.checkpoint.demo.links`);
                    (Array.isArray(checkpoint.extras) ? checkpoint.extras : []).forEach((extra, extraIndex) => extra && addLinks(extra.links, `${sectionPath}.checkpoint.extras[${extraIndex}].links`));
                } else if (section.project !== undefined) {
                    addLinks((section.project || {}).links, `${sectionPath}.project.links`);
                }
            });
        });
        return found;
    }

    return {
        STEP_KINDS,
        PROMPT_KINDS,
        validate,
        localFiles,
        blockCandidates,
        blockElementId,
        checkpointWord,
        checkpointElementId,
        readingFile,
        conventionalPath,
        explicitPath,
        externalUrl
    };
}));
