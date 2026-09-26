import zipfile
import xml.etree.ElementTree as ET
import re
import json
import os

def parse_docx(docx_path):
    with zipfile.ZipFile(docx_path) as z:
        xml_content = z.read('word/document.xml')
        root = ET.fromstring(xml_content)
        paras = []
        for elem in root.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p'):
            t = ''.join(elem.itertext()).strip()
            if t:
                paras.append(t)

    # Locate sequential numbers 1 to 100
    num_indices = []
    for i, p in enumerate(paras):
        if p.isdigit() and 1 <= int(p) <= 100:
            n = int(p)
            if len(num_indices) == 0 and n == 1:
                num_indices.append((n, i))
            elif len(num_indices) > 0 and n == num_indices[-1][0] + 1:
                num_indices.append((n, i))

    if len(num_indices) != 100:
        raise ValueError(f"Expected 100 numbers, found {len(num_indices)}")

    # Group definitions helper
    # Numbers in groups:
    # Group 1: 1, 10, 19, 28, 37, 46, 55, 64, 73, 82, 91, 100
    # Group 2: 2, 11, 20, 29, 38, 47, 56, 65, 74, 83, 92
    # Group 3: 3, 12, 21, 30, 39, 48, 57, 66, 75, 84, 93
    # Group 4: 4, 13, 22, 31, 40, 49, 58, 67, 76, 85, 94
    # Group 5: 5, 14, 23, 32, 41, 50, 59, 68, 77, 86, 95
    # Group 6: 6, 15, 24, 33, 42, 51, 60, 69, 78, 87, 96
    # Group 7: 7, 16, 25, 34, 43, 52, 61, 70, 79, 88, 97
    # Group 8: 8, 17, 26, 35, 44, 53, 62, 71, 80, 89, 98
    # Group 9: 9, 18, 27, 36, 45, 54, 63, 72, 81, 90, 99

    def get_group_number(num):
        if num == 100:
            return 1
        r = num % 9
        return 9 if r == 0 else r

    # Extract base group definitions from 1-9
    group_base = {}

    for n, start_p in num_indices[:9]:
        end_p = num_indices[n][1] if n < len(num_indices) else len(paras)
        lines = paras[start_p:end_p]
        
        meanings = []
        char_lines = []
        curr = None
        for l in lines[2:]:
            if re.match(r'^Meanings?\s+(?:&|And)\s+Symbols?:?', l, re.I):
                curr = 'meanings'
                continue
            if re.match(r'^CHAR.*TERISTICS\s+OF\s+GROUP', l, re.I):
                curr = 'char'
                continue
            if re.match(r'^(?:Life|Be\s+Wary\s+Of|Illnesses|Other\s+Names|Names\s+And)', l, re.I):
                curr = 'other'
                continue
            if l.startswith('When number') and ('unfavourable' in l or 'bad' in l):
                curr = 'other'
                continue
            if curr == 'meanings':
                meanings.append(l)
            elif curr == 'char':
                char_lines.append(l)

        group_base[n] = {
            'meaningsAndSymbols': ' '.join(meanings).strip(),
            'characteristics': ' '.join(char_lines).strip()
        }

    # Now parse all 100 numbers
    records = []

    for idx_i, (n, start_p) in enumerate(num_indices):
        end_p = num_indices[idx_i + 1][1] if idx_i + 1 < len(num_indices) else len(paras)
        lines = paras[start_p:end_p]
        
        number = n
        title = lines[1] if len(lines) > 1 else f"NUMBER {n}"
        group_num = get_group_number(n)
        
        meanings_symbols = []
        group_chars = []
        life_lines = []
        be_wary_lines = []
        illnesses_lines = []
        love_family_lines = []
        names_lines = []
        shadow_polarity_lines = []

        curr = None

        for line in lines[2:]:
            if re.match(r'^Meanings?\s+(?:&|And)\s+Symbols?:?', line, re.I):
                curr = 'meanings'
                continue
            if re.match(r'^CHAR.*TERISTICS\s+OF\s+GROUP', line, re.I):
                curr = 'group_char'
                continue
            if re.match(r'^Life:?', line, re.I):
                curr = 'life'
                continue
            if re.match(r'^Be\s+Wary\s+Of:?', line, re.I):
                curr = 'be_wary'
                continue
            if re.match(r'^Illnesses?:?', line, re.I):
                rest = re.sub(r'^Illnesses?:?\s*', '', line, flags=re.I).strip()
                if rest:
                    illnesses_lines.append(rest)
                curr = 'illnesses'
                continue
            if re.match(r'^Love\s+&\s+Family:?', line, re.I):
                rest = re.sub(r'^Love\s+&\s+Family:?\s*', '', line, flags=re.I).strip()
                if rest:
                    love_family_lines.append(rest)
                curr = 'love_family'
                continue
            if re.search(r'Names\s+And/Or\s+Surnames', line, re.I):
                curr = 'names'
                continue
            if line.startswith('When number') and ('unfavourable' in line or 'bad' in line):
                shadow_polarity_lines.append(line)
                continue

            if curr == 'meanings':
                meanings_symbols.append(line)
            elif curr == 'group_char':
                group_chars.append(line)
            elif curr == 'life':
                life_lines.append(line)
            elif curr == 'be_wary':
                if line.startswith('Illnesses:'):
                    rest = re.sub(r'^Illnesses:\s*', '', line).strip()
                    if rest:
                        illnesses_lines.append(rest)
                    curr = 'illnesses'
                else:
                    be_wary_lines.append(line)
            elif curr == 'illnesses':
                illnesses_lines.append(line)
            elif curr == 'love_family':
                love_family_lines.append(line)
            elif curr == 'names':
                names_lines.append(line)
            else:
                # Fallback to life
                life_lines.append(line)

        # Inherit group meanings and characteristics if empty
        final_meanings = ' '.join(meanings_symbols).strip() or group_base.get(group_num, {}).get('meaningsAndSymbols', '')
        final_chars = ' '.join(group_chars).strip() or group_base.get(group_num, {}).get('characteristics', '')
        final_life = ' '.join(life_lines).strip()
        
        # For numbers 1 and 2 where life had no separate heading, the primary text is in characteristics
        if not final_life and n in [1, 2]:
            final_life = final_chars

        final_shadow = ' '.join(shadow_polarity_lines).strip()
        final_be_wary = ' '.join(be_wary_lines).strip()
        final_illnesses = ' '.join(illnesses_lines).strip()
        final_love_family = ' '.join(love_family_lines).strip()
        final_names = ' '.join(names_lines).strip()

        # Determine auspicious category
        full_block_text = ' '.join(lines)
        if re.search(r'\b(favourable|favorable|divine\s+number|constant\s+success|fortune|auspicious)\b', full_block_text, re.I) and not re.search(r'\b(unfavourable\s+number|negative\s+influence|constant\s+failure)\b', full_block_text, re.I):
            category = "AUSPICIOUS"
        elif re.search(r'\b(unfavourable\s+number|negative\s+influence|constant\s+failure|misfortune|destruction|distress)\b', full_block_text, re.I):
            category = "NEEDS_OPTIMIZATION"
        elif re.search(r'\b(favourable|favorable)\b', full_block_text, re.I):
            category = "BALANCED"
        else:
            category = "BALANCED"

        record = {
            "number": number,
            "rootNumber": group_num,
            "groupNumber": group_num,
            "title": title,
            "category": category,
            "meaningsAndSymbols": final_meanings,
            "groupCharacteristics": final_chars,
            "lifeDescription": final_life,
            "shadowPolarity": final_shadow,
            "beWaryOf": final_be_wary,
            "illnesses": final_illnesses,
            "loveAndFamily": final_love_family,
            "exampleNames": final_names,
            "rawContent": '\n'.join(lines)
        }
        records.append(record)

    return records

