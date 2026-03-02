# Placeholder Icons Created

I've created a placeholder SVG icon. For production, you should replace these with proper PNG icons.

## Quick Way to Generate PNG Icons:

### Method 1: Online Tool (Easiest - 5 minutes)
1. Go to: https://www.pwabuilder.com/imageGenerator
2. Upload any square logo image (512x512px minimum)
3. Click "Generate"
4. Download the ZIP file
5. Extract all PNG files to this `/public/icons/` folder
6. Done!

### Method 2: Use Figma/Canva (10 minutes)
1. Create a 512x512px square
2. Add brown background (#4A3829)
3. Add "OAKWOOD" text or "O" letter in cream color (#F5EFE7)
4. Export as PNG at these sizes:
   - 16x16, 32x32, 72x72, 96x96, 128x128
   - 144x144, 152x152, 192x192, 384x384, 512x512
5. Save all files in this folder with names like: icon-512x512.png

### Method 3: Command Line (If you have ImageMagick)
```bash
# First create a source-icon.png (512x512) in this folder, then:
cd public/icons
convert source-icon.png -resize 512x512 icon-512x512.png
convert source-icon.png -resize 384x384 icon-384x384.png
convert source-icon.png -resize 192x192 icon-192x192.png
convert source-icon.png -resize 152x152 icon-152x152.png
convert source-icon.png -resize 144x144 icon-144x144.png
convert source-icon.png -resize 128x128 icon-128x128.png
convert source-icon.png -resize 96x96 icon-96x96.png
convert source-icon.png -resize 72x72 icon-72x72.png
convert source-icon.png -resize 32x32 icon-32x32.png
convert source-icon.png -resize 16x16 icon-16x16.png
```

## For Now (Testing):
The SVG icon will work for testing. Replace with PNG files before production launch.
