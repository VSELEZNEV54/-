// Статические страницы парка. Каталог и условия программ берём из одного набора данных.
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const OUT = path.resolve(__dirname, "../taksimaniya-demo");
const read = file => fs.readFileSync(path.join(__dirname, file), "utf8");
const ctx = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(OUT, "assets/js/cars.js"), "utf8"), ctx);
const { TAXI_CARS: cars, TAXI_CLASSES: classes, TAXI_PLANS: plansFor } = ctx.window;
const byClass = key => cars.filter(car => car.cls === key);
const carUrl = car => `avto-${car.id}.html`;
const money = number => Math.round(number).toLocaleString("ru-RU").replace(/\u00a0/g, " ");
const plural = new Intl.PluralRules("ru");
const models = n => `${n} ${({ one: "модель", few: "модели", many: "моделей" })[plural.select(n)]}`;
const esc = value => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const icon = name => `<svg class="icon" aria-hidden="true"><use href="#i-${name}"></use></svg>`;
const arrow = `<span class="btn__icon">${icon("arrow")}${icon("arrow")}</span>`;
const cheapest = list => Math.min(...list.flatMap(car => plansFor(car).map(plan => plan.daily)));
function priceDay(key) {
  const list = byClass(key);
  const rents = list.map(car => car.rent).filter(Boolean);
  return rents.length ? Math.min(...rents) : cheapest(list);
}

function actions(car, withArrow = false) {
  const size = withArrow ? "" : " btn--sm btn--plain";
  const button = (format, label, theme = "") => `<button type="button" class="btn${size}${theme}" data-enquiry data-car="${car.id}" data-format="${format}">${label}${withArrow ? arrow : ""}</button>`;
  return [
    car.rent ? button("rent", "Заявка на аренду") : "",
    car.buyout.length ? button("buyout", "Заявка на выкуп", " btn--dark") : ""
  ].join("");
}

function card(car) {
  const name = esc(car.name);
  const cls = esc(classes[car.cls].name);
  const buyPrice = Math.min(...car.buyout.map(offer => offer.price));
  const formats = [car.rent && "rent", car.buyout.length && "buyout"].filter(Boolean).join(" ");
  const images = car.img.slice(0, 3);
  const photos = images.map((src, i) => `<img${i ? "" : ' class="is-active"'} src="${esc(src)}" alt="${name} — фото ${i + 1}" loading="lazy" decoding="async" width="1100" height="733">`);
  const tags = [`<span class="tag">${cls}</span>`];
  if (car.badge && car.badge !== classes[car.cls].name && car.badge !== "Бизнес-класс") tags.push(`<span class="tag tag--orange">${esc(car.badge)}</span>`);
  const specs = [["gear", car.gearbox], ["engine", car.engine], [car.fuel === "electro" ? "bolt" : "fuel", car.fuelLabel], ["route", car.usage]];
  const prices = [];
  if (car.rent) prices.push(`<div class="price"><div class="price__label">Аренда${car.rentLater ? ", 1-я неделя" : ""}</div><div class="price__value">${money(car.rent)} ₽<small>/сут</small></div>${car.rentLater ? `<div class="price__note">далее ${money(car.rentLater)} ₽</div>` : ""}</div>`);
  if (car.buyout.length) prices.push(`<div class="price price--buyout"><div class="price__label">С выкупом</div><div class="price__value">${car.buyout.length > 1 ? "от " : ""}${money(buyPrice)} ₽<small>/сут</small></div><div class="price__note">${car.buyout.map(b => esc(b.term)).join(" или ")}</div></div>`);
  return `<article class="car-card" id="car-${car.id}" data-car="${car.id}" data-cls="${car.cls}" data-body="${car.body}" data-fuel="${car.fuel}" data-formats="${formats}" data-price="${car.rent || buyPrice}" data-buyout-price="${car.buyout.length ? buyPrice : ""}" data-order="${cars.indexOf(car)}">
    <a class="car-card__media" href="${carUrl(car)}" aria-label="Подробнее о ${name}" tabindex="-1">
      ${photos.join("\n      ")}
      <div class="car-card__dots" aria-hidden="true">${images.map((_, i) => `<i${i ? "" : ' class="is-active"'}></i>`).join("")}</div>
      <div class="car-card__tags">${tags.join("")}</div>
    </a>
    <div class="car-card__body">
      <h3 class="car-card__name"><a href="${carUrl(car)}">${name}</a></h3>
      <ul class="car-card__specs" aria-label="Характеристики">${specs.map(([pic, value]) => `<li>${icon(pic)}<span>${esc(value)}</span></li>`).join("")}</ul>
      <div class="car-card__prices">${prices.join("")}</div>
      <div class="car-card__actions">${actions(car)}</div>
    </div>
  </article>`;
}
const cardsHtml = list => list.map(card).join("\n");

