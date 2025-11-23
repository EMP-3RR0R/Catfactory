# Котозавод «Креативная киска»

Статический сайт для создания и заказа котиков.

## Структура проекта

```
/
  index.html          # Главная страница
  basket.html         # Корзина
  user.html           # Профиль пользователя
  components/         # HTML компоненты
    header.html
    footer.html
  src/                # JavaScript
    components/       # Компоненты
      constructor.js  # Логика конструктора
      reviews.js      # Карусель отзывов
      basket.js       # Логика корзины
      forms.js       # Валидация форм
    utils/            # Утилиты
    main.js          # Точка входа
  styles/             # CSS
    variables.css     # Переменные
    base.css         # Базовые стили
    layout.css       # Layout компоненты
    components/      # CSS компоненты
    style.css        # Общие стили
    index.css        # Стили страниц
  assets/            # Ресурсы
    images/
      cats/          # Изображения котиков
      icons/          # Иконки соцсетей
      logo.png        # Логотип
```

## Разработка

### Запуск

Откройте `index.html` в браузере или используйте локальный сервер:

```bash
python -m http.server 8000
# или
npx serve
```

### JavaScript

Для работы интерактивности подключите JavaScript модули:

```html
<script type="module" src="src/main.js"></script>
```

## Архитектура

- **Модульная CSS** - компоненты в отдельных файлах
- **ES6 модули** - JavaScript разбит на компоненты
- **Семантический HTML** - правильная разметка
- **Доступность** - ARIA атрибуты, правильная структура
