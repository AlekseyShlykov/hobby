# Рассылка с обновлениями: сохранение почт в Google Таблицу

Кнопка **«Подписаться на рассылку с обновлениями»** сохраняет email в Google Таблицу. Работает и на **GitHub Pages** (без своего сервера), и при запуске с сервером.

---

## Текущий деплой Apps Script

- **Deployment ID:** `AKfycbyQCXawOqr0OAN7-eQgHQPK-MId0HsJOzGRAAYhXOOQXFWhJ4dkwBr1OxnNHIBGiX7J`
- **URL веб-приложения:** `https://script.google.com/macros/s/AKfycbyQCXawOqr0OAN7-eQgHQPK-MId0HsJOzGRAAYhXOOQXFWhJ4dkwBr1OxnNHIBGiX7J/exec`

Этот URL нужно указать в секрете **GOOGLE_SHEETS_WEBHOOK_URL** (для GitHub Pages) и/или в `.env` (для локального запуска) — см. раздел «Где указать URL» ниже.

---

## Настройка за 5 минут

### 1. Google Таблица

1. Создайте [Google Таблицу](https://sheets.google.com).
2. В первой строке задайте заголовки: **Email** | **Created** (или **Дата**).

### 2. Apps Script

3. В таблице: **Расширения** → **Apps Script**. Удалите весь код в редакторе и вставьте этот скрипт (он обрабатывает и **JSON** из API, и **form-urlencoded** из браузера на GitHub Pages):

```javascript
function parseFormUrlEncoded(str) {
  var params = {};
  if (!str) return params;
  var pairs = str.split('&');
  for (var i = 0; i < pairs.length; i++) {
    var kv = pairs[i].split('=');
    if (kv.length >= 1) {
      var key = decodeURIComponent((kv[0] || '').replace(/\+/g, ' '));
      var value = kv.length >= 2 ? decodeURIComponent((kv[1] || '').replace(/\+/g, ' ')) : '';
      params[key] = value;
    }
  }
  return params;
}

function doPost(e) {
  try {
    var email = '';
    var createdAt = new Date().toISOString();

    if (e.postData && e.postData.contents) {
      var raw = e.postData.contents;
      var type = (e.postData.type || '').toLowerCase();
      var data;
      if (type.indexOf('application/json') !== -1) {
        data = JSON.parse(raw);
      } else {
        // form-urlencoded (как при отправке с GitHub Pages)
        data = parseFormUrlEncoded(raw);
      }
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

**Важно:** после правок нажмите **Сохранить** (Ctrl+S), затем **Развернуть** → **Управление развёртываниями** → у текущего развёртывания нажмите **Изменить** (иконка карандаша) → **Версия** → **Новая версия** → **Развернуть**. Тогда на сайте начнёт работать новая версия скрипта.

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
NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/AKfycbyQCXawOqr0OAN7-eQgHQPK-MId0HsJOzGRAAYhXOOQXFWhJ4dkwBr1OxnNHIBGiX7J/exec

# Опционально, для работы через API (локально / Vercel)
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/AKfycbyQCXawOqr0OAN7-eQgHQPK-MId0HsJOzGRAAYhXOOQXFWhJ4dkwBr1OxnNHIBGiX7J/exec
```

Перезапустите приложение (`npm run dev` или перезапуск на Vercel).

Готово. Подписки будут добавляться в таблицу и с GitHub Pages, и при запуске с сервером.
