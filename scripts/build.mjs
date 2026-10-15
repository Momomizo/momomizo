import {cp,mkdir,rm,copyFile} from 'node:fs/promises';
await rm('dist',{recursive:true,force:true}); await mkdir('dist');
await cp('public','dist',{recursive:true});
for(const f of ['index.html']) await copyFile(f,`dist/${f}`);
for(const f of ['app.js','engine.js','styles.css']) await copyFile(`src/${f}`,`dist/${f}`);
console.log('Built dist/ — static site, no runtime secrets or server required.');
