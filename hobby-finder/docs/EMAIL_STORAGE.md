# Куда складывать почты и как отправлять письма

**Важно:** Кнопка «Получить полный результат на почту» и сохранение в Airtable/Google Таблицу работают **только когда приложение запущено с сервером**: `npm run dev` или `npm run build && npm run start`. Если вы открываете собранный статический сайт (например, папку `out/` или GitHub Pages без бэкенда), API не существует — запрос уйдёт в пустоту, в Airtable ничего не попадёт и письмо не отправится. Для локальной проверки всегда запускайте `npm run dev` и открывайте указанный в терминале URL (например http://localhost:3000).

---

## Сохранение списка почт

Можно использовать один или несколько вариантов.

### 1. SQLite (по умолчанию)

Ничего настраивать не нужно. Почты пишутся в `data/results.db`, таблица `full_result_emails`.  
Список: **GET** `/api/full-result-emails`.

Минус: на serverless (Vercel, Netlify и т.п.) файловая БД может не сохраняться между запросами. Тогда используйте Airtable или Google Таблицу.

---

### 2. Airtable

1. Создайте базу в [Airtable](https://airtable.com).
2. В базе создайте таблицу (например, **Emails**).
3. Добавьте два поля:
   - **Email** — тип Single line text
   - **Created** — тип Date (или Single line text)
4. [Создайте токен](https://airtable.com/create/tokens): scope — `data.records:write`, доступ к вашей базе.
5. В `.env` добавьте:

```env
AIRTABLE_API_KEY=patxxxxxxxxxxxx
AIRTABLE_BASE_ID=appxxxxxxxxxxxx
AIRTABLE_TABLE_NAME=Emails
```

- **Base ID** — в адресе базы: `https://airtable.com/appXXXXXXXXXXXXXX/...` (часть `app...`).
- **Table name** — имя таблицы по-английски (как в интерфейсе), если не задано, используется `Emails`.

Готово. Каждая отправка формы будет добавлять строку в Airtable.

---

### 3. Google Таблица (Google Sheets)

1. Создайте новую [Google Таблицу](https://sheets.google.com).
2. В первой строке задайте заголовки, например: **Email** | **Created**.
3. Меню **Расширения** → **Apps Script**. Удалите код в редакторе и вставьте:

```javascript
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    sheet.appendRow([data.email || '', data.createdAt || new Date().toISOString()]);
    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. Сохраните (Ctrl+S), нажмите **Развернуть** → **Новое развёртывание** → тип **Веб-приложение**.
5. Укажите: **Выполнять от имени** — я, **У кого есть доступ** — **Все** (иначе запросы с вашего сайта не пройдут).
6. Нажмите **Развернуть**, скопируйте **URL веб-приложения** (вид: `https://script.google.com/macros/s/.../exec`).
7. В `.env` добавьте:

```env
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/ваш_id/exec
```

После этого каждая отправка формы будет добавлять строку в таблицу.

---

## Отправка писем на почту (SMTP)

Чтобы по кнопке «Получить полный результат на почту» пользователю уходило письмо с полным отчётом, настройте SMTP в `.env`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=пароль-приложения
SMTP_FROM=your@gmail.com
```

Для Gmail нужен [пароль приложения](https://support.google.com/accounts/answer/185833), не обычный пароль.  
Для Yandex/Mail.ru включите в настройках ящика доступ по SMTP.

После сохранения `.env` перезапустите приложение.
