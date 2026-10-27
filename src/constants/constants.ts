import shelterScene from "@/assets/images/hero-shelter-scene.webp";
import cityMap from "@/assets/images/ekaterinburg-map.png";

export const STORAGE_KEY_LOCATION = "user-location";

export const homeItems = [
  {
    id: "overall",
    title: "Зимний комбинезон",
    condition: "Бесплатно",
    details: "98–104 см",
    location: "Уралмаш, 1,2 км",
  },
  {
    id: "shoes",
    title: "Детские ботиночки",
    condition: "Бесплатно",
    details: "Размер 26",
    location: "Уралмаш, 800 м",
  },
  {
    id: "toys",
    title: "Деревянные игрушки",
    condition: "Обмен",
    details: "Хорошее состояние",
    location: "Эльмаш, 1,7 км",
  },
  {
    id: "books",
    title: "Детские книги",
    condition: "Бесплатно",
    details: "6 штук",
    location: "Уралмаш, 2,1 км",
  },
  {
    id: "knitwear",
    title: "Вязаные вещи",
    condition: "Бесплатно",
    details: "Хорошее состояние",
    location: "Уралмаш, 900 м",
  },
  {
    id: "highchair",
    title: "Детский стульчик",
    condition: "Бесплатно",
    details: "Хорошее состояние",
    location: "Эльмаш, 2,4 км",
  },
  {
    id: "jacket",
    title: "Куртка",
    condition: "Обмен",
    details: "Хорошее состояние",
    location: "Уралмаш, 1,4 км",
  },
  {
    id: "boots",
    title: "Резиновые сапоги",
    condition: "Бесплатно",
    details: "Размер 27",
    location: "Уралмаш, 1,5 км",
  },
];

export const heroScene = {
  src: shelterScene,
  alt: "На общей поверхности: слева коробка с одеждой и книгой, справа сложенные вещи, книги и деревянные игрушки",
};

export const mapImage = cityMap;

export const collectionPoints = [
  {
    id: "p1",
    name: "Пункт в центре",
    address: "8 Марта, 46",
    hours: "Сегодня до 20:00",
    accepts: "Детская одежда и обувь",
    x: 48.75453,
    y: 48.21178,
  },
  {
    id: "p4",
    name: "Фонд на ВИЗе",
    address: "Крауля, 63",
    hours: "Сегодня до 19:00",
    accepts: "Одежда и обувь",
    x: 40.03772,
    y: 47.4195,
  },
  {
    id: "p5",
    name: "Пункт в Академическом",
    address: "Краснолесья, 133",
    hours: "Сегодня до 18:00",
    accepts: "Детская одежда и игрушки",
    x: 35.22524,
    y: 69.56979,
  },
  {
    id: "p6",
    name: "Контейнер на Ботанике",
    address: "Родонитовая, 4",
    hours: "Круглосуточно",
    accepts: "Одежда и домашний текстиль",
    x: 51.7676,
    y: 70.23902,
  },
  {
    id: "p2",
    name: "Фонд в Пионерском",
    address: "Советская, 7/1",
    hours: "Сегодня до 18:00",
    accepts: "Одежда, игрушки и книги",
    x: 53.61336,
    y: 34.90174,
  },
  {
    id: "p8",
    name: "Пункт на Уктусе",
    address: "Щербакова, 43",
    hours: "Сегодня до 20:00",
    accepts: "Одежда и обувь",
    x: 57.70385,
    y: 75.71359,
  },
  {
    id: "p7",
    name: "Фонд в Химмаше",
    address: "Грибоедова, 13",
    hours: "Завтра с 10:00",
    accepts: "Одежда и книги",
    x: 64.68666,
    y: 93.21444,
  },
  {
    id: "p10",
    name: "Пункт на ЖБИ",
    address: "Сиреневый бульвар, 2",
    hours: "Сегодня до 19:00",
    accepts: "Одежда, игрушки и книги",
    x: 62.82134,
    y: 44.87619,
  },
  {
    id: "p9",
    name: "Контейнер на Бебеля",
    address: "Бебеля, 138",
    hours: "Круглосуточно",
    accepts: "Одежда и домашний текстиль",
    x: 40.63095,
    y: 28.48363,
  },
  {
    id: "p3",
    name: "Контейнер на Уралмаше",
    address: "Победы, 18",
    hours: "Круглосуточно",
    accepts: "Одежда и домашний текстиль",
    x: 49.73229,
    y: 6.91952,
  },
];
