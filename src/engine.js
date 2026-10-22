/** Local reconstruction. Ratings follow the observed original-site 81-number table. */
export const LEVELS={
 '大大吉':{tone:'best',words:['繁栄','幸福','信望','円満','発展'],text:'豊かな可能性と人との縁に恵まれる画数です。感謝を忘れず、自分の力を周囲にも役立てながら歩んでいきましょう。'},
 '大吉':{tone:'best',words:['発展','才能','信頼','成功','調和'],text:'持ち前の力を活かし、周囲との信頼を育てることで道が開ける画数です。目標を定め、一歩ずつ積み重ねていきましょう。'},
 '吉':{tone:'good',words:['努力','堅実','成長','協力','安定'],text:'日々の積み重ねが実を結びやすい画数です。焦らずに自分のペースを守り、人とのつながりを大切にしましょう。'},
 '凶':{tone:'caution',words:['慎重','計画','忍耐','対話','見直し'],text:'物事を丁寧に進めることが大切な画数です。ひとりで抱え込まず、計画を見直したり、周囲と相談したりする時間を持ちましょう。'},
 '大凶':{tone:'caution',words:['用心','休息','準備','協力','継続'],text:'無理をせず、基盤を整えることを意識したい画数です。画数だけで人生は決まりません。十分な準備と周囲の支えを大切にしてください。'}
};
const greatest=new Set([15,24,31]);
const best=new Set([1,3,5,6,11,13,16,21,23,29,32,33,35,37,39,41,45,47,52,61,63,65,67,68,81]);
const good=new Set([7,8,17,18,25,26,38,48,57,58,71,73,75,77,78]);
const worst=new Set([2,4,9,10,12,19,20,34,36,44,54,60,62,64,66,69,70,76,79,80]);
export function fortune(n){const k=(n-1)%81+1;const level=greatest.has(k)?'大大吉':best.has(k)?'大吉':good.has(k)?'吉':worst.has(k)?'大凶':'凶';return {number:n,level,...LEVELS[level]};}
const hiragana={};
for(const [n,chars] of [[1,'くしつてとのへろゝー'],[2,'いうえこすそひめゆよらりるれん'],[3,'あおかきけさせたちになはまみもやわを'],[4,'ぬねふほむ'],[5,'ゐゑ']])for(const c of chars)hiragana[c]=n;
const katakana={};for(const [n,chars] of [[1,'ノヘレーヽ'],[2,'イエカクコスセソトナニヌハヒフマムメヤユラリルワン'],[3,'アウオキケサシタチツテミモヨロ'],[4,'ネホヰヱヲ']])for(const c of chars)katakana[c]=n;
const small={'ぁ':'あ','ぃ':'い','ぅ':'う','ぇ':'え','ぉ':'お','っ':'つ','ゃ':'や','ゅ':'ゆ','ょ':'よ','ゎ':'わ','ァ':'ア','ィ':'イ','ゥ':'ウ','ェ':'エ','ォ':'オ','ッ':'ツ','ャ':'ヤ','ュ':'ユ','ョ':'ヨ','ヮ':'ワ','ヵ':'カ','ヶ':'ケ'};
export function stroke(char,kanji){if(kanji[char])return kanji[char].s;const c=small[char]||char;if(hiragana[c])return hiragana[c];if(katakana[c])return katakana[c];const d=c.normalize('NFD');if(d.length>1&&(d[1]==='\u3099'||d[1]==='\u309a')){const b=stroke(d[0],kanji);return b?b+2:null;}if(c==='々')return 3;return null;}
export function normalize(value){return String(value||'').normalize('NFKC').trim();}
export function characters(value,kanji,max=4){const s=normalize(value);if(!s)throw Error('お名前を入力してください。');if([...s].length>max)throw Error(`${max}文字以内で入力してください。`);const list=[...s].map(char=>({char,strokes:stroke(char,kanji)}));const bad=list.filter(x=>!x.strokes);if(bad.length)throw Error(`「${bad.map(x=>x.char).join('・')}」の画数を確認できません。漢字・ひらがな・カタカナで入力してください。`);return list;}
export function analyze(sei,mei,sex,kanji){if(!['male','female'].includes(sex))throw Error('性別を選択してください。');const a=characters(sei,kanji),b=characters(mei,kanji);const sum=x=>x.reduce((t,c)=>t+c.strokes,0),as=sum(a),bs=sum(b),total=as+bs;
 const specs=[['総格',total,[...a,...b],'人生全体の流れ'],['天格',as,a,'家系・受け継ぐもの'],['地格',bs,b,'個性・若い頃の運勢'],['人格',a.at(-1).strokes+b[0].strokes,[a.at(-1),b[0]],'性格・人との関わり'],['外格',total-a.at(-1).strokes-b[0].strokes+(a.length===1?1:0)+(b.length===1?1:0),[...a.slice(0,-1),...b.slice(1)],'周囲との関係'],['仕事運',as+b[0].strokes,[...a,b[0]],'仕事への向き合い方'],['家庭運',a.at(-1).strokes+bs,[a.at(-1),...b],'家庭・身近な人との関係']];
 return {sei:normalize(sei),mei:normalize(mei),sex,characters:[...a,...b],metrics:specs.map(([name,n,chars,meaning])=>({name,meaning,chars,...fortune(n)}))};}
export function diagnoseName(name,kanji){const chars=characters(name,kanji,40);return {name:normalize(name),chars,...fortune(chars.reduce((t,c)=>t+c.strokes,0))};}
export const rank=level=>({'大大吉':6,'大吉':5,'吉':4,'凶':2,'大凶':1}[level]||0);
export function searchNames({sei='',keyword='',type='1',kana=false},names,kanji){const s=normalize(sei),q=normalize(keyword);if(!s)throw Error('苗字を入力してください。');characters(s,kanji);if(!q)throw Error(kana?'読みを入力してください。':'使用したい漢字を入力してください。');if(!kana&&[...q].length!==1)throw Error('漢字は一文字で入力してください。');if(kana&&!/^[ぁ-ゖー]+$/u.test(q))throw Error('読みはひらがなで入力してください。');const index={'1':0,'2':3,'3':2,'4':4};return names.filter(x=>(kana?x.kana.includes(q):x.name.includes(q))).flatMap(x=>{try{const r=analyze(s,x.name,x.sex||'male',kanji);return [{...x,result:r,score:type==='5'?r.metrics.reduce((t,m)=>t+rank(m.level),0):rank(r.metrics[index[type]??0].level)}];}catch{return [];}}).sort((a,b)=>b.score-a.score||a.name.localeCompare(b.name,'ja'));}

export function parsePage(value,last=Infinity){const n=Number(value);return Math.min(Number.isInteger(n)&&n>0?n:1,Math.max(1,last));}
export function validPerson(value){return !!value&&typeof value==='object'&&['sei','mei'].every(k=>typeof value[k]==='string'&&[...normalize(value[k])].length>0&&[...normalize(value[k])].length<=4)&&['male','female'].includes(value.sex);}
export function validStoredValue(key,value){if(key==='history')return Array.isArray(value)&&value.every(x=>validPerson(x)&&Number.isFinite(x.time)&&x.time>=0&&x.time<=8640000000000000);if(key.startsWith('memo:'))return typeof value==='string'&&value.length<=1000;return false;}
export function sharedResultPath(r){return `/result/${encodeURIComponent(r.sei+'_'+r.mei)}/${r.sex==='female'?'女性':'男性'}/`;}