function catalogVars(key = "") {
  const list = key ? byClass(key) : cars;
  const links = [["", { name: "Все тарифы", url: "avtopark.html" }], ...Object.entries(classes)];
  const filters = links.map(([id, tariff]) => `<a class="chip" href="${tariff.url}#catalog"${id === key ? ' aria-current="page"' : ""}>${esc(tariff.name)}</a>`);
  return {
    catalog_class: key, catalog_cards: cardsHtml(list), catalog_count: `В каталоге <b>${models(list.length)}</b>`,
    catalog_enquiry: key ? `data-tariff="${key}"` : "", tariff_filters: filters.join("\n")
  };
}

function calcVars(car) {
  const key = car ? car.cls : "comfort";
  const tariff = classes[key];
  const plans = car ? plansFor(car) : [];
  const daily = car ? plans[0].daily : priceDay(key);
  const gross = tariff.hour * 10 * 6, weekly = daily * 7;
  const later = plans[0]?.laterDaily || daily;
  const title = `Оставить заявку на тариф «${tariff.name}»`;
  const options = plans.map(plan => `<option value="${plan.key}">${esc(plan.label)} · ${money(plan.daily)} ₽/сутки</option>`).join("");
  const buttons = Object.entries(classes).map(([id, cl]) => `<button type="button" data-tariff="${id}" aria-pressed="${id === key}">${esc(cl.name)}</button>`).join("");
  return {
    calc_model: car?.id || "", calc_tariff_name: esc(tariff.name), calc_net: money(gross - weekly),
    calc_gross: money(gross), calc_rent: "− " + money(weekly), calc_month: "≈ " + money(gross * 4.3 - weekly - later * 7 * 3.3),
    calc_intro: car ? `Выберите график смен для ${esc(car.name)}. В расчёте учтём ежедневный платёж по выбранным условиям.` : "Выберите тариф и график смен. Посчитаем выручку за неделю и вычтем плату за автомобиль.",
    calc_controls: car
      ? `<label class="calc__label" for="calc-plan">Условия для ${esc(car.name)}</label><select class="select" id="calc-plan" data-calc-plan>${options}</select>`
      : `<p class="calc__label" id="calc-tariff">Тариф</p><div class="seg" role="group" aria-labelledby="calc-tariff">${buttons}</div>`,
    calc_cta_attrs: `data-tariff="${key}"${car ? ` data-car="${car.id}" data-format="${plans[0].format}" data-plan="${plans[0].key}"` : ""}`,
    calc_cta_label: car ? `Заявка на ${plans[0].format === "rent" ? "аренду" : "выкуп"}` : title
  };
}

function seo(title, description, image, crumbs) {
  const items = [["Главная", "index.html"], ["Автопарк", "avtopark.html"], ...crumbs];
  return {
    title: esc(title), description: esc(description), image: esc(image),
    breadcrumbs_json: JSON.stringify({
      "@context": "https://schema.org", "@type": "BreadcrumbList",
      itemListElement: items.map(([name, url], i) => ({ "@type": "ListItem", position: i + 1, name, item: url }))
    }).replace(/</g, "\\u003c")
  };
}

function filmFiles(slug, posterDir = "assets/img/cars") {
  return {
    src: `assets/video/${slug}.mp4`, portraitSrc: `assets/video/${slug}-portrait.mp4`,
    poster: `${posterDir}/${slug}-poster.webp`, portraitPoster: `${posterDir}/${slug}-portrait.webp`
  };
}

const modelFilm = car => car.video === true ? filmFiles(car.id) : car.video;

function filmVars(film) {
  const sources = [["data-src", film.src], ["data-mobile-src", film.mobileSrc], ["data-portrait-src", film.portraitSrc]];
  return {
    film_poster: esc(film.poster),
    video_sources: sources.filter(([, src]) => src).map(([attr, src]) => `${attr}="${esc(src)}"`).join(" "),
    portrait_cover: film.portraitPoster ? `\n    <source media="(max-aspect-ratio: 3/4)" srcset="${esc(film.portraitPoster)}">` : ""
  };
}

