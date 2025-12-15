# Assets Setup

## Required Files

### App Icon
Create a 1024x1024 PNG file named `icon.png`

**Design Guidelines:**
- Navy background (#1a365d)
- MBRACE logo or heat pump icon
- No transparency
- Square corners (iOS will round automatically)

### Splash Screen
Create a 1242x2436 PNG file named `splash.png`

**Design Guidelines:**
- Navy background (#1a365d)
- MBRACE logo centered
- Keep important content in center 800x800 area

### Adaptive Icon (Android)
Create a 1024x1024 PNG file named `adaptive-icon.png`

**Design Guidelines:**
- Transparent background
- Icon content in center 66% of canvas
- Will be masked to various shapes by Android

### Favicon
Create a 48x48 PNG file named `favicon.png`

---

## Fonts

Download Inter font family from Google Fonts:
https://fonts.google.com/specimen/Inter

Place these files in `/assets/fonts/`:
- Inter-Regular.ttf
- Inter-Medium.ttf
- Inter-SemiBold.ttf
- Inter-Bold.ttf

**Quick Download:**
```bash
# From project root
curl -L "https://fonts.google.com/download?family=Inter" -o inter.zip
unzip inter.zip -d inter_temp
cp inter_temp/static/Inter-Regular.ttf assets/fonts/
cp inter_temp/static/Inter-Medium.ttf assets/fonts/
cp inter_temp/static/Inter-SemiBold.ttf assets/fonts/
cp inter_temp/static/Inter-Bold.ttf assets/fonts/
rm -rf inter_temp inter.zip
```

---

## Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Primary Navy | #1a365d | Headers, nav |
| Secondary Teal | #0d9488 | CTAs, highlights |
| Success Green | #22c55e | Positive states |
| Warning Orange | #f97316 | Alerts, urgency |
| Error Red | #ef4444 | Errors |
| Background | #f8fafc | Page background |
| Surface | #ffffff | Cards |
| Border | #e2e8f0 | Dividers |
