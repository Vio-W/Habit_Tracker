from PIL import Image, ImageDraw
from pathlib import Path

out = Path(__file__).resolve().parent / 'icons'
out.mkdir(exist_ok=True)

sizes = [72, 96, 128, 144, 152, 192, 256, 384, 512]
for size in sizes:
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    pad = int(size * 0.16)
    draw.rounded_rectangle(
        (pad, pad, size - pad, size - pad),
        radius=int(size * 0.22),
        fill=(34, 197, 94, 255),
    )
    draw.rounded_rectangle(
        (int(size * 0.28), int(size * 0.36), int(size * 0.72), int(size * 0.64)),
        radius=int(size * 0.08),
        fill=(255, 255, 255, 255),
    )
    draw.rectangle(
        (int(size * 0.42), int(size * 0.48), int(size * 0.58), int(size * 0.64)),
        fill=(34, 197, 94, 255),
    )
    draw.polygon(
        [
            (size * 0.26, size * 0.52),
            (size * 0.45, size * 0.72),
            (size * 0.75, size * 0.30),
            (size * 0.45, size * 0.90),
        ],
        fill=(255, 255, 255, 255),
    )
    img.save(out / f'icon-{size}.png')

for size in [180, 167, 152, 120]:
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw.rounded_rectangle(
        (int(size * 0.12), int(size * 0.12), int(size * 0.88), int(size * 0.88)),
        radius=int(size * 0.24),
        fill=(34, 197, 94, 255),
    )
    draw.polygon(
        [
            (size * 0.22, size * 0.52),
            (size * 0.42, size * 0.72),
            (size * 0.8, size * 0.22),
            (size * 0.42, size * 0.92),
        ],
        fill=(255, 255, 255, 255),
    )
    img.save(out / f'icon-apple-{size}.png')

print('generated', sorted(p.name for p in out.iterdir()))
