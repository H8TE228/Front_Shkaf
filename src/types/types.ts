export interface HomeItem {
  id: string;
  title: string;
  condition: "Бесплатно" | "Обмен";
  details: string;
  location: string;
}

export interface CollectionPoint {
  id: string;
  name: string;
  address: string;
  hours: string;
  accepts: string;
  x: number;
  y: number;
}
