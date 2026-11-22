/* Автопарк «Таксимании». Модели, характеристики и цены перенесены со старого сайта таксимания.рф (ноябрь 2026).
   В рабочей версии эти данные будут приходить из CMS / учётной системы парка. */
window.TAXI_CLASSES = {
  "econom": {"name": "Эконом", "url": "tarif-ekonom.html", "hour": 950, "intro": "Kia Rio — компактный седан для городских смен. Сравните стоимость обычной аренды и программы с выкупом."},
  "comfort": {"name": "Комфорт", "url": "tarif-komfort.html", "hour": 1150, "intro": "Для городских смен можно выбрать седан, кроссовер или электромобиль. Сравните расход топлива, запас хода и ежедневный платёж."},
  "comfort-plus": {"name": "Комфорт+", "url": "tarif-komfort-plus.html", "hour": 1350, "intro": "В парке есть седаны и кроссоверы для «Комфорт+». У каждой модели свои условия аренды и выкупа — их можно сравнить в каталоге."},
  "business": {"name": "Бизнес", "url": "tarif-biznes.html", "hour": 1800, "intro": "Для поездок бизнес-класса в парке есть седан Hongqi H5. При выборе графика учитывайте разную стоимость первой и следующих недель."}
};

// Проезды из архива автопарка от 20 ноября. Без video обложкой служит первое фото модели.
window.TAXI_CARS = [
  {
    id: "tenet-t7", name: "TENET T7", cls: "comfort-plus", body: "crossover", fuel: "petrol", year: "2025",
    advantage: {"title": "Кроссовер с выкупом", "text": "TENET T7 2025 года можно взять для работы в «Комфорт+» и выкупить за четыре года."},
    gearbox: "Робот DCT7", engine: "1,6 л", fuelLabel: "Бензин", usage: "7,7 л / 100 км",
    rent: null, rentNote: "",
    buyout: [{ price: 4000, term: "4 года" }],
    badge: "Новинка", note: "Только выкуп на 4 года",
    video: {
      src: "assets/video/proezdy/tenet-t7.mp4",
      poster: "assets/img/cars/tenet-t7-proezd.webp"
    },
    img: ["assets/img/cars/t7-1.webp", "assets/img/cars/t7-2.webp", "assets/img/cars/t7-3.webp", "assets/img/cars/t7-4.webp"]
  },
  {
    id: "hongqi-h5", name: "Hongqi H5", cls: "business", body: "sedan", fuel: "petrol",
    video: {
      src: "assets/video/proezdy/hongqi-h5.mp4",
      poster: "assets/img/cars/hongqi-h5-proezd.webp"
    },
    advantage: {"title": "Седан для бизнес-класса", "text": "Hongqi H5 подходит для работы в тарифе «Бизнес». Первая неделя аренды стоит дешевле последующих."},
    gearbox: "АКПП", engine: "2,0 л", fuelLabel: "Бензин", usage: "6,8 л / 100 км",
    rent: 3900, rentNote: "первая неделя", rentLater: 4700,
    buyout: [],
    badge: "Бизнес-класс",
    img: ["assets/img/cars/hongqi-1.webp", "assets/img/cars/hongqi-2.webp", "assets/img/cars/hongqi-3.webp"]
  },
  {
    id: "dongfeng-shine-max", name: "Dongfeng Shine Max", cls: "comfort-plus", body: "sedan", fuel: "petrol",
    advantage: {"title": "Два срока выкупа", "text": "У Dongfeng Shine Max есть программы на два и на три года. Можно выбрать между меньшим ежедневным платежом и более быстрым выкупом."},
    gearbox: "АКПП", engine: "1,5 л", fuelLabel: "Бензин", usage: "6,2 л / 100 км",
    rent: 3500, rentNote: "",
    buyout: [{ price: 3000, term: "3 года" }, { price: 3500, term: "2 года" }],
    img: ["assets/img/cars/dongfeng-1.webp", "assets/img/cars/dongfeng-2.webp", "assets/img/cars/dongfeng-3.webp"]
  },
  {
    id: "geely-coolray", name: "Geely Coolray", cls: "comfort", body: "crossover", fuel: "petrol",
    advantage: {"title": "Кроссовер в «Комфорте»", "text": "Geely Coolray подойдёт, если для городских заказов вам удобнее посадка кроссовера. В парке доступны аренда и две программы выкупа."},
    gearbox: "АКПП", engine: "1,5 л", fuelLabel: "Бензин", usage: "6,1 л / 100 км",
    rent: 2300, rentNote: "",
    buyout: [{ price: 3000, term: "3 года" }, { price: 3400, term: "2 года" }],
    img: ["assets/img/cars/geely-1.webp", "assets/img/cars/geely-2.webp", "assets/img/cars/geely-3.webp"]
  },
  {
    id: "faw-bestune-b70", name: "FAW Bestune B70", cls: "comfort-plus", body: "sedan", fuel: "petrol",
    advantage: {"title": "Короткий срок выкупа", "text": "FAW Bestune B70 можно выкупить за полтора года. Для начала работы в «Комфорт+» есть и обычная аренда."},
    gearbox: "АКПП", engine: "1,5 л", fuelLabel: "Бензин", usage: "9,5 л / 100 км",
    rent: 2500, rentNote: "",
    buyout: [{ price: 3200, term: "1,5 года" }],
    img: ["assets/img/cars/faw-1.webp", "assets/img/cars/faw-2.webp", "assets/img/cars/faw-3.webp"]
  },
  {
    id: "evolute-i-pro", name: "Evolute i-Pro", cls: "comfort", body: "sedan", fuel: "electro",
    advantage: {"title": "Смена на электротяге", "text": "Evolute i-Pro работает на электричестве. Ориентир для планирования маршрута между зарядками — до 350 км."},
    gearbox: "АКПП", engine: "Электро", fuelLabel: "Электро", usage: "до 350 км на заряде",
    rent: 3000, rentNote: "",
    buyout: [{ price: 3000, term: "2 года" }],
    badge: "Электро",
    img: ["assets/img/cars/evolute-1.webp", "assets/img/cars/evolute-2.webp", "assets/img/cars/evolute-3.webp"]
  },
  {
    id: "kia-optima", name: "Kia Optima", cls: "comfort", body: "sedan", fuel: "petrol",
    advantage: {"title": "Доступный седан для «Комфорта»", "text": "На Kia Optima можно начать с аренды или выбрать выкуп на два года. Оба формата доступны для одного и того же тарифа."},
    gearbox: "АКПП", engine: "2,0 л", fuelLabel: "Бензин", usage: "8,2 л / 100 км",
    rent: 2000, rentNote: "",
    buyout: [{ price: 2600, term: "2 года" }],
    img: ["assets/img/cars/optima-1.webp", "assets/img/cars/optima-2.webp", "assets/img/cars/optima-3.webp"]
  },
  {
    id: "chery-tiggo-8-pro-max", name: "Chery Tiggo 8 Pro Max", cls: "comfort-plus", body: "crossover", fuel: "petrol",
    advantage: {"title": "Кроссовер с выбором программы", "text": "Chery Tiggo 8 Pro Max доступен для работы в «Комфорт+». Можно взять машину в аренду либо выкупить за два или три года."},
    gearbox: "Робот", engine: "2,0 л", fuelLabel: "Бензин", usage: "7,3 л / 100 км",
    rent: 4500, rentNote: "",
    buyout: [{ price: 3000, term: "3 года" }, { price: 3500, term: "2 года" }],
    img: ["assets/img/cars/tiggo8-1.webp", "assets/img/cars/tiggo8-2.webp", "assets/img/cars/tiggo8-3.webp"]
  },
  {
    id: "chery-tiggo-7-pro", name: "Chery Tiggo 7 Pro", cls: "comfort-plus", body: "crossover", fuel: "petrol",
    advantage: {"title": "Кроссовер в обычную аренду", "text": "Chery Tiggo 7 Pro подойдёт для работы в «Комфорт+», если вам удобен кроссовер с ежедневной арендной платой."},
    gearbox: "Робот", engine: "2,0 л", fuelLabel: "Бензин", usage: "8,2 л / 100 км",
    rent: 3000, rentNote: "",
    buyout: [],
    img: ["assets/img/cars/tiggo7-1.webp", "assets/img/cars/tiggo7-2.webp", "assets/img/cars/tiggo7-3.webp"]
  },
  {
    id: "kia-rio", name: "Kia Rio", cls: "econom", body: "sedan", fuel: "petrol",
    video: {
      src: "assets/video/proezdy/kia-rio.mp4",
      poster: "assets/img/cars/kia-rio-proezd.webp"
    },
    advantage: {"title": "Доступный старт в «Экономе»", "text": "У Kia Rio самая доступная аренда в парке. Если планируете выкуп, можно выбрать срок два или три года."},
    gearbox: "АКПП", engine: "1,6 л", fuelLabel: "Бензин", usage: "7,5 л / 100 км",
    rent: 1600, rentNote: "",
    buyout: [{ price: 2000, term: "3 года" }, { price: 2400, term: "2 года" }],
    badge: "Лучшая цена",
    img: ["assets/img/cars/rio-1.webp", "assets/img/cars/rio-2.webp", "assets/img/cars/rio-3.webp"]
  },
  {
    id: "kia-k5", name: "Kia K5", cls: "comfort-plus", body: "sedan", fuel: "petrol",
    advantage: {"title": "Седан для «Комфорт+»", "text": "Kia K5 с двухлитровым двигателем и автоматической коробкой можно взять в обычную аренду для поездок в «Комфорт+»."},
    gearbox: "АКПП", engine: "2,0 л", fuelLabel: "Бензин", usage: "9,2 л / 100 км",
    rent: 2700, rentNote: "",
    buyout: [],
    img: ["assets/img/cars/k5-1.webp", "assets/img/cars/k5-2.webp", "assets/img/cars/k5-3.webp"]
  }
];

// Одни условия для страниц, калькулятора, подбора и формы заявки.
window.TAXI_PLANS = function plansFor(car) {
  const plans = [];
  if (car.rent) {
    plans.push({ key: "rent", format: "rent", label: car.rentNote ? "Аренда · " + car.rentNote : "Аренда",
      daily: car.rent, laterDaily: car.rentLater || car.rent });
    if (car.rentLater) plans.push({ key: "rent-later", format: "rent", label: "Аренда · со второй недели", daily: car.rentLater });
  }
  car.buyout.forEach((offer, index) => {
    plans.push({ key: "buyout-" + index, format: "buyout", label: "Выкуп на " + offer.term, daily: offer.price });
  });
  return plans;
};
