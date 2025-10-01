// Definiuje strukturę pojedynczego pola w ustawieniach
export interface FieldConfig {
  name: string;
  label: string;
  selected: boolean;
  customLabel: string; // Upewniamy się, że to pole jest wymagane
}

// Definiuje ogólną strukturę ustawień zapisywanych w Alma Config
export interface AppSettings {
  availableFields: FieldConfig[];
}