export interface FieldConfig {
  name: string;
  label: string;
  selected: boolean;
}

export const AVAILABLE_FIELDS: FieldConfig[] = [
  { name: 'isbn', label: 'ISBN', selected: true },
  { name: 'title', label: 'Tytuł', selected: true },
  { name: 'quantity', label: 'Ilość', selected: true },
  { name: 'poNumber', label: 'Numer zamówienia', selected: false },
  { name: 'author', label: 'Autor', selected: false },
  { name: 'line_number', label: 'Numer linii', selected: false },
  { name: 'owner', label: 'Właściciel', selected: false },
  { name: 'vendor', label: 'Dostawca', selected: false },
  { name: 'price', label: 'Cena', selected: false },
  { name: 'fund', label: 'Fundusz', selected: false },
];