function modelMedia(car, film = modelFilm(car)) {
  if (film) return { partials: { "model-media": "film-media" }, ...filmVars(film) };
  return { partials: { "model-media": "photo-media" }, hero_photo: esc(car.img[0]) };
}

function modelVars(car) {
  const tariff = classes[car.cls];
  const film = modelFilm(car);
  const name = esc(car.name);
  const terms = car.buyout.length ? " с выкупом" : "";
  const headline = `Аренда авто ${car.name}${terms} под такси в Москве`;
  const plans = plansFor(car);
  const mediaDescription = film ? "Видео проезда, фотографии и характеристики." : "Фотографии, характеристики и расчёт дохода.";
  const description = `${car.name} для тарифа «${tariff.name}» в Москве. ${plans.map(p => `${p.label} — ${money(p.daily)} ₽/сутки`).join(". ")}. ${mediaDescription}`;
  const photoThumbs = car.img.map((src, i) => `<button type="button" data-thumb="${i}" aria-label="Фото ${i + 1} из ${car.img.length}" aria-current="${i === 0}"><img src="${esc(src)}" alt="" width="300" height="200" loading="lazy"></button>`);
  const specs = [["Кузов", car.body === "crossover" ? "Кроссовер" : "Седан"], ["Коробка передач", car.gearbox], ["Двигатель", car.engine], [car.fuel === "electro" ? "Запас хода" : "Расход топлива", car.usage]];
  if (car.year) specs.unshift(["Год выпуска", car.year]);
  specs.push(["Тип топлива", car.fuelLabel]);
  const benefit = (pic, heading, body) => `<article><span class="model-benefit-icon">${icon(pic)}</span><h3>${esc(heading)}</h3><p>${esc(body)}</p></article>`;
  const advantage = car.advantage || { title: car.body === "crossover" ? "Кроссовер для смен в такси" : "Седан для смен в такси", text: `${car.name} доступен для работы в тарифе «${tariff.name}» в Москве.` };
  const practical = car.fuel === "electro"
    ? ["bolt", "Без расходов на бензин", "При планировании смены учитывайте стоимость зарядки и расположение станций на маршруте."]
    : ["fuel", "Планирование затрат на бензин", `Расход ${car.name} — ${car.usage}. По нему можно заранее оценить расходы на топливо для своего пробега.`];
  const related = cars.filter(item => item !== car).sort((a, b) => Number(b.cls === car.cls) - Number(a.cls === car.cls) || Number(b.body === car.body) - Number(a.body === car.body)).slice(0, 3);
  const prices = plans.map(p => `<div class="detail__price${p.format === "buyout" ? " detail__price--buyout" : ""}"><span>${esc(p.label)}</span><b>${money(p.daily)} ₽/сутки</b></div>`).join("");
  const heroRate = (label, price) => `<div><dt>${esc(label)}</dt><dd>${price} <small>₽/сутки</small></dd></div>`;
  const heroRates = plans.filter(p => p.format === "rent" || car.buyout.length === 1).map(p => heroRate(p.label, money(p.daily)));
  if (car.buyout.length > 1) heroRates.push(heroRate("С выкупом", "от " + money(Math.min(...car.buyout.map(b => b.price)))));
  return {
    ...seo(`${headline} — Таксимания`, description, film?.poster || car.img[0], [[tariff.name, tariff.url], [car.name, carUrl(car)]]),
    ...calcVars(car), model_terms: terms && ` <span>${terms.trim()}</span>`, model_id: car.id, model_name: name,
    ...modelMedia(car, film), gallery_image: esc(car.img[0]), photo_count: car.img.length,
    hero_rates: heroRates.join(""),
    hero_actions: actions(car, true),
    class_url: tariff.url, tariff_name: esc(tariff.name), actions: actions(car),
    thumbs: photoThumbs.join(""),
    specs: specs.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join(""),
    prices, offer_details: car.buyout.length > 1 ? `<h3 class="h3 detail__terms-title">Условия аренды и выкупа</h3><div class="detail__prices">${prices}</div>` : "",
    benefits: [benefit("car", advantage.title, advantage.text), benefit(...practical), benefit("wrench", "Обслуживание в парке", `Плановое обслуживание ${car.name} проходит в сервисе Таксимании. С вопросами по машине можно обратиться в поддержку парка круглосуточно.`)].join(""),
    related: cardsHtml(related),
    float_label: `${name} · <b>${money(plans[0].daily)} ₽/сутки</b>`,
    float_cta: `<button class="btn btn--sm" type="button" data-enquiry data-car="${car.id}" data-format="${plans[0].format}">Заявка на ${car.rent ? "аренду" : "выкуп"} ${arrow}</button>`
  };
}

