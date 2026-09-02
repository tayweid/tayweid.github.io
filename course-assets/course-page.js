/* course-page.js — renders a course part page in the browser from course-content.yaml.js.
 *
 * Shared by every course site. A part page is a thin shell: an empty left-nav slot, a
 * <main data-course-part="A"> with a loading line, an output slot, and an empty right-nav
 * slot. Everything visible comes from the YAML, validated first by course-schema.js so the
 * page and the checker can never disagree. The format is documented in COURSE_CONTENT.md.
 *
 * Loaded by the shell's bootstrap after js-yaml.min.js and course-schema.js. When the page
 * is done it inserts course.js (from the same base) to wire up video cards, the scroll spy,
 * and the mobile nav.
 */
(function () {
    'use strict';

    const page = document.querySelector('[data-course-part]');
    if (!page) return;
    page.setAttribute('aria-busy', 'true');

    const partId = page.dataset.coursePart;
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

    function shortDate(iso) {
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
        if (date) step.dataset.date = date;
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
    function explicitStep(step) {
        const livestream = step.kind === 'livestream';
        return pathStep({
            name: step.name,
            where: step.where || schema.STEP_KINDS[step.kind] || '',
            sub: step.sub,
            links: items(step.links),
            date: step.date,
            due: step.due ? (/^due\b/i.test(step.due) ? step.due : `Due ${step.due}`) : null,
            video: step.video,
            classes: livestream ? 'path-step-alt' : '',
            dotClasses: livestream ? 'path-dot-alt' : ''
        });
    }

    function vignetteLinks(vignette, blockFiles) {
        if (vignette.links) return items(vignette.links);
        if (vignette.files === false) return [];
        const found = [];
        if (blockFiles.vignette) found.push({ label: 'Vignette', file: blockFiles.vignette });
        if (vignette.solutions === true && blockFiles.vignette_sols) found.push({ label: 'Solutions', file: blockFiles.vignette_sols });
        return found;
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

        const homeworkLinks = [];
        if (homework.links) {
            homeworkLinks.push(...items(homework.links));
        } else {
            const file = schema.explicitPath(homework.file) ? homework.file : blockFiles.homework;
            if (homework.file && file) homeworkLinks.push({ label: 'Homework', file });
            if (homework.solutions === true) {
                const sols = schema.explicitPath(homework.solution_file) ? homework.solution_file : blockFiles.homework_sols;
                if (sols) homeworkLinks.push({ label: 'Solutions', file: sols });
            }
        }
        const due = dates.homework ? shortDate(dates.homework) : homework.due;

        const standard = [
            { date: dates.class, index: 0, node: pathStep({
                name: exercise.name || `Exercise ${blockId}`,
                where: 'in class',
                links: exercise.links ? items(exercise.links) : (blockFiles.exercise ? [{ label: 'Exercise', file: blockFiles.exercise }] : []),
                date: dates.class,
                video: exercise.video
            }) },
            { date: dates.recitation, index: 1, node: pathStep({
                name: vignette.name || `Vignette ${blockId}`,
                where: 'recitation',
                links: vignetteLinks(vignette, blockFiles),
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
        if (standard.every(step => step.date)) {
            standard.sort((left, right) => left.date.localeCompare(right.date) || left.index - right.index);
        }
        return standard.map(step => step.node);
    }

    function blockSteps(part, block) {
        const extras = items(block.extras).map(extra => extraStep(extra, false));
        const steps = block.steps ? items(block.steps).map(explicitStep) : conventionalSteps(part, block);
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

    // ---------- sections ----------

    function renderBlock(part, block) {
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
        steps.append(pathStep({ name: `Demo ${partId}`, where: 'home', links: items(demo.links) }));
        const extras = items(config.extras);
        extras.forEach((extra, index) => steps.append(extraStep(extra, index === 0)));
        steps.append(pathStep({
            name: `${word} ${partId}`,
            where: 'in class',
            date: config.date,
            due: config.when || (config.date ? shortDate(config.date) : null),
            classes: `path-step-checkpoint${extras.length ? ' path-step-cont' : ''}`,
            dotClasses: 'path-dot-big'
        }));
        if (config.reattempt !== undefined) {
            steps.append(pathStep({ name: 'Reattempt', where: config.reattempt, classes: 'path-step-alt', dotClasses: 'path-dot-alt' }));
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
        const entries = [];
        items(part.sections).forEach(section => {
            if (section.block !== undefined) entries.push({ href: `#${schema.blockElementId(section.block)}`, label: `${section.block} | ${section.nav}` });
            else if (section.checkpoint !== undefined) entries.push({ href: `#${schema.checkpointElementId(course)}`, label: schema.checkpointWord(course) });
            else if (section.project !== undefined) entries.push({ href: `#${section.project.id}`, label: section.project.nav });
        });
        const nav = element('nav');
        nav.setAttribute('aria-label', 'On this page');
        const list = element('ul');
        list.append(element('span', null, 'Contents'), element('hr', 'nav-hr-right'));
        entries.forEach((entry, index) => {
            const li = element('li', index === 0 ? 'nav-item-no-margin' : null);
            const link = element('a', `nav-link-right${index === 0 ? ' active' : ''}`, entry.label);
            link.href = entry.href;
            li.append(link);
            list.append(li);
        });
        nav.append(list);
        rightSlot.replaceChildren(nav);
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
        renderLeftNavigation();
        renderRightNavigation(part);
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

    load();
}());
