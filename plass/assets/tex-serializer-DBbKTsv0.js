import{n as L,p as O}from"./index-CnwhlIsf.js";let z={},T=new Set;function E(e){return e.replace(/\\/g,"\0").replace(/([{}$&#%_])/g,"\\$1").replace(/~/g,"\\textasciitilde{}").replace(/\^/g,"\\textasciicircum{}").replace(/\u0000/g,"\\textbackslash{}").replace(/\u2014/g,"---").replace(/\u2013/g,"--").replace(/\u201C/g,"``").replace(/\u201D/g,"''").replace(/\u2018/g,"`").replace(/\u2019/g,"'").replace(/\u2026/g,"\\ldots{}").replace(/\u00A0/g,"~").replace(/\u2318/g,"\\textsf{Cmd-}").replace(/\u2325/g,"\\textsf{Opt-}").replace(/\u21E7/g,"\\textsf{Shift-}").replace(/\u2303/g,"\\textsf{Ctrl-}").replace(/\u22EF/g,"$\\cdots$").replace(/\u00B7/g,"\\textperiodcentered{}")}function h(e){let i="";return e.forEach(t=>{if(t.isText&&t.text){const r=new Set(t.marks.map(m=>m.type.name));let c=E(t.text);r.has("code")&&(c=`\\texttt{${c}}`),r.has("strong")&&(c=`\\textbf{${c}}`),r.has("em")&&(c=`\\emph{${c}}`),i+=c}else if(t.type.name==="math_inline")i+=`$${t.attrs.src}$`;else if(t.type.name==="eq_ref"){const r=t.attrs.label;i+=T.has(r)?E(`@${r}`):/^(fig|tab|sec):/.test(r)?`\\ref{${r}}`:`\\eqref{${r}}`}else t.type.name==="citation"?i+=`\\cite{${t.attrs.key}}`:t.type.name==="footnote"?i+=`\\footnote{${h(t)}}`:t.type.name==="hard_break"?i+=` \\\\
`:t.type.name==="image"&&(i+=`\\includegraphics{${q(t.attrs.src)}}`)}),i}let v=!1;function q(e){return e.startsWith("data:")?(v=!0,"embedded-image.png"):e}function M(e,i){let t="";return e.forEach(r=>{t+=C(r,i)}),t}function F(e,i){const t=[];e.forEach(a=>{const n=[];a.forEach(l=>{n.push({node:l,colspan:l.attrs.colspan??1,rowspan:l.attrs.rowspan??1,header:l.type.name==="table_header",align:l.attrs.align??null})}),t.push(n)});const r=Math.max(...t.map(a=>a.reduce((n,l)=>n+l.colspan,0))),c=t.map(()=>new Array(r).fill(!1)),m=new Array(r).fill("l");t.forEach((a,n)=>{let l=0;for(const u of a){for(;l<r&&c[n][l];)l++;u.align&&!u.header&&(m[l]=u.align==="right"?"r":u.align==="center"?"c":"l");for(let p=1;p<u.rowspan;p++)for(let w=0;w<u.colspan;w++)c[n+p]&&(c[n+p][l+w]=!0);l+=u.colspan}});const g=e.attrs.params||"",f=new Map,b=new Map,$=a=>a==="none"?"none":parseFloat(a??"0.05")>=.07?"heavy":"light";for(const a of g.matchAll(/table\.hline\(\s*y\s*:\s*(\d+)(?:[^)]*?stroke\s*:\s*(none|[\d.]+em))?[^)]*\)/g))f.set(+a[1],$(a[2]));for(const a of g.matchAll(/table\.vline\(\s*x\s*:\s*(\d+)(?:[^)]*?stroke\s*:\s*(none|[\d.]+em))?[^)]*\)/g))b.set(+a[1],$(a[2]));const d=a=>a==="heavy"?"\\midrule[\\heavyrulewidth]":"\\midrule",o=new Map;for(const a of g.matchAll(/table\.hline\(\s*start\s*:\s*(\d+),\s*end\s*:\s*(\d+),\s*y\s*:\s*(\d+)(?:[^)]*?stroke\s*:\s*(none|[\d.]+em))?[^)]*\)/g)){const n=$(a[4]);if(n==="none")continue;const l=+a[3],u=(n==="heavy"?"\\cmidrule[\\heavyrulewidth](lr)":"\\cmidrule(lr)")+`{${+a[1]+1}-${+a[2]}}`,p=o.get(l)??[];p.push(u),o.set(l,p)}const y=a=>{const n=o.get(a);return n?n.join("")+`
`:""},k=a=>{let n="";return a.node.forEach(l=>{n&&(n+=" "),n+=h(l)}),a.header&&(n=`\\textbf{${n}}`),a.rowspan>1&&(n=`\\multirow{${a.rowspan}}{*}{${n}}`),a.colspan>1&&(n=`\\multicolumn{${a.colspan}}{c}{${n}}`),n};let s="";t.forEach((a,n)=>{const l=f.get(n);n>0&&l&&l!=="none"&&(s+=d(l)+`
`),n>0&&(s+=y(n));const u=[];let p=0,w=0;for(;p<r;){if(c[n][p]){u.push(""),p++;continue}const x=a[w++];if(!x)break;u.push(k(x)),p+=x.colspan}s+=u.join(" & ")+` \\\\
`,n===0&&a.some(x=>x.header)&&!f.has(1)&&(s+=`\\midrule
`)});const _=e.attrs.caption||"",j=e.attrs.label||"",S=(a,n)=>{const l=f.get(a);return l?l==="none"?"":d(l)+`
`:n+`
`},P=m.map((a,n)=>b.get(n)&&b.get(n)!=="none"?"|"+a:a).join(""),B=b.get(r)&&b.get(r)!=="none"?"|":"",A=`\\begin{tabular}{${P}${B}}
`+S(0,"\\toprule")+y(0)+s+y(t.length)+S(t.length,"\\bottomrule")+"\\end{tabular}";return _?`\\begin{table}[htbp]
\\centering
\\caption{${E(_)}}
`+(j?`\\label{${j}}
`:"")+`${A}
\\end{table}

`:`\\begin{center}
${A}
\\end{center}

`}function C(e,i){switch(e.type.name){case"paragraph":{const t=h(e);return t.trim()?t+`

`:`~\\par

`}case"heading":{const t=["\\section","\\subsection","\\subsubsection"][Math.min(3,e.attrs.level)-1],r=i.numberSections?"":"*",c=e.attrs.label?`\\label{${e.attrs.label}}`:"";return`${t}${r}{${h(e)}}${c}

`}case"math_display":{const t=e.attrs.label?`\\label{${e.attrs.label}}`:"",r=e.attrs.src,c=e.attrs.numbered??(i.numberEquations||!!e.attrs.label),m=r.split(`
`).map(f=>f.trim()).filter(Boolean),g=(m.length>1||new RegExp("(?<!\\\\)&").test(r))&&!r.includes("\\begin{")?`\\begin{aligned}
${m.join(` \\\\
`)}
\\end{aligned}`:r;return c?`\\begin{equation}${t}
${g}
\\end{equation}

`:`\\[
${g}
\\]

`}case"figure":{const t=e.attrs.label?`\\label{${e.attrs.label}}
`:"",r=h(e);return`\\begin{figure}[htbp]
\\centering
\\includegraphics[width=0.8\\linewidth]{${q(e.attrs.src)}}
`+(r?`\\caption{${r}}
`:"")+t+`\\end{figure}

`}case"bullet_list":case"ordered_list":{const t=e.type.name==="bullet_list"?"itemize":"enumerate";let r=`\\begin{${t}}
`;return e.forEach(c=>{r+="\\item "+M(c,i).trim()+`
`}),r+`\\end{${t}}

`}case"blockquote":return`\\begin{quote}
${M(e,i).trim()}
\\end{quote}

`;case"code_block":return e.attrs.params==="typst-raw"?`% [Plass] raw Typst block with no LaTeX equivalent:
${e.textContent.split(`
`).map(r=>"% "+r).join(`
`)}

`:`\\begin{verbatim}
${e.textContent}
\\end{verbatim}

`;case"table":return F(e);case"bibliography":return`\\bibliographystyle{unsrt}
\\bibliography{refs}

`;case"page_break":return`\\clearpage

`;case"numbering_restart":return`\\clearpage
\\pagenumbering{arabic}

`;case"horizontal_rule":return`\\noindent\\hrulefill

`;case"image":return`\\begin{center}\\includegraphics[width=0.8\\linewidth]{${q(e.attrs.src)}}\\end{center}

`;default:return""}}function R(e){var y,k;const i=L((y=e.attrs)==null?void 0:y.settings);z=O(i.mathMacros),v=!1;const t=i.sizePt<=10.5?10:i.sizePt<=11.5?11:12,r={letter:"letterpaper",a4:"a4paper",legal:"legalpaper",b5:"b5paper"}[i.page]??"letterpaper";let c="",m="",g="",f=null,b=!1,$=!1;e.forEach(s=>{s.type.name==="doc_title"?c=h(s):s.type.name==="doc_authors"?m=h(s):s.type.name==="doc_date"?g=h(s):s.type.name==="abstract"?f=s:s.type.name==="numbering_restart"&&(b=!0)}),e.descendants(s=>((s.type.name==="table_cell"||s.type.name==="table_header")&&(s.attrs.rowspan??1)>1&&($=!0),!0)),T=new Set,e.descendants(s=>(s.type.name==="math_display"&&s.attrs.label&&s.attrs.numbered===!1&&T.add(s.attrs.label),!0));const d=(k=e.attrs)==null?void 0:k.bib;let o=`% Exported from Plass (semantic export: content and structure,
`;o+=`% not layout — your journal template does the formatting).
`,d!=null&&d.content&&(o+=`\\begin{filecontents*}[overwrite]{refs.bib}
${d.content.trim()}
\\end{filecontents*}

`),o+=`\\documentclass[${t}pt,${r}]{article}
`,o+=`\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
`,o+=`\\usepackage{amsmath,amssymb}
\\usepackage{graphicx}
\\usepackage{booktabs}
`,$&&(o+=`\\usepackage{multirow}
`),i.parIndent||(o+=`\\usepackage{parskip}
`),o+=`\\usepackage[${r},top=${i.marginTop}in,right=${i.marginRight}in,bottom=${i.marginBottom}in,left=${i.marginLeft}in]{geometry}
`;for(const[s,_]of Object.entries(z))o+=`\\newcommand{\\${s}}{${_}}
`;return o+=`
`,c&&(o+=`\\title{${c}}
`),m&&(o+=`\\author{${m}}
`),o+=g?`\\date{${g}}
`:c?`\\date{}
`:"",o+=`\\begin{document}

`,b&&(o+=`\\pagenumbering{roman}
`),c&&(o+=`\\maketitle

`),f&&(o+=`\\begin{abstract}
${M(f,i).trim()}
\\end{abstract}

`),e.forEach(s=>{["doc_title","doc_authors","doc_date","abstract"].includes(s.type.name)||(o+=C(s,i))}),o+=`\\end{document}
`,v&&(o=`% NOTE: this document contains pasted (embedded) images. Save the
% paper as a project folder in Plass so figures become real files,
% then re-export; embedded-image.png below is a placeholder name.
`+o),o}export{R as docToTex,E as escapeTex};
