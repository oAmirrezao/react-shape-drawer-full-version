# mini-paint

یک اپلیکیشن ساده‌ی React + Express برای ترسیم اشکال، ذخیره و بازیابی آن‌ها با SQLite.

---

## پیش‌نیازها

- Node.js (نسخه 14+)
- npm (نسخه 6+)

---

## نصب و اجرا

```bash
# در شاخه‌ی ریشه‌ی پروژه (mini-paint)
npm install        # فقط یک‌بار
npm run dev        # با concurrently هم backend و frontend را اجرا می‌کند
```
اگر مورد بالا را نتوانستید اجرا کنید، هیچ اشکالی ندارد. به صورت جداگانه دستور زیر را در پوشه‌های mini_paint/server و mini_paint اجرا کنید:
```bash
npm start
```

- بک‌اند روی http://localhost:5000  
- فرانت‌اند روی http://localhost:3000  

---

## ۱) آزمون دستی در فرانت‌اند

### الف) ورود کاربر

1. مرورگر را باز کنید و به http://localhost:3000 بروید.  
2. **(به دلیل React Strict Mode)** دو بار prompt با متن زیر نمایش داده می‌شود؛ هر دو بار باید نام خود را وارد کنید:
   > لطفاً نام خود را وارد کنید  
3. پس از OK زدن دوم، وارد صفحه‌ی اصلی طراحی می‌شوید.  
4. در DevTools → Application → Local Storage → http://localhost:3000 ببینید که دو کلید زیر ذخیره شده‌اند:
   - `userId`  
   - `userName`  

### ب) ابزارهای رسم و Undo/Redo

1. یکی از اشکال (دایره/مربع/مثلث) را انتخاب کنید.  
2. در بوم کلیک یا کلیک و درگ کنید تا شکل ترسیم شود.  
3. دکمه‌ی **Undo** را بزنید:
   - شکل آخر حذف می‌شود.  
   - شمارش اشکال (پایین صفحه) به‌روز می‌شود.  
4. دکمه‌ی **Redo** را بزنید:
   - شکل بازگردانده می‌شود.  
   - شمارش به مقدار قبلی برمی‌گردد.  

### ج) Export / Import روی کلاینت

1. چند شکل روی بوم ترسیم کنید.  
2. روی **Export** کلیک کنید:
   - یک فایل JSON دانلود می‌شود یا پنجره پرامپت JSON باز می‌شود.  
3. بوم را با دکمه **Clear** یا ریفرش صفحه خالی کنید.  
4. روی **Import** کلیک کنید:
   - JSON را در پرامپت بچسبانید و OK بزنید.  
5. باید دقیقاً همان اشکال روی بوم بازیابی شوند.  

### د) Save to Server (POST /paintings/:userId)

1. پس از ترسیم چند شکل، روی **Save to Server** کلیک کنید.  
2. در تب **Network** (DevTools) بررسی کنید:
   - درخواست `POST http://localhost:5000/paintings/{userId}`  
   - body شامل:
     ```json
     {
       "title": "...",
       "data": [ { "x":…, "y":…, "type":… }, … ]
     }
     ```
   - status 200 یا 201  
3. در کنسول سرور ببینید که INSERT جدید در جدول Paintings اتفاق افتاده است.  

### ه) Load from Server (GET /paintings/:userId)

1. بوم را با Clear یا ریفرش خالی کنید.  
2. روی **Load from Server** کلیک کنید.  
3. در Network بررسی کنید:
   - درخواست `GET http://localhost:5000/paintings/{userId}`  
   - response آرایه‌ای از اشیاء (data) باشد.  
4. اشکال باید روی بوم بازیابی و شمارش‌ها بروزرسانی شوند.  

---

## ۲) آزمون مستقیم API با curl یا Postman

### ساخت کاربر جدید

```bash
curl -X POST http://localhost:5000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"testuser"}'
```
پاسخ نمونه:
json
{ "id": 1, "name": "testuser" }

### ثبت یک نقاشی

bash
curl -X POST http://localhost:5000/paintings/1 \
  -H "Content-Type: application/json" \
  -d '{
        "title": "mypic",
        "data": [ { "x": 10, "y": 20, "type": "circle" } ]
      }'

- باید پاسخ با status موفق و JSON نقاشی ذخیره‌شده باشد.

### واکشی نقاشی‌ها

curl http://localhost:5000/paintings/1

- پاسخ باید آرایه‌ای از همه‌ی نقاشی‌های کاربر باشد.

---

## ۳) اعتبارسنجی در پایگاه داده (SQLite)

bash
cd server
sqlite3 database.sqlite

در محیط sqlite3:

.tables             -- نمایش جداول Users و Paintings
SELECT * FROM Users;
SELECT * FROM Paintings;
مطمئن شوید رکوردها مطابق درخواست‌های شما هستند.

---

## ۴) نکاتی برای آزمون‌های اتوماتیک

- بک‌اند: Jest + supertest  
  • تست POST `/users`  
  • تست GET/POST `/paintings/:userId`  
- فرانت‌اند: React Testing Library  
  • موک کردن `window.prompt` و `fetch`  
  • پوشش useEffect و رندر صحیح کامپوننت‌ها  

---

تصاویر تست‌کردن آیتم‌های جدید(یعنی گزینه‌های save to server و load from server را می‌توانید در اینجا مشاهده بفرمایید.
save to server:
<img width="1855" height="962" alt="save_to_server_test1" src="https://github.com/user-attachments/assets/cbb86502-c695-4a80-89bd-856a70d27db9" />
<img width="1856" height="962" alt="save_to_server_test2" src="https://github.com/user-attachments/assets/704b178f-1f01-4fca-a788-81600fca6b89" />
<img width="1437" height="150" alt="save_to_server_test3" src="https://github.com/user-attachments/assets/4b249ad6-9b65-47fe-80ca-41df6846d6a4" />
load from server:
<img width="1857" height="963" alt="load_from_server1" src="https://github.com/user-attachments/assets/c6ef46ac-4139-4cfe-95a4-2c9fa7182199" />
<img width="1860" height="957" alt="load_from_server2" src="https://github.com/user-attachments/assets/ca4f26e7-93c8-4631-8f09-bf320525dd6a" />
<img width="1420" height="22" alt="load_from_server3" src="https://github.com/user-attachments/assets/de8aee56-44c4-446b-8973-c38512158140" />

