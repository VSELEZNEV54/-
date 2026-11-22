# Таксимания

Сайт московского автопарка с каталогом автомобилей, страницами тарифов и калькулятором. [Открыть сайт на GitHub Pages](https://vseleznev54.github.io/-/)

## Локальный запуск

```sh
npm ci
npm run dev
```

Локальная версия доступна по адресу [127.0.0.1:8766](http://127.0.0.1:8766/).

## Редактирование и публикация

Шаблоны страниц находятся в `_taksimaniya-build/`. Модели, тарифы и цены задаются в `taksimaniya-demo/assets/js/cars.js`. Стили, фотографии и видео лежат в `taksimaniya-demo/assets/`.

Команда `npm run build` обновляет HTML в `taksimaniya-demo/`. После отправки изменений в `main` GitHub Actions собирает эту папку и публикует её содержимое в корне сайта.

Формы заявок работают в демонстрационном режиме. Предыдущий прототип с двумя концепциями доступен в [метке concepts-before-taximania](https://github.com/VSELEZNEV54/-/tree/concepts-before-taximania).
