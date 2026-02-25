# Настройка GitHub Pages для Hobby Finder

## 1. Репозиторий на GitHub

- Залить проект в репозиторий (если ещё не залит).
- Структура: в корне репозитория есть папка `hobby-finder/` и папка `.github/workflows/` с файлом `deploy-pages.yml`.

## 2. Включить GitHub Pages в настройках репозитория

1. Открой репозиторий на GitHub.
2. Перейди в **Settings** (Настройки).
3. В левом меню выбери **Pages**.
4. В блоке **Build and deployment**:
   - **Source** выбери **GitHub Actions** (не "Deploy from a branch").

После этого при каждом успешном запуске workflow "Deploy to GitHub Pages" сайт будет обновляться.

## 3. Первый деплой

Workflow запускается:

- автоматически при **push в ветку `main`**;
- или вручную: вкладка **Actions** → выбери workflow **"Deploy to GitHub Pages"** → **Run workflow** → **Run workflow**.

Дождись зелёной галочки у последнего запуска. Деплой займёт 1–2 минуты.

## 4. Где будет сайт

- URL: **`https://<твой-username>.github.io/<имя-репозитория>/`**
- Пример: репозиторий `TestProject` → `https://username.github.io/TestProject/`
- Пример: репозиторий `hobby-finder` → `https://username.github.io/hobby-finder/`

Ссылку на свой сайт можно посмотреть в **Settings → Pages** после первого успешного деплоя.

## 5. Если что-то пошло не так

- **Actions** → открой последний запуск workflow → посмотри шаг, на котором упала сборка (красный крестик).
- Частые причины:
  - нет папки `hobby-finder/` в корне репо (workflow ожидает сборку из этой папки);
  - нет файла `.github/workflows/deploy-pages.yml`;
  - в **Settings → Pages** выбран не **GitHub Actions**, а branch — нужно переключить на **GitHub Actions**.

## 6. Локальная проверка перед пушем

Из папки `hobby-finder/`:

```bash
# Сборка как для GitHub Pages (подставь имя своего репозитория)
BASE_PATH=/имя-репозитория npm run build
```

В папке `out/` появится статический сайт. Имя репозитория должно совпадать с тем, что в URL (например, `TestProject` или `hobby-finder`).
