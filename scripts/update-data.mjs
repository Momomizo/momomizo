import {gunzipSync} from 'node:zlib';
import {writeFile} from 'node:fs/promises';
const response=await fetch('https://www.edrdg.org/kanjidic/kanjidic2.xml.gz',{signal:AbortSignal.timeout(60000)});
if(!response.ok)throw Error(`KANJIDIC2 download failed: ${response.status}`);
const xml=gunzipSync(Buffer.from(await response.arrayBuffer())).toString('utf8');
const text=(s,t)=>s.match(new RegExp(`<${t}>(.*?)</${t}>`,'s'))?.[1]??null;
const data={};
for(const match of xml.matchAll(/<character>([\s\S]*?)<\/character>/g)){
 const s=match[1],literal=text(s,'literal'),count=Number(text(s,'stroke_count'));
 if(!literal||!count)continue;
 data[literal]={s:count,r:[...s.matchAll(/<reading r_type="ja_(?:on|kun)">(.*?)<\/reading>/g)].map(x=>x[1]),n:[...s.matchAll(/<nanori>(.*?)<\/nanori>/g)].map(x=>x[1]),g:text(s,'grade')};
}
if(Object.keys(data).length<12000)throw Error('Unexpected dictionary size; existing data was not changed.');
await writeFile('public/data/kanji.json',JSON.stringify(data));
console.log(`Updated ${Object.keys(data).length} characters. Run npm test and redeploy.`);
