import{D as x}from"./index-CnwhlIsf.js";function E(h,p=()=>{}){const u=[],m=[];{const e=[];h.forEach(t=>{t.type.name==="doc_title"&&t.textContent&&e.push(`title: "${t.textContent.replace(/"/g,'\\"')}"`),t.type.name==="doc_authors"&&t.textContent&&e.push(`author: "${t.textContent.replace(/"/g,'\\"')}"`),t.type.name==="doc_date"&&t.textContent&&e.push(`date: "${t.textContent.replace(/"/g,'\\"')}"`)});const a=h.attrs.settings;JSON.stringify(a)!==JSON.stringify(x)&&p("document settings (page, font, numbering) are not stored in Markdown — save as .typ to keep them"),e.length&&u.push(`---
${e.join(`
`)}
---`)}const _=e=>e.replace(/([\\`*[\]$])/g,"\\$1").replace(/(^|\s)_/g,"$1\\_").replace(/_(?=\s|$)/g,"\\_"),f=e=>{let a="";return e.forEach(t=>{if(t.isText&&t.text){let r="";const i=t.marks,o=s=>i.some(c=>c.type.name===s);o("code")?r="`"+t.text+"`":(r=_(t.text),o("strong")&&(r=`**${r}**`),o("em")&&(r=`*${r}*`));const g=i.find(s=>s.type.name==="link");g&&(r=`[${r}](${g.attrs.href})`),a+=r;return}switch(t.type.name){case"math_inline":a+=`$${t.attrs.src}$`;break;case"citation":a+=`[@${t.attrs.key}]`;break;case"eq_ref":a+=`@${t.attrs.label}`;break;case"hard_break":a+=`\\
`;break;case"footnote":{const r=m.length+1;m.push(f(t)),a+=`[^${r}]`;break}default:a+=_(t.textContent)}}),a},y=e=>{(e.attrs.params||e.attrs.caption||e.attrs.label)&&p("table styling/captions are not representable in Markdown — simplified to a plain table");const a=[],t=[];if(e.forEach(s=>{const c=[];s.forEach(n=>{let l="";n.forEach(k=>{l&&(l+=" "),l+=f(k)}),(n.attrs.colspan>1||n.attrs.rowspan>1)&&p("merged table cells flattened for Markdown"),(a.length===0||t.length<c.length+1)&&t.push(n.attrs.align??null),c.push(l.replace(/\|/g,"\\|"))}),a.push(c)}),!a.length)return"";const r=Math.max(...a.map(s=>s.length)),i=s=>[...s,...new Array(r-s.length).fill("")],o=s=>`| ${i(s).join(" | ")} |`,g=`| ${new Array(r).fill(0).map((s,c)=>{const n=t[c];return n==="center"?":---:":n==="right"||n==="decimal"?"---:":"---"}).join(" | ")} |`;return[o(a[0]),g,...a.slice(1).map(o)].join(`
`)},$=(e,a="")=>{switch(e.type.name){case"paragraph":return f(e);case"heading":return`${"#".repeat(e.attrs.level)} ${f(e)}`;case"math_display":{const t=e.attrs.label?` {#${e.attrs.label}}`:"";return`$$
${e.attrs.src}
$$${t}`}case"code_block":{const t=e.attrs.params;return`\`\`\`${t==="typst-raw"?"typst":t}
${e.textContent}
\`\`\``}case"blockquote":{const t=[];return e.forEach(r=>t.push($(r,a))),t.join(`
>
`).replace(/^/gm,"> ")}case"abstract":{const t=[];return e.forEach((r,i,o)=>t.push((o===0?"**Abstract.** ":"")+$(r,a))),t.join(`
>
`).replace(/^/gm,"> ")}case"bullet_list":case"ordered_list":{const t=e.type.name==="ordered_list",r=e.attrs.order||1,i=[];return e.forEach((o,g,s)=>{const c=t?`${r+s}. `:"- ",n=" ".repeat(c.length),l=[];o.forEach(k=>l.push($(k,a+n))),i.push(c+l.join(`

${n}`).replace(/\n(?!\n)/g,`
${n}`))}),i.join(`
`)}case"figure":{const t=e.attrs.src;return t.startsWith("data:")&&p("embedded figure written as a data: URL — consider a project folder"),e.attrs.label&&p(`figure label @${e.attrs.label} is not representable in Markdown`),`![${f(e)}](${t})`}case"table":return y(e);case"horizontal_rule":return"---";case"page_break":return"```typst\n#pagebreak()\n```";case"numbering_restart":return'```typst\n#pagebreak()\n#set page(numbering: "1")\n#counter(page).update(1)\n```';case"bibliography":return"";case"doc_title":case"doc_authors":case"doc_date":return"";default:return p(`"${e.type.name}" has no Markdown form — kept as Typst`),"```typst\n// unsupported block\n```"}};h.forEach(e=>{const a=$(e);a&&u.push(a)}),m.length&&u.push(m.map((e,a)=>`[^${a+1}]: ${e}`).join(`
`));const b=h.attrs.bib;return b!=null&&b.content&&u.push("```bibtex\n"+b.content.trim()+"\n```"),u.filter(Boolean).join(`

`)+`
`}export{E as docToMd};
