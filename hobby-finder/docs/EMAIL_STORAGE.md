# Рассылка с обновлениями: сохранение почт в Google Таблицу

Кнопка **«Подписаться на рассылку с обновлениями»** сохраняет email в Google Таблицу. Работает и на **GitHub Pages** (без своего сервера), и при запуске с сервером.

---

## Текущий деплой Apps Script

- **Deployment ID:** `AKfycbzMaPy-szSq71V4ZJ78b2CL_yccN6WswRbVx8MStNwGyctkC-hKgkqhoa80r_m7rt6I`
- **URL веб-приложения:** `https://script.google.com/macros/s/AKfycbzMaPy-szSq71V4ZJ78b2CL_yccN6WswRbVx8MStNwGyctkC-hKgkqhoa80r_m7rt6I/exec`

Этот URL нужно указать в секрете **GOOGLE_SHEETS_WEBHOOK_URL** (для GitHub Pages) и/или в `.env` (для локального запуска) — см. раздел «Где указать URL» ниже.

---

## Настройка за 5 минут

### 1. Google Таблица

1. Создайте [Google Таблицу](https://sheets.google.com).
2. В первой строке задайте заголовки: **Email** | **Created** (или **Дата**).

### 2. Apps Script

3. В таблице: **Расширения** → **Apps Script**. Удалите код в редакторе и вставьте (скрипт принимает и JSON из API, и form-encoded из браузера на Pages):

```javascript
function doPost(e) {
  try {
    var email = '';
    var createdAt = new Date().toISOString();
    if (e.postData && e.postData.contents) {
      var data = JSON.parse(e.postData.contents);
      email = data.email || '';
      createdAt = data.createdAt || createdAt;
    } else if (e.parameter) {
      email = e.parameter.email || '';
      createdAt = e.parameter.createdAt || createdAt;
    }
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    sheet.appendRow([email, createdAt]);
    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. Сохраните (Ctrl+S).
5. **Развернуть** → **Новое развёртывание** → тип **Веб-приложение**.
6. Параметры: **Выполнять от имени** — я, **У кого есть доступ** — **Все**.
7. Нажмите **Развернуть** и скопируйте **URL веб-приложения** (например `https://script.google.com/macros/s/xxxx/exec`).

### 3. Где указать URL

**Для GitHub Pages:**  
В репозитории: **Settings** → **Secrets and variables** → **Actions** → **New repository secret**.  
Имя: `GOOGLE_SHEETS_WEBHOOK_URL`, значение: вставьте URL веб-приложения из шага 7.  
При следующем пуше в `main` сборка подхватит секрет, и подписка на сайте будет работать.

**Для локального запуска или Vercel:**  
В корне `hobby-finder` создайте `.env` и добавьте (или скопируйте из `.env.example`):

```env
NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/AKfycbzMaPy-szSq71V4ZJ78b2CL_yccN6WswRbVx8MStNwGyctkC-hKgkqhoa80r_m7rt6I/exec

# Опционально, для работы через API (локально / Vercel)
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/AKfycbzMaPy-szSq71V4ZJ78b2CL_yccN6WswRbVx8MStNwGyctkC-hKgkqhoa80r_m7rt6I/exec
```

Перезапустите приложение (`npm run dev` или перезапуск на Vercel).

Готово. Подписки будут добавляться в таблицу и с GitHub Pages, и при запуске с сервером.
