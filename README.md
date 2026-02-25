# TestProject

Репозиторий проекта «Найди своё хобби» — тест по подбору хобби на основе OCEAN и RIASEC.

## Структура

- **hobby-finder/** — приложение (Next.js): тест, результаты, деплой на GitHub Pages
- **PRD.md** — продуктовое описание и требования
- **CLAUDE.md** — правила и контекст для разработки
- **.github/workflows/** — CI/CD (деплой на GitHub Pages)

## Запуск локально

```bash
cd hobby-finder
npm install
npm run dev
```

Открой [http://localhost:3000](http://localhost:3000).

## Деплой на GitHub Pages

Инструкция: [hobby-finder/GITHUB_PAGES_SETUP.md](hobby-finder/GITHUB_PAGES_SETUP.md).

## Документация приложения

- [hobby-finder/README.md](hobby-finder/README.md) — сборка и деплой Next.js
- [hobby-finder/IMAGE_PROMPTS.md](hobby-finder/IMAGE_PROMPTS.md) — промпты для генерации картинок
