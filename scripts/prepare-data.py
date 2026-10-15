# coding: utf-8
"""Run from repository root with the downloaded KANJIDIC2 gzip as argument."""
import sys,gzip,json,xml.etree.ElementTree as ET
from pathlib import Path
xml=ET.fromstring(gzip.open(sys.argv[1],'rb').read());data={}
for c in xml.findall('character'):
 s=c.findtext('misc/stroke_count')
 if not s:continue
 data[c.findtext('literal')]={'s':int(s),'r':[r.text for r in c.findall('reading_meaning/rmgroup/reading') if r.get('r_type') in ['ja_on','ja_kun']],'n':[r.text for r in c.findall('reading_meaning/nanori')],'g':c.findtext('misc/grade')}
Path('public/data/kanji.json').write_text(json.dumps(data,ensure_ascii=False,separators=(',',':')),encoding='utf-8');print('KANJIDIC2 characters:',len(data))
