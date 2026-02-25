# Рассылка с обновлениями: сохранение почт в Google Таблицу

Кнопка **«Подписаться на рассылку с обновлениями»** сохраняет email в Google Таблицу. Работает и на **GitHub Pages** (без своего сервера), и при запуске с сервером.

---

## Текущий деплой Apps Script

- **Deployment ID:** `AKfycbzDxYXeLXpcXHN-4N4fziJE6jeHnTPc4_vLGtsalW6zjjmKEfGR3ORDnehn2SwsRH_2`
- **URL веб-приложения:** `https://script.google.com/macros/s/AKfycbzDxYXeLXpcXHN-4N4fziJE6jeHnTPc4_vLGtsalW6zjjmKEfGR3ORDnehn2SwsRH_2/exec`

Этот URL нужно указать в секрете **GOOGLE_SHEETS_WEBHOOK_URL** (для GitHub Pages) и/или в `.env` (для локального запуска) — см. раздел «Где указать URL» ниже.

---

## Настройка за 5 минут

### 1. Google Таблица

1. Создайте [Google Таблицу](https://sheets.google.com).
2. **Первый лист** (подписки): в первой строке задайте заголовки: **Email** | **Created** (или **Дата**).
3. **Второй лист** для квиза создаст скрипт автоматически при первой записи (имя листа: **Quiz**). При желании можно создать лист вручную с заголовками в первой строке (см. скрипт ниже).

### 2. Apps Script

4. В таблице: **Расширения** → **Apps Script**. Удалите весь код в редакторе и вставьте этот скрипт (он обрабатывает **подписки** и **результаты квиза** — тип задаётся полем `type`; поддерживаются **JSON** и **form-urlencoded**):

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
    var data = {};

    if (e.postData && e.postData.contents) {
      var raw = e.postData.contents;
      var type = (e.postData.type || '').toLowerCase();
      if (type.indexOf('application/json') !== -1) {
        data = JSON.parse(raw);
      } else {
        data = parseFormUrlEncoded(raw);
      }
    } else if (e.parameter) {
      data = e.parameter;
    }

    // Результаты квиза — пишем на лист "Quiz"
    if (data.type === 'quiz' && data.payload) {
      var payload;
      try {
        payload = typeof data.payload === 'string' ? JSON.parse(data.payload) : data.payload;
      } catch (err) {
        return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'Invalid payload' }))
          .setMimeType(ContentService.MimeType.JSON);
      }
      var ss = SpreadsheetApp.getActiveSpreadsheet();
      var quizSheet = ss.getSheetByName('Quiz');
      if (!quizSheet) {
        quizSheet = ss.insertSheet('Quiz');
        var headers = ['locale'];
        for (var i = 1; i <= 29; i++) headers.push('answer_' + i);
        headers = headers.concat(['ocean_O', 'ocean_C', 'ocean_E', 'ocean_A', 'ocean_N']);
        headers = headers.concat(['riasec_R', 'riasec_I', 'riasec_Art', 'riasec_S', 'riasec_Ent', 'riasec_Con']);
        headers = headers.concat(['hobby1', 'hobby2', 'hobby3', 'hobby4', 'hobby5', 'createdAt']);
        quizSheet.appendRow(headers);
      }
      var answers = payload.answers || [];
      var row = [payload.locale || ''];
      for (var j = 0; j < 29; j++) row.push(answers[j] !== undefined ? answers[j] : '');
      row.push(
        payload.ocean_O != null ? payload.ocean_O : '', payload.ocean_C != null ? payload.ocean_C : '', payload.ocean_E != null ? payload.ocean_E : '', payload.ocean_A != null ? payload.ocean_A : '', payload.ocean_N != null ? payload.ocean_N : '',
        payload.riasec_R != null ? payload.riasec_R : '', payload.riasec_I != null ? payload.riasec_I : '', payload.riasec_Art != null ? payload.riasec_Art : '', payload.riasec_S != null ? payload.riasec_S : '', payload.riasec_Ent != null ? payload.riasec_Ent : '', payload.riasec_Con != null ? payload.riasec_Con : '',
        payload.hobby1 || '', payload.hobby2 || '', payload.hobby3 || '', payload.hobby4 || '', payload.hobby5 || '',
        payload.createdAt || new Date().toISOString()
      );
      quizSheet.appendRow(row);
      return ContentService.createTextOutput(JSON.stringify({ success: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Подписка на рассылку — пишем на активный (первый) лист
    email = data.email || '';
    createdAt = data.createdAt || createdAt;
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

5. Сохраните (Ctrl+S).
6. **Развернуть** → **Новое развёртывание** → тип **Веб-приложение**.
7. Параметры: **Выполнять от имени** — я, **У кого есть доступ** — **Все**.
8. Нажмите **Развернуть** и скопируйте **URL веб-приложения** (например `https://script.google.com/macros/s/xxxx/exec`).

### 3. Где указать URL

**Для GitHub Pages:**  
В репозитории: **Settings** → **Secrets and variables** → **Actions** → **New repository secret**.  
Имя: `GOOGLE_SHEETS_WEBHOOK_URL`, значение: вставьте URL веб-приложения из шага 8.  
При следующем пуше в `main` сборка подхватит секрет, и подписка на сайте будет работать.

**Для локального запуска или Vercel:**  
В корне `hobby-finder` создайте `.env` и добавьте (или скопируйте из `.env.example`):

```env
NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/AKfycbzDxYXeLXpcXHN-4N4fziJE6jeHnTPc4_vLGtsalW6zjjmKEfGR3ORDnehn2SwsRH_2/exec

# Опционально, для работы через API (локально / Vercel)
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/AKfycbzDxYXeLXpcXHN-4N4fziJE6jeHnTPc4_vLGtsalW6zjjmKEfGR3ORDnehn2SwsRH_2/exec
```

Перезапустите приложение (`npm run dev` или перезапуск на Vercel).

Готово. Подписки будут добавляться в таблицу и с GitHub Pages, и при запуске с сервером.
