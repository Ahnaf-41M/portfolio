// Build the site into dist/ (run by `npm run build` and the CI workflow).
//  1. wipe dist/
//  2. copy static/ verbatim
//  3. inject brand-icon <symbol>s (from simple-icons) into the sprite placeholder
//  4. compile Tailwind into dist/styles.css
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import * as si from 'simple-icons';

const OUT = 'dist';

// id used in markup (#b-<id>)  ->  simple-icons export suffix
const BRANDS = {
  ruby: 'Ruby',
  rails: 'Rubyonrails',
  springboot: 'Springboot',
  java: 'Openjdk',
  cpp: 'Cplusplus',
  javascript: 'Javascript',
  react: 'React',
  hotwire: 'Hotwire',
  postgresql: 'Postgresql',
  mysql: 'Mysql',
  redis: 'Redis',
  docker: 'Docker',
  ansible: 'Ansible',
  git: 'Git',
  github: 'Github',
  prometheus: 'Prometheus',
  grafana: 'Grafana',
  jira: 'Jira',
  codeforces: 'Codeforces',
  codechef: 'Codechef',
};

// Icons simple-icons dropped for trademark reasons (LinkedIn removed in v14).
// Vendored here as 24x24 paths so `#b-<id>` keeps working.
const VENDORED = {
  linkedin:
    'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
};

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
fs.cpSync('static', OUT, { recursive: true });

let symbols = '';
const missing = [];
for (const [id, suffix] of Object.entries(BRANDS)) {
  const icon = si['si' + suffix];
  if (!icon) {
    missing.push(suffix);
    continue;
  }
  symbols += `\n        <symbol id="b-${id}" viewBox="0 0 24 24"><path d="${icon.path}" /></symbol>`;
}
for (const [id, path] of Object.entries(VENDORED)) {
  symbols += `\n        <symbol id="b-${id}" viewBox="0 0 24 24"><path d="${path}" /></symbol>`;
}
if (missing.length) console.warn('  ! simple-icons missing:', missing.join(', '));

const htmlPath = `${OUT}/index.html`;
let html = fs.readFileSync(htmlPath, 'utf8');
if (!html.includes('<!--BRAND_ICONS-->')) {
  console.warn('  ! <!--BRAND_ICONS--> placeholder not found in index.html');
}
html = html.replace('<!--BRAND_ICONS-->', symbols);
fs.writeFileSync(htmlPath, html);

execSync('npm run build:css', { stdio: 'inherit' });

const kb = (fs.statSync(`${OUT}/styles.css`).size / 1024).toFixed(1);
const iconCount = Object.keys(BRANDS).length - missing.length + Object.keys(VENDORED).length;
console.log(`\n✓ built ${OUT}/  (${iconCount} brand icons, styles.css ${kb} KB)`);
