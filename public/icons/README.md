# PWA Icons Placeholder

This directory should contain app icons for the PWA. You need to create these icons using your OAKWOOD logo.

## Required Icon Sizes:
- icon-16x16.png
- icon-32x32.png
- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png

## How to Generate Icons:

### Option 1: Online Tool (Easiest)
1. Go to https://www.pwabuilder.com/imageGenerator
2. Upload your OAKWOOD logo (square image, min 512x512px)
3. Download the generated icon pack
4. Place all icons in this `/public/icons/` directory

### Option 2: Using Figma/Photoshop
1. Create a 512x512px artboard with your OAKWOOD logo
2. Export at different sizes (listed above)
3. Ensure transparent or solid background (#4A3829 brown recommended)

### Option 3: Command Line (ImageMagick)
```bash
# Install ImageMagick first
# Convert a source image to all sizes
convert logo.png -resize 512x512 icon-512x512.png
convert logo.png -resize 384x384 icon-384x384.png
convert logo.png -resize 192x192 icon-192x192.png
convert logo.png -resize 152x152 icon-152x152.png
convert logo.png -resize 144x144 icon-144x144.png
convert logo.png -resize 128x128 icon-128x128.png
convert logo.png -resize 96x96 icon-96x96.png
convert logo.png -resize 72x72 icon-72x72.png
convert logo.png -resize 32x32 icon-32x32.png
convert logo.png -resize 16x16 icon-16x16.png
```

## Design Guidelines:
- Use OAKWOOD brand colors (#4A3829 brown, #F5EFE7 cream)
- Keep design simple and recognizable at small sizes
- Avoid text in icons (use logo/symbol only)
- Use a maskable icon design (safe area in center 80%)

## Temporary Solution:
For testing, you can use a simple colored square or the first letter "O" as a placeholder.
