"""Optimise les photos du site : copies WebP 600 px et 1200 px de large dans assets/photos/,
plus un manifeste JSON lu par le générateur (tools/build.mjs).

Usage : python3 tools/photos.py            (nécessite Pillow : pip install pillow)
Les originaux (assets/img/*.jpg|png, media/**) ne sont pas modifiés.
Sans ce script, le site utilise directement les originaux.
"""
import json, os, re, sys, unicodedata
from PIL import Image, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'assets', 'photos')
SRC_DIRS = [os.path.join(ROOT, 'assets', 'img'), os.path.join(ROOT, 'media')]
SKIP = re.compile(r'^(ph-|og-|hero-|qualiopi-logo-a-fournir)')
WIDTHS = (600, 1200)

def slug(name):
    s = unicodedata.normalize('NFD', os.path.splitext(name)[0]).encode('ascii', 'ignore').decode()
    return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')

def main():
    os.makedirs(OUT, exist_ok=True)
    manifest = {}
    for d in SRC_DIRS:
        for base, _, files in os.walk(d):
            for f in sorted(files):
                if not f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')) or SKIP.match(f):
                    continue
                src = os.path.join(base, f)
                rel = os.path.relpath(src, ROOT).replace(os.sep, '/')
                im = ImageOps.exif_transpose(Image.open(src))
                has_alpha = im.mode in ('RGBA', 'LA', 'P')
                im = im.convert('RGBA' if has_alpha else 'RGB')
                entry = {'width': im.width, 'height': im.height, 'variants': {}}
                for tw in sorted({min(w, im.width) for w in WIDTHS}):
                    th = round(im.height * tw / im.width)
                    out_name = f'{slug(f)}-{tw}.webp'
                    out_path = os.path.join(OUT, out_name)
                    if not os.path.exists(out_path) or os.path.getmtime(out_path) < os.path.getmtime(src):
                        im.resize((tw, th), Image.LANCZOS).save(out_path, 'WEBP', quality=78, method=6)
                    entry['variants'][str(tw)] = f'assets/photos/{out_name}'
                manifest[rel] = entry
    with open(os.path.join(OUT, 'manifest.json'), 'w', encoding='utf-8') as fh:
        json.dump(manifest, fh, ensure_ascii=False, indent=1)
    size = sum(os.path.getsize(os.path.join(OUT, x)) for x in os.listdir(OUT) if x.endswith('.webp'))
    print(f'{len(manifest)} photos, {size / 1024 / 1024:.1f} Mo de WebP dans assets/photos/')

if __name__ == '__main__':
    sys.exit(main())
