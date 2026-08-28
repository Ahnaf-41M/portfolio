// Build step for Cloudflare Pages (and local `npm run build`).
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
  linkedin: 'Linkedin',
  prometheus: 'Prometheus',
  grafana: 'Grafana',
  jira: 'Jira',
  codeforces: 'Codeforces',
  codechef: 'Codechef',
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
console.log(`\n✓ built ${OUT}/  (${Object.keys(BRANDS).length - missing.length} brand icons, styles.css ${kb} KB)`);
