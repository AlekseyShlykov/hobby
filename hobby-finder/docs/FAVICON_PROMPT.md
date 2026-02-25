# Промпт для генерации Favicon

Используй этот промпт в DALL·E, Midjourney или другом генераторе изображений, чтобы получить иконку в стиле приложения «Find Your Hobby».

---

## Вариант 1: В стиле картинок приложения (тёмный фон)

Подходит, если браузер/система показывают фавикон на светлом фоне (вкладка, закладки).

```
Favicon, app icon. Minimalist flat design. Dark charcoal background (#1a1a1a). 
Single simple shape in the center: abstract spark or compass star made of smooth gradient 
from soft lavender (#9b87b8) to deeper purple (#7d6a9a). Very subtle soft glow around the shape. 
No text, no people. Geometric, clean, modern. Must be readable and recognizable at 32x32 pixels. 
Square format, vector style, 8K quality. Sophisticated, calming mood. 512x512px.
```

**Альтернатива (символ хобби):**
```
Favicon, app icon. Minimalist flat design. Dark charcoal background (#1a1a1a). 
Small elegant symbol: stylized heart or lightbulb combined with a gentle curve (finding/discovery), 
in smooth gradient from lavender (#9b87b8) to purple (#7d6a9a). Soft ambient glow. 
No text. Geometric, clean. Recognizable at 32x32px. Square, vector style, 512x512px.
```

---

## Вариант 2: Светлый фон (под палитру UI)

Если нужна иконка, которая лучше смотрится на светлой вкладке (как в приложении).

```
Favicon, app icon. Minimalist flat design. Soft lavender-gray background (#f0ecf2). 
One simple geometric shape: rounded diamond or soft star in gradient 
from #9b87b8 to #7d6a9a. Subtle rim lighting. No text, no details. 
Clean, modern, must read clearly at 32x32 pixels. Square, vector style. 512x512px.
```

---

## После генерации

1. Скачай изображение в высоком разрешении (512×512 или 256×256).
2. Конвертируй в favicon (можно использовать [realfavicongenerator.net](https://realfavicongenerator.net/) или [favicon.io](https://favicon.io/)).
3. Положи `favicon.ico` в `hobby-finder/public/` и при необходимости обнови ссылки в `app/layout.tsx` или `app/head.tsx`.

**Важно:** Иконка должна оставаться узнаваемой в размере 16×16 и 32×32 — избегай мелких деталей и текста.
