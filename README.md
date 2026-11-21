# Klar Studio

Адаптивный сайт швейцарской студии ремонта квартир в Цюрихе.

🌐 **Live:** https://uxliza.github.io/klar-studio/

---

## 📊 Performance (Mobile)

| Metric | Score |
|--------|-------|
| Performance | 94/100 |
| Best Practices | 96/100 |
| SEO | 91/100 |
| Accessibility | 78/100 |

*Google PageSpeed Insights, November 2026*

---

## 🛠 Tech Stack

## 🎨 Процесс разработки

1. **Дизайн в Figma** — создан адаптивный макет (десктоп + мобильная версия)
2. **Вёрстка** — HTML5 + Tailwind CSS (mobile-first подход)
3. **Интерактив** — Vanilla JavaScript (галерея, слайдеры, аккордеон, калькулятор)
4. **Оптимизация** — сжатие WebP, lazy loading, preload, PageSpeed 94/100
5. **GitHub Pages** — бесплатный хостинг

---

## ✨ Features

- Полностью адаптивная вёрстка (mobile-first)
- Интерактивная галерея проектов с hover-эффектами
- Слайдер «до/после» на страницах проектов
- Карусель отзывов клиентов
- FAQ-аккордеон
- Форма обратной связи с валидацией
- Калькулятор стоимости ремонта
- Cookie-баннер (GDPR)
- Оптимизация изображений (WebP, lazy loading, preload)

---

## 📁 Структура проекта

```
klar-studio-site/
├── index.html          # Главная страница
├── projects.html       # Все проекты
├── project1-4.html     # Страницы отдельных проектов
├── contacts.html       # Контакты
├── about.html          # О компании
├── privacy.html        # Политика конфиденциальности
├── impressum.html      # Impressum (Швейцария)
├── 404.html            # Страница ошибки
├── input.css           # Исходный CSS (Tailwind)
├── styles.css          # Собранный CSS
├── script.js           # JavaScript
├── tailwind.config.js  # Конфигурация Tailwind
└── img/                # Изображения
    ├── Common/         # Общие фото
    ├── Project-1/      # Фото проекта 1
    ├── Project-2/      # Фото проекта 2
    ├── Project-3/      # Фото проекта 3
    ├── Project-4/      # Фото проекта 4
    ├── Testimonials/   # Фото для отзывов
    └── avatars/        # Аватары клиентов
```

---

## 🚀 Как запустить локально

1. Клонируйте репозиторий:
```bash
git clone https://github.com/uxliza/klar-studio.git
```

2. Откройте `index.html` в браузере — или используйте Live Server в VS Code.

3. Для сборки CSS:
```bash
npm install
npx tailwindcss -i ./input.css -o ./styles.css --minify
```

---

## 📝 Лицензия

MIT License — свободное использование с указанием авторства.

---

Создано с ❤️ для Klar Studio, Цюрих, Швейцария.
