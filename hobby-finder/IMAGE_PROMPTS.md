# Image Generation Prompts for Hobby Finder

## Общий стиль для ВСЕХ изображений:
**Важно**: Все изображения в едином стиле:
- **Акварельная иллюстрация** (watercolor painting), мягкие размытые края, лёгкие подтёки
- **Воздушный, dreamy стиль** — много воздуха, мягкие тени, никакой жёсткой геометрии
- **Светлый фон** — кремовый, слоновая кость (#f8f6f9), или очень светлые размывки акварели
- **Палитра**: пастельные акварельные тона — лавандовый, мятный, персиковый, пудрово-голубой, песочный
- **Без чёрного** — тени и контуры в оттенках серо-лилового, серо-голубого
- **Текстура бумаги** — лёгкая зернистость, как будто на акварельной бумаге
- **Настроение**: спокойное, мечтательное, тёплое, «воздушное»
- **Разрешение**: 800x600px для questions/context, 400x400px для visual; hero 800x500px

---

## 1. HERO IMAGE

### hero-hobbies.png
**Файл**: `public/images/hero-hobbies.png`
**Размер**: 800x500px

**Prompt**:
```
Soft watercolor illustration, dreamy and airy. Cream/ivory paper background (#f8f6f9). Floating watercolor elements: lavender guitar, mint green paintbrush, soft blue bicycle wheel, peach open book, powder blue camera, sage green potted plant. Each object has soft edges, gentle color bleeds, and light shadows in grey-lavender. Plenty of white space. Dreamy, whimsical mood. Watercolor on textured paper, 8K, delicate and elegant.
```

---

## 2. OCEAN QUESTIONS (10 images) — не используются в 1-м этапе

Промпты ниже можно использовать, если позже решите вернуть картинки в блок OCEAN. Стиль — акварельный.

### q1-openness-new.png … q10-neuroticism-mood.png
Стиль: светлый акварельный фон, мягкие формы, пастельные цвета (лаванда, мята, персик, голубой), без жёстких контуров. Настроение — мечтательное, спокойное.

---

## 3. RIASEC QUESTIONS (12 images)

### q11-realistic-hands.png
**Prompt**:
```
Watercolor illustration, dreamy style. Cream paper background. Soft watercolor hands holding a brush and a small tool, muted stone and sage tones. Gentle color bleeds, soft shadows in grey-lavender. Airy, calm. No hard edges. 800x600px, watercolor on paper.
```

### q12-realistic-nature.png
**Prompt**:
```
Soft watercolor landscape: distant mountains and pine silhouettes in muted blue-grey and sage. Small tent in soft terracotta. Misty, dreamy atmosphere. Cream/ivory background with light washes. Airy and peaceful. 800x600px, watercolor.
```

### q13-investigative-howworks.png
**Prompt**:
```
Dreamy watercolor: soft gears and cogs in powder blue and lavender, semi-transparent. Cream background. Gentle bleeds, no sharp lines. Curious, light mood. 800x600px, watercolor illustration.
```

### q14-investigative-puzzle.png
**Prompt**:
```
Watercolor style: soft Rubik's cube and abstract maze in muted teal, blue, lavender. Cream paper, light washes. Dreamy, thoughtful. Soft edges only. 800x600px, watercolor.
```

### q15-artistic-create.png
**Prompt**:
```
Dreamy watercolor: canvas on easel, brushes, floating musical notes in soft pink and lavender. Cream background. Delicate bleeds, airy composition. Creative, gentle mood. 800x600px, watercolor.
```

### q16-artistic-beauty.png
**Prompt**:
```
Soft watercolor: gallery interior with framed abstract shapes in blush and lavender. Cream/ivory background. Dreamy, refined. Soft shadows, no black. 800x600px, watercolor.
```

### q17-social-help.png
**Prompt**:
```
Watercolor illustration: two hands reaching toward each other in mint and sage green. Cream paper. Soft glow, gentle bleeds. Caring, hopeful mood. 800x600px, dreamy watercolor.
```

### q18-social-teach.png
**Prompt**:
```
Dreamy watercolor: soft whiteboard with simple diagrams, two gentle silhouettes (mentor and student) in powder blue and lavender. Cream background. Airy, inspiring. 800x600px, watercolor.
```

### q19-enterprising-lead.png
**Prompt**:
```
Soft watercolor: figure on low podium in warm peach and amber wash, others as soft shapes below. Cream paper. Dreamy, ambitious but gentle. 800x600px, watercolor.
```

### q20-enterprising-win.png
**Prompt**:
```
Watercolor style: soft podium and trophy in gold and peach washes. Cream background. Confetti as light color spots. Dreamy, celebratory. 800x600px, watercolor.
```

### q21-conventional-data.png
**Prompt**:
```
Dreamy watercolor: soft spreadsheet grid, small charts in indigo and lavender washes. Cream paper. Clean but soft. 800x600px, watercolor.
```

### q22-conventional-rules.png
**Prompt**:
```
Soft watercolor: neat folders and checklist in muted indigo and grey-lavender. Cream background. Orderly, calm. 800x600px, watercolor.
```

---

## 4. VISUAL CHOICE IMAGES (12 images — 4 per question × 3 questions)

### V1: Social Energy

#### v1a-alone.png (400x400px)
**Prompt**:
```
Watercolor illustration: person reading by window in cozy solitude. Cream/ivory background. Chair and figure in soft mint and lavender. Warm light from window, dreamy and serene. 400x400px, square, watercolor.
```

#### v1b-small-group.png
**Prompt**:
```
Dreamy watercolor: small table with 3–4 people in soft teal and sage. Cream paper. Intimate, warm. Soft edges only. 400x400px, square, watercolor.
```

#### v1c-party.png
**Prompt**:
```
Soft watercolor: group of figures dancing, party lights as soft color spots. Cream background. Lively but gentle. 400x400px, square, watercolor.
```

#### v1d-crowd.png
**Prompt**:
```
Watercolor style: crowd as soft shapes, stage lights as washes. Cream paper. Dreamy, electric but soft. 400x400px, square, watercolor.
```

### V2: Environment Style

#### v2a-minimal.png
**Prompt**:
```
Dreamy watercolor: minimal desk with laptop in soft blue and cream. Lots of white space. Zen, calm. 400x400px, square, watercolor.
```

#### v2b-organized.png
**Prompt**:
```
Soft watercolor: organized desk with plant and books in mint and blue washes. Cream background. Cozy, productive. 400x400px, square, watercolor.
```

#### v2c-creative.png
**Prompt**:
```
Watercolor illustration: creative desk with brushes, paint, sketchbook in lavender and pink. Cream paper. Gentle chaos, dreamy. 400x400px, square, watercolor.
```

#### v2d-chaos.png
**Prompt**:
```
Dreamy watercolor: studio with multiple projects in soft purple and blush. Cream background. Passionate but airy. 400x400px, square, watercolor.
```

### V3: Activity Type

#### v3a-nature.png
**Prompt**:
```
Soft watercolor: mountains and trail in muted blue-grey and sage. Cream paper. Dreamy, peaceful. 400x400px, square, watercolor.
```

#### v3b-workshop.png
**Prompt**:
```
Watercolor style: workbench with tools in soft brown and grey-lavender. Cream background. Focused, calm. 400x400px, square, watercolor.
```

#### v3c-digital.png
**Prompt**:
```
Dreamy watercolor: screens and devices in powder blue and lavender. Cream paper. Soft tech, airy. 400x400px, square, watercolor.
```

#### v3d-stage.png
**Prompt**:
```
Soft watercolor: stage with spotlight as soft wash, audience as gentle shapes. Cream background. Dreamy, theatrical. 400x400px, square, watercolor.
```

---

## 5. CONTEXT IMAGES (2 images)

### c1-time.png
**Prompt**:
```
Dreamy watercolor: hourglass in soft teal and cream. Sand as gentle wash. Cream paper. Calm, contemplative. 800x600px, watercolor.
```

### c2-budget.png
**Prompt**:
```
Soft watercolor: wallet and coins in warm peach and gold washes. Cream background. Approachable, gentle. 800x600px, watercolor.
```

---

## ОБЩИЕ РЕКОМЕНДАЦИИ ДЛЯ ГЕНЕРАЦИИ

1. **Стиль**: «watercolor illustration», «dreamy», «soft edges», «cream/ivory background», «no black»
2. **Цвета**: пастельные акварельные размывки (lavender, mint, peach, powder blue, sage)
3. **Тени**: серо-лиловые, серо-голубые, очень мягкие
4. **Фон**: кремовый #f8f6f9 или светлая акварельная размывка
5. **Настроение**: спокойное, воздушное, мечтательное

## ПОСЛЕ ГЕНЕРАЦИИ

1. Сохранить каждое изображение с указанным именем файла.
2. Разместить в папках:
   - Hero: `public/images/hero-hobbies.png`
   - Questions: `public/images/questions/`
   - Visual: `public/images/visual/`
   - Context: `public/images/context/`
3. В приложении картинки подхватятся автоматически (или показываются акварельные плейсхолдеры).

---

**Итого для текущего приложения**: 1 hero + 12 RIASEC + 12 visual + 2 context = **27 изображений** (в первом этапе — OCEAN — картинки отключены, только UI).