function render(template, vars) {
  const include = text => text.replace(/\{\{> ([\w-]+)\}\}/g, (_, name) => include(read(`partials/${vars.partials?.[name] || name}.html`)));
  const html = include(read(`pages/${template}.html`))
    .replace(/\{\{cur:(\w+)\}\}/g, (_, key) => key === vars.cur ? ' aria-current="page"' : "")
    .replace(/\{\{price:([\w-]+)\}\}/g, (_, key) => money(priceDay(key)))
    .replace(/\{\{url:([\w-]+)\}\}/g, (_, key) => classes[key].url)
    .replace(/\{\{i:([\w-]+)\}\}/g, (_, name) => icon(name))
    .replace(/\{\{(\w+)\}\}/g, (_, key) => {
      if (!Object.hasOwn(vars, key)) throw Error(`Отсутствует значение {{${key}}} для ${template}`);
      return vars[key];
    });
  if (html.includes("{{")) throw Error(`Незаполненный шаблон: ${template}`);
  return html;
}

const defaults = {
  arrow, cur: "", float_label: "Аренда от <b>1 600 ₽/сутки</b> · без залога",
  float_cta: `<button class="btn btn--sm" type="button" data-enquiry>Оставить заявку ${arrow}</button>`
};
const pages = new Map();
const add = (file, template, vars) => pages.set(file, render(template, { ...defaults, ...vars }));
const frontIds = ["kia-rio", "geely-coolray", "tenet-t7", "dongfeng-shine-max", "hongqi-h5", "chery-tiggo-8-pro-max"];
const fleetFilm = { ...filmFiles("fleet-drive", "assets/img"), mobileSrc: "assets/video/taksimaniya-drive-mobile.mp4" };
add("index.html", "index", {
  ...calcVars(), ...filmVars(fleetFilm), cur: "home", fleet_count: models(cars.length),
  cards_popular: cardsHtml(frontIds.map(id => cars.find(car => car.id === id)).filter(Boolean)),
  quiz_classes: Object.entries(classes).map(([key, cl]) => `<label class="quiz-choice"><input type="radio" name="tariff" value="${key}"><span><b>${esc(cl.name)}</b></span></label>`).join(""),
  float_cta: `<a class="btn btn--sm" href="avtopark.html">Выбрать автомобиль ${arrow}</a>`
});
add("avtopark.html", "avtopark", { ...catalogVars(), ...filmVars(fleetFilm), cur: "park" });

for (const [key, tariff] of Object.entries(classes)) {
  const list = byClass(key);
  const price = priceDay(key);
  const cover = list.find(car => car.video) || list.find(car => car.rent === price) || list[0];
  add(tariff.url, "tariff", {
    ...catalogVars(key), ...seo(`Авто под такси «${tariff.name}» в Москве — от ${money(price)} ₽/сутки | Таксимания`,
      `Аренда автомобилей для работы в тарифе «${tariff.name}» в Москве. В парке ${models(list.length)}, от ${money(price)} ₽ в сутки. ${tariff.intro}`, cover.img[0], [[tariff.name, tariff.url]]),
    ...modelMedia(cover), tariff_name: esc(tariff.name), tariff_intro: esc(tariff.intro), price_day: money(price), count_models: models(list.length),
    float_label: `${esc(tariff.name)} · <b>от ${money(price)} ₽/сутки</b>`,
    float_cta: `<button class="btn btn--sm" type="button" data-enquiry data-tariff="${key}">Заявка на тариф ${arrow}</button>`
  });
}
for (const car of cars) add(carUrl(car), "model", modelVars(car));

for (const [filename, html] of pages) {
  const target = path.join(OUT, filename);
  if (!fs.existsSync(target) || fs.readFileSync(target, "utf8") !== html) fs.writeFileSync(target, html);
}
console.log(`Собрано страниц: ${pages.size}, тарифов: ${Object.keys(classes).length}, моделей: ${cars.length}`);
