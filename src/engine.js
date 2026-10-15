/** Local reconstruction. Ratings are an independent 81-number reference, not the source site's private rules. */
export const LEVELS={
 '大吉':{tone:'best',words:['発展','才能','信頼','成功','調和'],text:'持ち前の力を活かし、周囲との信頼を育てることで道が開ける画数です。目標を定め、一歩ずつ積み重ねていきましょう。'},
 '吉':{tone:'good',words:['努力','堅実','成長','協力','安定'],text:'日々の積み重ねが実を結びやすい画数です。焦らずに自分のペースを守り、人とのつながりを大切にしましょう。'},
 '吉凶混合':{tone:'mixed',words:['変化','個性','挑戦','柔軟','選択'],text:'長所と課題の両面を持つ画数です。状況に合わせて柔軟に行動し、自分の強みを活かせる環境を選んでいきましょう。'},
 '凶':{tone:'caution',words:['慎重','計画','忍耐','対話','見直し'],text:'物事を丁寧に進めることが大切な画数です。ひとりで抱え込まず、計画を見直したり、周囲と相談したりする時間を持ちましょう。'},
 '大凶':{tone:'caution',words:['用心','休息','準備','協力','継続'],text:'無理をせず、基盤を整えることを意識したい画数です。画数だけで人生は決まりません。十分な準備と周囲の支えを大切にしてください。'}
};
const best=new Set([1,3,5,6,11,13,15,16,21,23,24,29,31,32,33,37,41,45,47,48,52,63,65,67,68,81]);
const good=new Set([7,8,17,18,25,35,38,39,51,57,58,61,71,73,75]);
const worst=new Set([4,9,10,12,14,19,20,22,26,28,34,36,42,43,44,49,54,56,59,60,64,66,69,70,72,74,76,78,80]);
export function fortune(n){const k=n<=81?n:(n-1)%80+1;const level=best.has(k)?'大吉':good.has(k)?'吉':worst.has(k)?'大凶':[27,30,40,46,50,53,55,62,77,79].includes(k)?'凶':'吉凶混合';return {number:n,level,...LEVELS[level]};}
const hiragana={};
for(const [n,chars] of [[1,'くしつてとのへろゝー'],[2,'いうえこすそひめゆよらりるれん'],[3,'あおかきけさせたちになはまみもやわを'],[4,'ぬねふほむ'],[5,'ゐゑ']])for(const c of chars)hiragana[c]=n;
const katakana={};for(const [n,chars] of [[1,'ノヘレーヽ'],[2,'イエカクコスセソトナニヌハヒフマムメヤユラリルワン'],[3,'アウオキケサシタチツテミモヨロ'],[4,'ネホヰヱヲ']])for(const c of chars)katakana[c]=n;
const small={'ぁ':'あ','ぃ':'い','ぅ':'う','ぇ':'え','ぉ':'お','っ':'つ','ゃ':'や','ゅ':'ゆ','ょ':'よ','ゎ':'わ','ァ':'ア','ィ':'イ','ゥ':'ウ','ェ':'エ','ォ':'オ','ッ':'ツ','ャ':'ヤ','ュ':'ユ','ョ':'ヨ','ヮ':'ワ','ヵ':'カ','ヶ':'ケ'};
export function stroke(char,kanji){if(kanji[char])return kanji[char].s;const c=small[char]||char;if(hiragana[c])return hiragana[c];if(katakana[c])return katakana[c];const d=c.normalize('NFD');if(d.length>1&&(d[1]==='\u3099'||d[1]==='\u309a')){const b=stroke(d[0],kanji);return b?b+(d[1]==='\u3099'?2:1):null;}if(c==='々')return 3;return null;}
export function normalize(value){return String(value||'').normalize('NFKC').trim();}
export function characters(value,kanji,max=4){const s=normalize(value);if(!s)throw Error('お名前を入力してください。');if([...s].length>max)throw Error(`${max}文字以内で入力してください。`);const list=[...s].map(char=>({char,strokes:stroke(char,kanji)}));const bad=list.filter(x=>!x.strokes);if(bad.length)throw Error(`「${bad.map(x=>x.char).join('・')}」の画数を確認できません。漢字・ひらがな・カタカナで入力してください。`);return list;}
export function analyze(sei,mei,sex,kanji){if(!['male','female'].includes(sex))throw Error('性別を選択してください。');const a=characters(sei,kanji),b=characters(mei,kanji);const sum=x=>x.reduce((t,c)=>t+c.strokes,0),as=sum(a),bs=sum(b),total=as+bs;
 const specs=[['総格',total,[...a,...b],'人生全体の流れ'],['天格',as+(a.length===1?1:0),a,'家系・受け継ぐもの'],['地格',bs+(b.length===1?1:0),b,'個性・若い頃の運勢'],['人格',a.at(-1).strokes+b[0].strokes,[a.at(-1),b[0]],'性格・人との関わり'],['外格',total-a.at(-1).strokes-b[0].strokes+(a.length===1?1:0)+(b.length===1?1:0),[...a.slice(0,-1),...b.slice(1)],'周囲との関係'],['仕事運',as+b[0].strokes,[...a,b[0]],'仕事への向き合い方'],['家庭運',a.at(-1).strokes+bs,[a.at(-1),...b],'家庭・身近な人との関係']];
 return {sei:normalize(sei),mei:normalize(mei),sex,characters:[...a,...b],metrics:specs.map(([name,n,chars,meaning])=>({name,meaning,chars,...fortune(n)}))};}
export function diagnoseName(name,kanji){const chars=characters(name,kanji,40);return {name:normalize(name),chars,...fortune(chars.reduce((t,c)=>t+c.strokes,0))};}
export const rank=level=>({'大吉':5,'吉':4,'吉凶混合':3,'凶':2,'大凶':1}[level]||0);
export function searchNames({sei='',keyword='',type='1',kana=false},names,kanji){const s=normalize(sei),q=normalize(keyword);if(!s)throw Error('苗字を入力してください。');characters(s,kanji);if(!q)throw Error(kana?'読みを入力してください。':'使用したい漢字を入力してください。');if(!kana&&[...q].length!==1)throw Error('漢字は一文字で入力してください。');if(kana&&!/^[ぁ-ゖー]+$/u.test(q))throw Error('読みはひらがなで入力してください。');const index={'1':0,'2':3,'3':2,'4':4};return names.filter(x=>(kana?x.kana.includes(q):x.name.includes(q))).flatMap(x=>{try{const r=analyze(s,x.name,x.sex||'male',kanji);return [{...x,result:r,score:type==='5'?r.metrics.reduce((t,m)=>t+rank(m.level),0):rank(r.metrics[index[type]??0].level)}];}catch{return [];}}).sort((a,b)=>b.score-a.score||a.name.localeCompare(b.name,'ja'));}
