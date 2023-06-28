export const ValidationMessage = {
  required: (field?: string) => (field ? `${field} harus terisi` : 'Harus terisi'),
  validEmail: (field: string) => `${field} harus berupa email`,
  match: (field1: string, field2: string) => `${field1} harus sama dengan ${field2}`
}
