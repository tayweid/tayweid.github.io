/* course-page.js — renders a course part page in the browser from course-content.yaml.js.
 *
 * Shared by every course site. A part page is a thin shell: an empty left-nav slot, a
 * <main data-course-part="A"> with a loading line, an output slot, and an empty right-nav
 * slot. A site's index.html declares data-course-part="current" and shows whichever part
 * the schedule says is current (CourseSchema.currentPart), so the bare address is always
 * up to date. Everything visible comes from the YAML, validated first by course-schema.js so the
 * page and the checker can never disagree. The format is documented in COURSE_CONTENT.md.
 *
 * Loaded by the shell's bootstrap after js-yaml.min.js and course-schema.js. When the page
 * is done it inserts course.js (from the same base) to wire up video cards, the scroll spy,
 * and the navigation.
 *
 * A course's own home page (course.html) is written by hand; marked data-course-home, it gets
 * only the course column from this file (courses on the row card; see renderCourseColumn).
 */
(function () {
    'use strict';

    const page = document.querySelector('[data-course-part]') || document.querySelector('[data-course-home]');
    if (!page) return;
    const homePage = !page.hasAttribute('data-course-part');
    if (!homePage) page.setAttribute('aria-busy', 'true');

    let partId = page.dataset.coursePart;   // 'current' is resolved once the YAML is read
    const SOURCE = 'course-content.yaml.js';
    const output = page.querySelector('[data-course-output]');
    const leftSlot = document.querySelector('[data-course-left-nav]');
    const rightSlot = document.querySelector('[data-course-right-nav]');
    const assetsBase = window.COURSE_ASSETS_BASE || 'https://tayweid.github.io/course-assets/';
    let schema;
    let course;
    let discoveredFiles = {};

    // ---------- small helpers ----------

    function element(tag, className, text) {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (text !== undefined && text !== null) node.textContent = String(text);
        return node;
    }

    function items(value) {
        return Array.isArray(value) ? value : [];
    }

    // *asterisks* become <i>; nothing else is markup, and the text is never parsed as HTML.
    function appendInlineText(node, value, stripOuterEmphasis) {
        let text = String(value || '');
        if (stripOuterEmphasis && /^\*[^*]+\*$/.test(text)) text = text.slice(1, -1);
        const expression = /\*([^*]+)\*/g;
        let cursor = 0;
        let match;
        while ((match = expression.exec(text))) {
            node.append(document.createTextNode(text.slice(cursor, match.index)));
            node.append(element('i', null, match[1]));
            cursor = match.index + match[0].length;
        }
        node.append(document.createTextNode(text.slice(cursor)));
    }

    function thumbnail(video) {
        return `https://img.youtube.com/vi/${video}/maxresdefault.jpg`;
    }

    // One date as "Thu Oct 8"; a two-day list as "Thu Oct 8 & Fri Oct 9".
    function shortDate(iso) {
        if (Array.isArray(iso)) return iso.map(shortDate).join(' & ');
        const date = new Date(`${iso}T00:00:00Z`);
        if (Number.isNaN(date.getTime())) return String(iso);
        return new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' })
            .format(date).replace(',', '');
    }

    // ---------- links ----------

    function iconFor(item) {
        if (item.icon) return item.icon.startsWith('fa ') ? item.icon : `fa ${item.icon}`;
        const href = String(item.file).toLowerCase().split(/[?#]/, 1)[0];
        if (item.label === 'Practice') return 'fa fa-pencil';
        if (schema.externalUrl(href)) return 'fa fa-external-link';
        if (/\.(?:html?|qmd)$/.test(href) || href.endsWith('/')) return 'fa fa-desktop';
        if (/\.(?:ipynb|py|r)$/.test(href)) return 'fa fa-file-code-o';
        if (/\.(?:pptx?|key)$/.test(href)) return 'fa fa-file-powerpoint-o';
        if (/\.(?:csv|tsv|xlsx?|json)$/.test(href) || href.startsWith('data/')) return 'fa fa-file-text-o';
        return 'fa fa-file-pdf-o';
    }

    function resourceLink(item) {
        const optional = Boolean(item.optional);
        let className = item.label === 'Practice' ? 'practice-link' : 'download-link';
        if (optional) className += ' chip-optional';
        const link = element('a', className);
        link.href = String(item.file);
        link.target = '_blank';
        link.rel = 'noopener';
        const icon = element('i', iconFor(item));
        icon.setAttribute('aria-hidden', 'true');
        link.append(icon, document.createTextNode(` ${item.label}${optional ? ' · optional' : ''}`));
        return link;
    }

    function links(list) {
        if (!list.length) return null;
        const container = element('div', 'path-links');
        list.forEach(item => container.append(resourceLink(item)));
        return container;
    }

    // ---------- the practice path ----------

    // The small thumbnail beside a step: a YouTube frame when the step has a video,
    // otherwise an image the YAML names (a podcast's episode art, say) linking to the
    // step's first link.
    function pathThumbnail(video, image, href) {
        if (!video && !(image && href)) return null;
        const link = element('a', 'path-thumb');
        link.href = video ? `https://www.youtube.com/watch?v=${video}` : href;
        link.target = '_blank';
        link.rel = 'noopener';
        const imageNode = element('img');
        imageNode.src = video ? thumbnail(video) : String(image);
        imageNode.alt = '';
        link.append(imageNode);
        return link;
    }

    function pathStep({ name, where, sub, links: stepLinks = [], date, due, video, image, classes = '', dotClasses = '' }) {
        const step = element('li', `path-step${classes ? ` ${classes}` : ''}`);
        // The dot turns blue the day after the (last) date.
        const last = schema.lastDate(date);
        if (last) step.dataset.date = last;
        const dot = element('span', `path-dot${dotClasses ? ` ${dotClasses}` : ''}`);
        dot.setAttribute('aria-hidden', 'true');
        const body = element('div');
        const title = element('p', 'path-name');
        title.append(document.createTextNode(`${name} `), element('span', 'path-where', where));
        body.append(title);
        if (sub) body.append(element('p', 'path-sub', sub));
        const rendered = links(stepLinks);
        if (rendered) body.append(rendered);
        if (due) body.append(element('p', 'path-due', due));
        step.append(dot, body);
        const thumb = pathThumbnail(video, image, stepLinks.length ? String(stepLinks[0].file) : null);
        if (thumb) step.append(thumb);
        return step;
    }

    function extraStep(extra, bend) {
        const step = pathStep({
            name: extra.name,
            where: 'optional',
            sub: extra.description,
            links: items(extra.links),
            video: extra.video,
            image: extra.image,
            classes: `path-step-alt ${bend ? 'path-step-bend' : 'path-step-extra'}`,
            dotClasses: 'path-dot-alt'
        });
        if (extra.video) step.dataset.videoId = extra.video;
        return step;
    }

    // A step written out in the YAML (steps:). Its kind supplies the label and, for a
    // livestream, the aside styling; where: overrides the label.
    function explicitStep(step, classes = '', solutionFile) {
        const livestream = step.kind === 'livestream';
        // Work done at home is due on its date; due: replaces that wording (e.g. "... at 5PM").
        const atHome = step.kind === 'homework' || (!step.kind && /\bhome\b/i.test(step.where || ''));
        const due = step.due || (atHome && step.date ? shortDate(step.date) : null);
        // post: on the step, or the course's default for its kind, holds its links back until the date.
        const posted = schema.released(schema.releaseMode(course, 'post', step.kind, step), step.date, today());
        const stepLinks = posted ? [...items(step.links)] : [];
        if (solutionFile && shown('solutions', step.kind, step, step.date) &&
            !stepLinks.some(link => link.file.replace(/^\.\//, '') === solutionFile.replace(/^\.\//, ''))) {
            stepLinks.push({ label: 'Solutions', file: solutionFile });
        }
        return pathStep({
            name: step.name,
            where: step.where || schema.STEP_KINDS[step.kind] || '',
            sub: step.sub,
            links: stepLinks,
            date: step.date,
            due: due ? (/^due\b/i.test(due) ? due : `Due ${due}`) : null,
            video: step.video,
            classes: [livestream ? 'path-step-alt' : '', classes].filter(Boolean).join(' '),
            dotClasses: livestream ? 'path-dot-alt' : ''
        });
    }

    // Today as yyyy-mm-dd, the way course.js dates the dots; ?today=2026-09-03 previews another day.
    function today() {
        const override = new URLSearchParams(location.search).get('today');
        return (override || new Date().toLocaleDateString('en-CA')).slice(0, 10);
    }

    // Whether a step's file (key: post) or answer key (key: solutions) is out today.
    function shown(key, kind, node, date, defaults) {
        return schema.released(schema.releaseMode(course, key, kind, node, defaults), date, today());
    }

    // A conventional step's chips: its PDF once posted, its solutions once released. links:
    // in the YAML replaces both (and is held back with the file).
    function stepLinks(kind, label, node, date, file, sols, defaults) {
        if (node.links) return shown('post', kind, node, date, defaults) ? items(node.links) : [];
        const found = [];
        if (file && shown('post', kind, node, date, defaults)) found.push({ label, file });
        if (sols && shown('solutions', kind, node, date, defaults)) found.push({ label: 'Solutions', file: sols });
        return found;
    }

    function vignetteLinks(vignette, blockFiles, date) {
        if (vignette.files === false) return [];
        const sols = schema.explicitPath(vignette.solution_file) ? vignette.solution_file : blockFiles.vignette_sols;
        return stepLinks('vignette', 'Vignette', vignette, date, blockFiles.vignette, sols);
    }

    // The conventional exercise / vignette / homework triad, with the block's dates
    // deciding the order and the discovered PDFs supplying the chips.
    function conventionalSteps(part, block) {
        const blockId = block.block;
        const dates = block.dates || {};
        const exercise = block.exercise || {};
        const vignette = block.vignette || {};
        const homework = { ...(part.homework_defaults || {}), ...(block.homework || {}) };
        const blockFiles = discoveredFiles[blockId] || {};

        const homeworkFile = homework.file === false ? null : schema.explicitPath(homework.file) ? homework.file : blockFiles.homework;
        const homeworkSols = homework.file === false ? null : schema.explicitPath(homework.solution_file) ? homework.solution_file : blockFiles.homework_sols;
        const homeworkLinks = stepLinks('homework', 'Homework', homework, dates.homework, homeworkFile, homeworkSols);
        const exerciseSols = schema.explicitPath(exercise.solution_file) ? exercise.solution_file : blockFiles.exercise_sols;
        const exerciseLinks = stepLinks('exercise', 'Exercise', exercise, dates.class, blockFiles.exercise, exerciseSols);
        // Due on its date; due: replaces that wording (e.g. "Friday, Oct. 16 at 5PM"), as on a step.
        const due = homework.due || (dates.homework ? shortDate(dates.homework) : null);
        const vignetteDue = /\bhome\b/i.test(vignette.where || '') && dates.recitation
            ? `Due ${shortDate(dates.recitation)}` : null;

        const standard = [
            { date: dates.class, index: 0, node: pathStep({
                name: exercise.name || `Exercise ${blockId}`,
                where: 'in class',
                links: exerciseLinks,
                date: dates.class,
                video: exercise.video
            }) },
            { date: dates.recitation, index: 1, node: pathStep({
                name: vignette.name || `Vignette ${blockId}`,
                where: vignette.where || 'recitation',
                due: vignetteDue,
                links: vignetteLinks(vignette, blockFiles, dates.recitation),
                date: dates.recitation,
                video: vignette.video
            }) },
            { date: dates.homework, index: 2, node: pathStep({
                name: `Homework ${blockId}`,
                where: 'home',
                links: homeworkLinks,
                date: dates.homework,
                due: due ? `Due ${due}` : null,
                video: homework.video
            }) }
        ];
        if (standard.every(step => schema.firstDate(step.date))) {
            standard.sort((left, right) => schema.firstDate(left.date).localeCompare(schema.firstDate(right.date)) || left.index - right.index);
        }
        return standard.map(step => step.node);
    }

    function blockSteps(part, block) {
        const extras = items(block.extras).map(extra => extraStep(extra, false));
        const blockFiles = discoveredFiles[block.block] || {};
        const steps = block.steps
            ? items(block.steps).map((step, index) => explicitStep(step, '', blockFiles[`step_${index}_sols`]))
            : conventionalSteps(part, block);
        return extras.concat(steps);
    }

    // ---------- the episode panel ----------

    function videoPanel(name, video) {
        const cardVideo = element('div', 'card-video');
        const image = element('img');
        if (video) {
            image.src = thumbnail(video);
            image.alt = `${name} thumbnail`;
            cardVideo.append(image, element('div', 'play-button', '▶'));
        } else {
            image.alt = '';
            image.className = 'placeholder-bg';
            cardVideo.append(image);
        }
        return cardVideo;
    }

    function episodePanel(blockId, block) {
        const episode = block.episode || {};
        const reading = block.reading || {};
        const name = episode.name || `Episode ${blockId}`;
        const panel = element('div', 'path-episode');
        if (episode.video) panel.dataset.videoId = episode.video;
        panel.append(videoPanel(name, episode.video));

        const title = element('p', 'path-name');
        title.append(document.createTextNode(`${name} `));
        const description = element('span', 'path-desc');
        appendInlineText(description, episode.description || '', true);
        title.append(description);
        panel.append(title);

        const episodeLinks = items(episode.links).slice();
        const blockFiles = discoveredFiles[blockId] || {};
        const deck = (blockFiles.animations || blockFiles.animations_episode || '').replace(/index\.html$/, '');
        const folderOf = file => String(file).replace(/^\.\//, '').replace(/(index\.html)?$/, '').replace(/\/?$/, '/');
        if (deck && !episodeLinks.some(item => folderOf(item.file) === folderOf(deck))) {
            episodeLinks.unshift({ label: 'Animations', file: deck, icon: 'fa fa-desktop' });
        }
        if (reading.chapter !== undefined && reading.file !== false) {
            const file = typeof reading.file === 'string' ? reading.file : schema.readingFile(course, reading.chapter);
            if (file) episodeLinks.push({ label: `Ch. ${reading.chapter}`, file, optional: true });
        } else if (reading.name) {
            episodeLinks.push(...items(reading.links));
        }
        const rendered = links(episodeLinks);
        if (rendered) panel.append(rendered);
        return panel;
    }

    // ---------- the row card (courses built on the exercise / vignette / homework triad) ----------
    //
    // A course whose blocks use the conventional triad (ECON 0100) gets this card for its blocks
    // and checkpoints; a course built only from explicit steps (ECON 0150, whose steps carry many
    // named files) keeps the path card above. The episode is on the left, its video always 16:9;
    // the practice is a column of rows on the right: a dot on a dashed line, the name and where it
    // happens, its files as small buttons under it (solutions drawn in red) with the day, and a
    // walkthrough's thumbnail. The card keeps the same pieces at every width and scales them with
    // its own width (container queries on .bc-wrap), down to a phone, where it runs edge to edge.
    let rowCards = false;

    function usesRowCards() {
        return Object.values(course.parts || {}).some(part =>
            items(part.sections).some(section => section.block !== undefined && !section.steps));
    }

    const SOLUTIONS_LABEL = /^solutions?\b/i;

    function hiddenIcon(className) {
        const icon = element('i', className);
        icon.setAttribute('aria-hidden', 'true');
        return icon;
    }

    // One file or link as a small icon button; its label is the tooltip.
    function rowButton(item, owner) {
        const label = String(item.label);
        const solutions = SOLUTIONS_LABEL.test(label);
        const link = element('a', `bc-ib${solutions ? ' bc-sol' : ''}${item.optional ? ' bc-optional' : ''}`);
        link.href = String(item.file);
        link.target = '_blank';
        link.rel = 'noopener';
        const title = item.optional ? `${label} (optional)` : label;
        link.title = title;
        link.setAttribute('aria-label', owner ? `${owner}: ${title}` : title);
        link.append(hiddenIcon(solutions ? 'fa fa-file-text-o' : iconFor(item)));
        return link;
    }

    // A file that is on disk but held back until its day: a faint button that says when.
    function waitButton(label, day, owner) {
        const solutions = SOLUTIONS_LABEL.test(label);
        const text = `${label} ${solutions ? 'post' : 'posts'} ${shortDate(day)}`;
        const span = element('span', `bc-ib bc-wait${solutions ? ' bc-sol' : ''}`);
        span.title = text;
        span.setAttribute('role', 'img');
        span.setAttribute('aria-label', owner ? `${owner}: ${text}` : text);
        span.append(hiddenIcon('fa fa-file-text-o'));
        return span;
    }

    // The walkthrough as a ▶ button, for the widths where its thumbnail gives way.
    function videoButton(video, owner) {
        const link = element('a', 'bc-ib bc-vid');
        link.href = `https://www.youtube.com/watch?v=${video}`;
        link.target = '_blank';
        link.rel = 'noopener';
        link.title = 'Walkthrough video';
        link.setAttribute('aria-label', `${owner}: walkthrough video`);
        link.append(hiddenIcon('fa fa-play'));
        return link;
    }

    // The day a held-back file appears: on_date its (first) day, after_date the day after the last.
    function releaseDay(mode, date) {
        if (mode === 'on_date') return schema.firstDate(date) || null;
        if (mode !== 'after_date') return null;
        const last = schema.lastDate(date);
        if (!last) return null;
        const day = new Date(`${last}T00:00:00Z`);
        day.setUTCDate(day.getUTCDate() + 1);
        return day.toISOString().slice(0, 10);
    }

    // A conventional file and its solutions as buttons: posted ones as links, held-back ones
    // (on disk, waiting for their day) as faint buttons; links: in the YAML replaces both.
    function rowFiles(kind, label, node, date, file, sols, owner, defaults) {
        if (node.links) return shown('post', kind, node, date, defaults) ? items(node.links).map(item => rowButton(item, owner)) : [];
        const buttons = [];
        [['post', label, file], ['solutions', 'Solutions', sols]].forEach(([key, name, path]) => {
            if (!path) return;
            if (shown(key, kind, node, date, defaults)) buttons.push(rowButton({ label: name, file: path }, owner));
            else {
                const day = releaseDay(schema.releaseMode(course, key, kind, node, defaults), date);
                if (day) buttons.push(waitButton(name, day, owner));
            }
        });
        return buttons;
    }

    // A row's date line is just the day ("Sun Oct 18"): no "Due" in front and no time of day.
    function dayOnly(text) {
        if (!text) return null;
        return String(text).replace(/^\s*due\s+/i, '').replace(/,?\s*(at\s+)?\d{1,2}(:\d{2})?\s*(am|pm)\b.*$/i, '').trim() || null;
    }

    // A row: a dot on the dashed line, the name with where it happens after it (Exercise IN CLASS),
    // then a line of its own with the file buttons and the day, under the name and a little in.
    function rowStep({ name, letter, owner, where, buttons = [], due, sub, date, video, image, href, classes = '', dotClasses = '' }) {
        const step = element('li', `bc-step${classes ? ` ${classes}` : ''}`);
        const last = schema.lastDate(date);
        if (last) step.dataset.date = last;
        const dot = element('span', `bc-dot${dotClasses ? ` ${dotClasses}` : ''}`);
        dot.setAttribute('aria-hidden', 'true');
        step.append(dot);
        const head = element('div', 'bc-head');
        const title = element('p', 'bc-name');
        const nm = element('span', 'bc-nm');
        const short = element('span', 'bc-letter', letter || name);
        short.setAttribute('aria-hidden', 'true');
        short.title = name;
        nm.append(element('span', 'bc-full', name), short);
        title.append(nm);
        if (where) title.append(element('span', 'bc-where', where));
        head.append(title);
        const chips = element('div', 'bc-chips');
        const icons = element('span', 'bc-ico');
        buttons.forEach(button => icons.append(button));
        if (video) icons.append(videoButton(video, owner || name));
        if (icons.childNodes.length) chips.append(icons);
        if (sub) chips.append(element('span', 'bc-due bc-sub', sub));
        const day = dayOnly(due);
        if (day) chips.append(element('span', 'bc-due', day));
        if (chips.childNodes.length) head.append(chips);
        step.append(head);
        const target = video ? `https://www.youtube.com/watch?v=${video}` : (image && href ? String(href) : null);
        if (target) {
            const thumb = element('a', 'bc-thumb');
            thumb.href = target;
            thumb.target = '_blank';
            thumb.rel = 'noopener';
            thumb.setAttribute('aria-label', video ? `${owner || name}: walkthrough video` : String(name));
            const img = element('img');
            img.src = video ? `https://img.youtube.com/vi/${video}/mqdefault.jpg` : String(image);
            img.alt = '';
            img.loading = 'lazy';
            thumb.append(img);
            step.append(thumb);
        } else {
            step.classList.add('bc-novid');
        }
        return step;
    }

    // The dashed line runs from each dot to the next; into an optional or alternative row it
    // is fainter, and into a block's optional extras it goes when they do (course.css).
    function linkRows(rows) {
        rows.forEach((row, index) => {
            const next = rows[index + 1];
            if (!next) return;
            row.classList.add(next.classList.contains('bc-extra') ? 'bc-to-extra'
                : next.classList.contains('bc-alt') ? 'bc-to-alt' : 'bc-to-next');
        });
        return rows;
    }

    function practiceRows(part, block) {
        const blockId = block.block;
        const dates = block.dates || {};
        const exercise = block.exercise || {};
        const vignette = block.vignette || {};
        const homework = { ...(part.homework_defaults || {}), ...(block.homework || {}) };
        const blockFiles = discoveredFiles[blockId] || {};
        const solutionPath = (node, found) => schema.explicitPath(node.solution_file) ? node.solution_file : found;

        const exerciseOwner = `Exercise ${blockId}`;
        const vignetteOwner = `Vignette ${blockId}`;
        const homeworkOwner = `Homework ${blockId}`;
        const homeworkFile = homework.file === false ? null : schema.explicitPath(homework.file) ? homework.file : blockFiles.homework;
        const homeworkSols = homework.file === false ? null : solutionPath(homework, blockFiles.homework_sols);
        const due = homework.due || (dates.homework ? shortDate(dates.homework) : null);

        const standard = [
            { date: dates.class, index: 0, node: rowStep({
                name: exercise.name || 'Exercise', letter: 'E', owner: exerciseOwner, where: 'in class',
                buttons: rowFiles('exercise', 'Exercise', exercise, dates.class, blockFiles.exercise, solutionPath(exercise, blockFiles.exercise_sols), exerciseOwner),
                date: dates.class, video: exercise.video, classes: 'bc-prac'
            }) },
            { date: dates.recitation, index: 1, node: rowStep({
                name: vignette.name || 'Vignette', letter: 'V', owner: vignetteOwner, where: vignette.where || 'recitation',
                buttons: vignette.files === false ? [] : rowFiles('vignette', 'Vignette', vignette, dates.recitation, blockFiles.vignette, solutionPath(vignette, blockFiles.vignette_sols), vignetteOwner),
                date: dates.recitation, video: vignette.video, classes: 'bc-prac'
            }) },
            { date: dates.homework, index: 2, node: rowStep({
                name: 'Homework', letter: 'H', owner: homeworkOwner, where: 'home',
                buttons: rowFiles('homework', 'Homework', homework, dates.homework, homeworkFile, homeworkSols, homeworkOwner),
                date: dates.homework, due: due ? `Due ${due}` : null, video: homework.video, classes: 'bc-prac'
            }) }
        ];
        if (standard.every(step => schema.firstDate(step.date))) {
            standard.sort((left, right) => schema.firstDate(left.date).localeCompare(schema.firstDate(right.date)) || left.index - right.index);
        }
        return standard.map(step => step.node);
    }

    // A step written out in the YAML (steps:), as a row: its name stays a name at every width.
    function explicitRow(step, solutionFile, classes = '') {
        const atHome = step.kind === 'homework' || (!step.kind && /\bhome\b/i.test(step.where || ''));
        const due = step.due || (atHome && step.date ? shortDate(step.date) : null);
        const posted = schema.released(schema.releaseMode(course, 'post', step.kind, step), step.date, today());
        const buttons = posted ? items(step.links).map(item => rowButton(item, step.name)) : [];
        if (solutionFile && !items(step.links).some(link => link.file.replace(/^\.\//, '') === solutionFile.replace(/^\.\//, ''))) {
            if (shown('solutions', step.kind, step, step.date)) buttons.push(rowButton({ label: 'Solutions', file: solutionFile }, step.name));
        }
        return rowStep({
            name: step.name, owner: step.name, where: step.where || schema.STEP_KINDS[step.kind] || '',
            buttons, sub: step.sub, date: step.date, video: step.video,
            due: due ? (/^due\b/i.test(due) ? due : `Due ${due}`) : null, classes
        });
    }

    // An optional extra (bc-opt): a smaller card leaves these out (course.css).
    function extraRow(extra, classes) {
        const links = items(extra.links);
        return rowStep({
            name: extra.name, owner: extra.name, where: 'optional',
            buttons: links.map(item => rowButton(item, extra.name)),
            video: extra.video, image: extra.image, href: links.length ? links[0].file : null,
            classes: `bc-opt ${classes}`, dotClasses: 'bc-dot-alt'
        });
    }

    // The episode side: the video (with the episode's buttons riding on it, shown on a phone),
    // then one line: its name, a short description, and the same buttons.
    function rowEpisode({ name, description, video, buttons, classes = '' }) {
        const panel = element('div', `bc-episode${classes ? ` ${classes}` : ''}`);
        const media = element('div', 'bc-media');
        let still;
        if (video) {
            still = element('a', 'bc-still');
            still.href = `https://www.youtube.com/watch?v=${video}`;
            still.target = '_blank';
            still.rel = 'noopener';
            still.setAttribute('aria-label', `Play ${name}`);
            const img = element('img');
            img.src = `https://img.youtube.com/vi/${video}/maxresdefault.jpg`;
            img.alt = '';
            img.onerror = () => { img.onerror = null; img.src = `https://img.youtube.com/vi/${video}/hqdefault.jpg`; };
            const play = element('span', 'bc-play');
            play.setAttribute('aria-hidden', 'true');
            still.append(img, play);
        } else {
            still = element('div', 'bc-still bc-none', 'Video not yet available');
        }
        const over = element('span', 'bc-ico bc-over');
        buttons().forEach(button => over.append(button));
        media.append(still, over);
        const head = element('div', 'bc-ephead');
        const title = element('p', 'bc-epname');
        title.append(element('span', 'bc-eptitle', name));
        if (description) {
            const desc = element('span', 'bc-epdesc');
            appendInlineText(desc, description, true);
            title.append(document.createTextNode(' '), desc);
        }
        const icons = element('span', 'bc-ico bc-epico');
        buttons().forEach(button => icons.append(button));
        head.append(title);
        if (icons.childNodes.length) head.append(icons);
        panel.append(media, head);
        return panel;
    }

    // The episode's own links: its animation deck (found on disk), anything listed, and the reading.
    function episodeButtons(blockId, block) {
        const episode = block.episode || {};
        const reading = block.reading || {};
        const list = items(episode.links).slice();
        const blockFiles = discoveredFiles[blockId] || {};
        const deck = (blockFiles.animations || blockFiles.animations_episode || '').replace(/index\.html$/, '');
        const folderOf = file => String(file).replace(/^\.\//, '').replace(/(index\.html)?$/, '').replace(/\/?$/, '/');
        if (deck && !list.some(item => folderOf(item.file) === folderOf(deck))) {
            list.unshift({ label: 'Animations', file: deck, icon: 'fa fa-desktop' });
        }
        if (reading.chapter !== undefined && reading.file !== false) {
            const file = typeof reading.file === 'string' ? reading.file : schema.readingFile(course, reading.chapter);
            if (file) list.push({ label: `Ch. ${reading.chapter}`, file, optional: true, icon: 'fa fa-book' });
        } else if (reading.name) {
            list.push(...items(reading.links).map(item => ({ icon: 'fa fa-book', ...item })));
        }
        return () => list.map(item => rowButton(item, `Episode ${blockId}`));
    }

    function renderBlockRows(part, block) {
        const section = element('div', 'block');
        section.id = schema.blockElementId(block.block);
        section.append(element('h1', 'subtitle', `Block ${block.block} | ${block.title}`));
        const description = element('p', 'block-description');
        appendInlineText(description, block.description);
        section.append(description);

        const episode = block.episode || {};
        const wrap = element('div', 'bc-wrap');
        const card = element('div', `bc bc-block${block.practice === false ? ' bc-solo' : ''}${block.steps ? ' bc-named' : ''}`);
        card.append(rowEpisode({
            name: episode.name || `Episode ${block.block}`,
            description: episode.description,
            video: episode.video,
            buttons: episodeButtons(block.block, block)
        }));
        if (block.practice !== false) {
            const list = element('ol', 'bc-steps');
            list.append(element('li', 'bc-label', 'Practice'));
            const blockFiles = discoveredFiles[block.block] || {};
            const steps = block.steps
                ? items(block.steps).map((step, index) => explicitRow(step, blockFiles[`step_${index}_sols`]))
                : practiceRows(part, block);
            const extras = items(block.extras).map(extra => extraRow(extra, 'bc-alt bc-extra'));
            linkRows(steps.concat(extras)).forEach(row => list.append(row));
            card.append(list);
        }
        wrap.append(card);
        section.append(wrap);
        return section;
    }

    function renderCheckpointRows(config) {
        const word = schema.checkpointWord(course);
        const demo = config.demo || {};
        const section = element('div', 'block checkpoint');
        section.id = schema.checkpointElementId(course);
        section.append(element('h1', 'subtitle', `${word} ${partId}`));
        const description = element('p', 'block-description');
        appendInlineText(description, config.description || '');
        section.append(description);

        const wrap = element('div', 'bc-wrap');
        const card = element('div', 'bc bc-checkpoint');
        card.append(rowEpisode({
            name: demo.name || `Demo ${partId} Walkthrough`,
            description: demo.description || `Attempt Demo ${partId} first, then walk through with me.`,
            video: demo.video,
            buttons: () => []
        }));
        const list = element('ol', 'bc-steps');
        const rows = items(config.steps).map(step => explicitRow(step));
        const demoName = `Demo ${partId}`;
        rows.push(rowStep({ name: demoName, owner: demoName, where: 'home', buttons: items(demo.links).map(item => rowButton(item, demoName)) }));
        items(config.extras).forEach(extra => rows.push(extraRow(extra, 'bc-alt')));
        const checkpointName = `${word} ${partId}`;
        rows.push(rowStep({
            name: checkpointName, owner: checkpointName, where: 'in class',
            buttons: items(config.links).map(item => rowButton(item, checkpointName)),
            date: config.date, due: config.when || (config.date ? shortDate(config.date) : null),
            dotClasses: 'bc-dot-big'
        }));
        if (config.reattempt !== undefined) {
            rows.push(rowStep({
                name: 'Reattempt', owner: `Reattempt ${partId}`, where: config.reattempt,
                date: config.reattempt_date,
                due: config.reattempt_when || (config.reattempt_date ? shortDate(config.reattempt_date) : null),
                classes: 'bc-alt', dotClasses: 'bc-dot-alt'
            }));
        }
        linkRows(rows).forEach(row => list.append(row));
        card.append(list);
        wrap.append(card);
        section.append(wrap);
        return section;
    }

    // ---------- sections ----------

    function renderBlock(part, block) {
        if (rowCards) return renderBlockRows(part, block);
        const section = element('div', 'block');
        section.id = schema.blockElementId(block.block);
        section.append(element('h1', 'subtitle', `Block ${block.block} | ${block.title}`));
        const description = element('p', 'block-description');
        appendInlineText(description, block.description);
        section.append(description);

        const path = element('div', `path${block.practice === false ? ' path-solo' : ''}`);
        path.append(episodePanel(block.block, block));
        if (block.practice !== false) {
            const steps = element('ol', 'path-steps');
            blockSteps(part, block).forEach(step => steps.append(step));
            path.append(steps);
        }
        section.append(path);
        return section;
    }

    function renderCheckpoint(config) {
        if (rowCards) return renderCheckpointRows(config);
        const word = schema.checkpointWord(course);
        const demo = config.demo || {};
        const section = element('div', 'block checkpoint');
        section.id = schema.checkpointElementId(course);
        section.append(element('h1', 'subtitle', `${word} ${partId}`));
        const description = element('p', 'block-description');
        appendInlineText(description, config.description || '');
        section.append(description);

        const path = element('div', 'path');
        const episode = element('div', 'path-episode');
        if (demo.video) episode.dataset.videoId = demo.video;
        episode.append(videoPanel(`Demo ${partId}`, demo.video));
        const episodeName = element('p', 'path-name');
        episodeName.append(document.createTextNode(`${demo.name || `Demo ${partId} Walkthrough`} `));
        const walkthrough = element('span', 'path-desc');
        appendInlineText(walkthrough, demo.description || `Attempt Demo ${partId} first, then walk through with me.`, true);
        episodeName.append(walkthrough);
        episode.append(episodeName);
        path.append(episode);

        const steps = element('ol', 'path-steps path-checkpoint');
        // Steps written under the checkpoint (a wrap-up session) come before the Demo.
        items(config.steps).forEach(step => steps.append(explicitStep(step, 'path-step-pre')));
        steps.append(pathStep({ name: `Demo ${partId}`, where: 'home', links: items(demo.links), classes: 'path-step-demo' }));
        const extras = items(config.extras);
        extras.forEach((extra, index) => steps.append(extraStep(extra, index === 0)));
        steps.append(pathStep({
            name: `${word} ${partId}`,
            where: 'in class',
            links: items(config.links),
            date: config.date,
            due: config.when || (config.date ? shortDate(config.date) : null),
            classes: `path-step-checkpoint${extras.length ? ' path-step-cont' : ''}`,
            dotClasses: 'path-dot-big'
        }));
        if (config.reattempt !== undefined) {
            // Like the checkpoint's own date and when: the date is shown as its day, and
            // reattempt_when replaces that wording.
            steps.append(pathStep({
                name: 'Reattempt',
                where: config.reattempt,
                date: config.reattempt_date,
                due: config.reattempt_when || (config.reattempt_date ? shortDate(config.reattempt_date) : null),
                classes: 'path-step-alt',
                dotClasses: 'path-dot-alt'
            }));
        }
        if (config.next !== undefined) {
            const next = element('li', 'path-step path-step-next');
            next.setAttribute('aria-hidden', 'true');
            const dot = element('span', 'path-dot');
            dot.setAttribute('aria-hidden', 'true');
            const body = element('div');
            body.append(element('p', 'path-name', `Part ${config.next}`));
            next.append(dot, body);
            steps.append(next);
        }
        path.append(steps);
        section.append(path);
        return section;
    }

    function renderProject(project) {
        const section = element('div', 'block checkpoint');
        section.id = project.id;
        section.append(element('h1', 'subtitle', project.title));
        const description = element('p', 'block-description');
        appendInlineText(description, project.description || '');
        section.append(description);

        const path = element('div', 'path');
        const prompts = element('div', 'path-episode path-text');
        items(project.prompts).forEach(prompt => {
            const detail = element('p', 'project-detail');
            detail.append(element('span', `project-label ${prompt.kind}`, prompt.label), document.createTextNode(' '), element('i', null, prompt.text));
            prompts.append(detail);
        });
        path.append(prompts);

        const steps = element('ol', 'path-steps path-checkpoint path-project');
        const item = element('li', 'path-step path-step-checkpoint');
        const dot = element('span', 'path-dot path-dot-big');
        dot.setAttribute('aria-hidden', 'true');
        const body = element('div');
        body.append(element('p', 'path-name', project.title));
        const requirements = element('ol', 'path-brief');
        items(project.requirements).forEach(requirement => requirements.append(element('li', null, requirement)));
        body.append(requirements);
        const rendered = links(items(project.links));
        if (rendered) body.append(rendered);
        item.append(dot, body);
        steps.append(item);
        path.append(steps);
        section.append(path);
        return section;
    }

    function renderDescription(container, part) {
        const errorMessage = container.querySelector('[data-course-error]');
        container.replaceChildren();
        container.append(element('h1', 'title title-tight', `Part ${partId} | ${part.title}`));
        const tagline = String(part.tagline || '');
        container.append(element('i', 'subtitle-text', tagline.charAt(0).toUpperCase() + tagline.slice(1)));
        if (errorMessage) container.append(errorMessage);
        items(part.links).forEach(item => container.append(document.createTextNode(' '), resourceLink(item)));
        container.append(element('hr', 'title-rule'), element('p', null, part.introduction));
    }

    // ---------- navigation ----------

    function partPage(id) {
        return `part-${String(id).toLowerCase()}.html`;
    }

    function renderLeftNavigation() {
        if (!leftSlot) return;
        const meta = course.course;
        const nav = element('nav');
        nav.setAttribute('aria-label', 'Course');
        const list = element('ul');
        items(meta.brand).forEach(line => {
            if (meta.home) {
                const brand = element('a', 'brand', line);
                brand.href = meta.home;
                list.append(brand);
            } else {
                list.append(element('span', null, line));
            }
        });
        list.append(element('hr', 'nav-hr'));

        const notes = items(meta.nav).filter(item => item.lines !== undefined);
        notes.forEach(item => {
            const li = element('li', 'nav-note');
            li.append(element('span', 'nav-note-label', item.label));
            items(item.lines).forEach(line => {
                const row = element('span', 'nav-note-line');
                appendInlineText(row, line);
                li.append(row);
            });
            list.append(li);
        });
        const buttons = items(meta.nav).filter(item => item.button);
        buttons.forEach(item => {
            const li = element('li', 'nav-item-no-margin');
            const link = element('a', 'btn', item.label);
            link.href = item.file;
            link.target = '_blank';
            link.rel = 'noopener';
            li.append(link);
            list.append(li);
        });
        if (notes.length || buttons.length) list.append(element('hr', 'nav-hr-top'));

        Object.keys(course.parts).forEach(id => {
            const li = element('li');
            const link = element('a', id === partId ? 'active' : null, `Part ${id}`);
            link.href = partPage(id);
            if (id === partId) link.setAttribute('aria-current', 'page');
            li.append(link);
            list.append(li);
        });
        items(meta.nav).filter(item => !item.button && item.lines === undefined).forEach(item => {
            const li = element('li');
            const link = element('a', null, item.label);
            link.href = item.file;
            li.append(link);
            list.append(li);
        });
        nav.append(list);
        leftSlot.replaceChildren(nav);
    }

    function renderRightNavigation(part) {
        if (!rightSlot) return;
        // short, name and date also ride along as data attributes for the phone toolbar's
        // contents sheet (course.js), which has room for a block's full title. Its date is the
        // class day; without one, the first dated step's, read as a due date when it is homework
        // or carries due: (econ-0150 dates only its homework). A checkpoint shows its own day.
        const day = value => shortDate(schema.firstDate(value));
        const entries = [];
        items(part.sections).forEach(section => {
            if (section.block !== undefined) {
                const step = items(section.steps).find(candidate => candidate && candidate.date);
                const date = section.dates && section.dates.class ? day(section.dates.class)
                    : step ? `${step.kind === 'homework' || step.due ? 'Due ' : ''}${day(step.date)}` : '';
                entries.push({ href: `#${schema.blockElementId(section.block)}`, label: `${section.block} | ${section.nav}`, short: String(section.block), name: section.title || section.nav, date });
            } else if (section.checkpoint !== undefined) {
                const word = schema.checkpointWord(course);
                const date = (section.checkpoint || {}).date;
                entries.push({ href: `#${schema.checkpointElementId(course)}`, label: word, name: `${word} ${partId}`, date: date ? day(date) : '' });
            } else if (section.project !== undefined) {
                entries.push({ href: `#${section.project.id}`, label: section.project.nav, name: section.project.nav });
            }
        });
        const nav = element('nav');
        nav.setAttribute('aria-label', 'On this page');
        const list = element('ul');
        list.append(element('span', null, 'Contents'), element('hr', 'nav-hr-right'));
        entries.forEach((entry, index) => {
            const li = element('li', index === 0 ? 'nav-item-no-margin' : null);
            const link = element('a', `nav-link-right${index === 0 ? ' active' : ''}`, entry.label);
            link.href = entry.href;
            if (entry.short) link.dataset.short = entry.short;
            link.dataset.name = entry.name;
            if (entry.date) link.dataset.date = entry.date;
            li.append(link);
            list.append(li);
        });
        nav.append(list);
        rightSlot.replaceChildren(nav);
    }

    // ---------- the course column ----------

    // A course on the row card gets all its navigation in one column, in the left slot: a long
    // dash opening it for home (MICRO ECON), a letter for each part, a dash for each
    // block of the part on screen (faint dashes for the other parts' blocks, which link to them),
    // and a long dash closing the semester, named for the last checkpoint. Two short blue dashes
    // bracket the page's own stretch of it. On a wide window the names sit beside it; course.js
    // sizes it, follows the reader down the page, and on narrow windows and phones keeps it to the
    // dashes and letters until it is opened into a card.
    // On a narrow window the house stands on home's dash in place of MICRO ECON, drawn as wide as the
    // dash (20 px) in the ticks' 2 px stroke.
    const HOUSE = '<svg viewBox="0 0 20 18" aria-hidden="true"><path d="M1 8.2L10 1l9 7.2V17H1z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>';

    // What a section adds to the column: a block, the checkpoint, or a project.
    function columnEntry(id, section) {
        if (section.block !== undefined) {
            // the column shows a block's short nav name; its tooltip, the full title
            return { kind: 'block', id: String(section.block), title: section.title || section.nav, label: section.nav || section.title, anchor: schema.blockElementId(section.block) };
        }
        if (section.checkpoint !== undefined) {
            const name = `${schema.checkpointWord(course)} ${id}`;
            return { kind: 'cp', id: '', title: name, label: name, anchor: schema.checkpointElementId(course) };
        }
        if (section.project !== undefined) return { kind: 'block', id: '', title: section.project.nav, label: section.project.nav, anchor: section.project.id };
        return null;
    }

    // One row: a glyph on the column, a name beside it. A row for this page scrolls to its
    // section (data-target); any other row is an ordinary link.
    function columnRow(kind, { href, target, here = false, mine = false, tip = '' } = {}) {
        const linked = href !== undefined || target !== undefined;
        const row = element(linked ? 'a' : 'span', `cc-r cc-${kind}${here ? ' cc-here' : ''}`);
        if (linked) row.href = target !== undefined ? `#${target}` : href;
        if (target !== undefined) row.dataset.target = target;
        if (mine) row.dataset.mine = '';
        if (here) row.setAttribute('aria-current', 'page');
        if (tip) row.dataset.tip = tip;
        const glyph = element('span', 'cc-g');
        glyph.setAttribute('aria-hidden', 'true');
        row.append(glyph, element('span', 'cc-l'));
        return row;
    }

    function columnLine(row, id, title) {
        const line = element('span', 'cc-line');
        if (id) line.append(element('span', 'cc-id', id));
        line.append(element('span', 'cc-t', title));
        row.querySelector('.cc-l').append(line);
        row.querySelector('.cc-g').append(element('i'));
        return row;
    }

    // currentId is the part on screen, or null on the course's home page, whose own sections
    // (headings marked data-course-nav) then take the place of a part's blocks.
    function renderCourseColumn(currentId) {
        if (!leftSlot) return;
        const meta = course.course;
        const onHome = currentId === null;
        const home = meta.home || '';
        const brand = () => {
            const mark = element('span', 'cc-brand');
            items(meta.brand).forEach(line => mark.append(element('span', null, line)));
            return mark;
        };
        const nav = element('nav', 'cc');
        nav.setAttribute('aria-label', 'Course');
        const list = element('div', 'cc-rows');
        const homeLink = onHome ? { href: '#' } : home ? { href: home } : {};   // '#': the top of this page
        const brandText = items(meta.brand).join(' ');

        const homeRow = columnRow('home', { ...homeLink, here: onHome, mine: onHome, tip: `${brandText} · course page` });
        homeRow.querySelector('.cc-g').innerHTML = HOUSE;
        homeRow.querySelector('.cc-g').append(element('i'));
        homeRow.querySelector('.cc-l').append(brand());
        list.append(homeRow);
        // the brackets around this page's stretch of the column: above its part's letter (the course
        // page has home's dash for that) and below its last row
        const bracket = place => {
            const row = columnRow('brk');
            row.classList.add(`cc-brk-${place}`);
            row.setAttribute('aria-hidden', 'true');
            row.querySelector('.cc-g').append(element('i'));
            return row;
        };

        if (onHome) {
            document.querySelectorAll('main [data-course-nav]').forEach(heading => {
                const holder = heading.id ? heading : heading.closest('[id]');
                if (!holder) return;
                const title = heading.dataset.courseNav || heading.textContent.trim();
                list.append(columnLine(columnRow('block', { target: holder.id, mine: true, tip: title }), '', title));
            });
            list.append(bracket('end'));
        }

        const ids = Object.keys(course.parts);
        ids.forEach(id => {
            const part = course.parts[id];
            const here = id === currentId;
            const letter = columnRow('part', here ? { href: '#', here: true, mine: true } : { href: partPage(id) });
            letter.dataset.tip = `Part ${id}  ${part.title}`;
            letter.querySelector('.cc-g').textContent = id;
            letter.querySelector('.cc-l').append(element('span', 'cc-t', part.title));
            if (here) list.append(bracket('top'));
            list.append(letter);
            items(part.sections).forEach(section => {
                const entry = columnEntry(id, section);
                if (!entry) return;
                const tip = entry.id ? `${entry.id}  ${entry.title}` : entry.title;
                if (here) list.append(columnLine(columnRow(entry.kind, { target: entry.anchor, mine: true, tip }), entry.id, entry.label));
                else {
                    const faint = columnRow('faint', { href: `${partPage(id)}#${entry.anchor}`, tip });
                    faint.querySelector('.cc-g').append(element('i'));
                    faint.setAttribute('aria-label', `Part ${id}: ${tip}`);
                    list.append(faint);
                }
            });
            if (here) list.append(bracket('end'));
        });

        // the closing dash: the last checkpoint, when the last part has one
        const lastId = ids[ids.length - 1];
        const closing = lastId !== undefined && items(course.parts[lastId].sections).some(section => section.checkpoint !== undefined);
        const anchor = schema.checkpointElementId(course);
        const endTitle = closing ? `${schema.checkpointWord(course)} ${lastId}` : '';
        const end = columnRow('end', !closing ? {} : lastId === currentId ? { target: anchor } : { href: `${partPage(lastId)}#${anchor}` });
        if (endTitle) end.dataset.tip = endTitle;
        columnLine(end, '', endTitle);
        list.append(end);

        nav.append(list);
        leftSlot.replaceChildren(nav);
        document.documentElement.classList.add('has-course-column');
        // Framed (Canvas), a page zooms itself out to show its desktop layout whole (the inline script
        // in each page's head). A row-card course reads well at any width, so it takes the frame's own
        // width instead: the zoom comes off and stays off.
        if (document.documentElement.classList.contains('embedded')) {
            if (typeof window.fitEmbed === 'function') window.removeEventListener('resize', window.fitEmbed);
            document.documentElement.style.zoom = '';
        }
    }

    // ---------- conventional files ----------

    // A page opened from disk has an opaque origin where every fetch is refused, but the
    // browser still lets it load a neighbouring <link>, which fires load or error according
    // to whether the file is there. Nothing is executed and the element is removed at once.
    function existsOnDisk(path) {
        return new Promise(resolve => {
            const probe = document.createElement('link');
            probe.rel = 'stylesheet';
            probe.onload = () => { probe.remove(); resolve(true); };
            probe.onerror = () => { probe.remove(); resolve(false); };
            probe.href = path;
            document.head.append(probe);
        });
    }

    // Served over http(s) a HEAD request answers directly and sees only what is published.
    async function exists(path) {
        if (location.protocol === 'file:') return existsOnDisk(path);
        for (let attempt = 0; attempt < 2; attempt += 1) {
            try {
                return (await fetch(path, { method: 'HEAD' })).ok;
            } catch (error) {
                // A rejected fetch is a transport fault, not a 404; give it one more try.
            }
        }
        return false;
    }

    async function discoverBlockFiles(part) {
        const probes = [];
        items(part.sections).forEach(section => {
            if (section.block === undefined) return;
            schema.blockCandidates(course, section).forEach(([key, path]) => {
                probes.push(exists(path).then(ok => ({ block: section.block, key, path, ok })));
            });
        });
        const found = {};
        (await Promise.all(probes)).forEach(result => {
            if (result.ok) (found[result.block] ||= {})[result.key] = result.path;
        });
        return found;
    }

    // ---------- page ----------

    function renderPart(part) {
        renderDescription(page.querySelector('[data-course-description]'), part);
        const fragment = document.createDocumentFragment();
        items(part.sections).forEach(section => {
            if (section.block !== undefined) fragment.append(renderBlock(part, section));
            else if (section.checkpoint !== undefined) fragment.append(renderCheckpoint(section.checkpoint));
            else if (section.project !== undefined) fragment.append(renderProject(section.project));
        });
        fragment.append(element('div', 'bottom-spacer'));
        output.replaceChildren(fragment);
        if (rowCards && leftSlot) {
            renderCourseColumn(partId);
            if (rightSlot) rightSlot.replaceChildren();
        } else {
            renderLeftNavigation();
            renderRightNavigation(part);
        }
        document.title = `${course.course.code} | Part ${partId}`;
        const wrapper = document.querySelector('.wrapper');
        if (wrapper) wrapper.classList.add(`course-${course.course.code.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`);
    }

    // course.js wires up video cards, the right-nav scroll spy, the mobile nav bar and the
    // date marks. It runs itself as soon as it loads when the document is already parsed,
    // so inserting it after the render means it runs exactly once, on the finished page.
    function enhance() {
        const script = document.createElement('script');
        script.src = `${assetsBase}course.js`;
        document.head.append(script);
    }

    // Students see a calm maintenance note; the actual problem goes to the console, and is
    // spelled out on the page only when it is being previewed from disk or a local server.
    function showError(error) {
        page.removeAttribute('aria-busy');
        const loading = page.querySelector('[data-course-loading]');
        if (loading) loading.hidden = true;
        const message = page.querySelector('[data-course-error]');
        if (message) {
            const local = location.protocol === 'file:' || /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
            const text = local
                ? `The course content could not be loaded. ${error.message}`
                : 'This page is being updated and will be back shortly. Please check again in a few minutes.';
            message.hidden = false;
            message.replaceChildren(document.createTextNode(text));
        }
        console.error(error);
    }

    function readSource() {
        if (typeof window.COURSE_CONTENT_YAML !== 'string') throw new Error(`${SOURCE} did not load.`);
        return window.COURSE_CONTENT_YAML;
    }

    // The course's home page: once its deferred scripts (the course content among them) have run,
    // read the YAML and draw the course column, if the course uses one.
    async function loadHome() {
        if (document.readyState === 'loading') await new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve, { once: true }));
        try {
            if (!window.jsyaml || typeof window.jsyaml.load !== 'function') throw new Error('The YAML reader did not load.');
            schema = window.CourseSchema;
            if (!schema) throw new Error('course-schema.js did not load.');
            const { course: validated, errors } = schema.validate(window.jsyaml.load(readSource(), { maxDepth: 100 }));
            if (errors.length) throw new Error(`${SOURCE} has ${errors.length} problem${errors.length === 1 ? '' : 's'}; the first is ${errors[0]}`);
            course = validated;
            rowCards = usesRowCards();
            if (!rowCards) return;
            renderCourseColumn(null);
            page.dataset.courseReady = 'true';
            enhance();
            document.dispatchEvent(new CustomEvent('course-content-ready', { detail: { part: null } }));
        } catch (error) {
            console.error(error);   // the page itself is written by hand and still reads fine without the column
        }
    }

    async function load() {
        try {
            if (!output) throw new Error('The page shell has no data-course-output slot.');
            if (!window.jsyaml || typeof window.jsyaml.load !== 'function') throw new Error('The YAML reader did not load.');
            schema = window.CourseSchema;
            if (!schema) throw new Error('course-schema.js did not load.');
            const data = window.jsyaml.load(readSource(), { maxDepth: 100 });
            const { course: validated, errors } = schema.validate(data);
            if (errors.length) throw new Error(`${SOURCE} has ${errors.length} problem${errors.length === 1 ? '' : 's'}; the first is ${errors[0]}`);
            course = validated;
            rowCards = usesRowCards();
            if (partId === 'current') {
                partId = schema.currentPart(course, today());
                page.dataset.coursePart = partId;
            }
            const part = course.parts[partId];
            if (!part) throw new Error(`Part ${partId} is missing from ${SOURCE}.`);

            discoveredFiles = await discoverBlockFiles(part);
            renderPart(part);
            page.removeAttribute('aria-busy');
            page.dataset.courseReady = 'true';
            enhance();
            if (location.hash) {
                requestAnimationFrame(() => {
                    const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
                    if (target) target.scrollIntoView();
                });
            }
            document.dispatchEvent(new CustomEvent('course-content-ready', { detail: { part: partId } }));
        } catch (error) {
            showError(error);
        }
    }

    if (homePage) loadHome(); else load();
}());
