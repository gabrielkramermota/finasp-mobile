export type AppTabKey = 'dashboard' | 'entries' | 'recurring' | 'settings';

export const appTabs: {
  key: AppTabKey;
  label: string;
  shortLabel: string;
}[] = [
  {
    key: 'dashboard',
    label: 'Resumo',
    shortLabel: 'MES',
  },
  {
    key: 'entries',
    label: 'Cadastro',
    shortLabel: 'ADD',
  },
  {
    key: 'recurring',
    label: 'Itens',
    shortLabel: 'LISTA',
  },
  {
    key: 'settings',
    label: 'Config',
    shortLabel: 'APP',
  },
];