def parse_scores(txt_path):
    scores = {}
    with open(txt_path, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if not line or '=' not in line:
                continue
            parts = line.split('=', 1)
            score_val = int(parts[0].strip())
            letters = parts[1].strip().split()
            for l in letters:
                clean_l = l.strip().upper()
                if clean_l:
                    scores[clean_l] = score_val
    return scores

if __name__ == '__main__':
    doc_path = 'ref/Numerology_Meanings_1-100_Edited.docx'
    scores_path = 'ref/score_text.txt'

    print("Parsing docx...")
    meanings = parse_docx(doc_path)
    print(f"Parsed {len(meanings)} numerology meanings.")

    print("Parsing score_text.txt...")
    char_scores = parse_scores(scores_path)
    print(f"Parsed {len(char_scores)} character scores: {sorted(char_scores.keys())}")

    # Save to JSON
    os.makedirs('src/lib/data', exist_ok=True)
    with open('src/lib/data/numerology_meanings_1_to_100.json', 'w', encoding='utf-8') as f:
        json.dump(meanings, f, ensure_ascii=False, indent=2)
    print("Saved src/lib/data/numerology_meanings_1_to_100.json")

    with open('src/lib/data/character_scores_chaldean.json', 'w', encoding='utf-8') as f:
        json.dump(char_scores, f, ensure_ascii=False, indent=2)
    print("Saved src/lib/data/character_scores_chaldean.json")
