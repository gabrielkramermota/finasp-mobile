import { ClipboardList, LayoutDashboard, PlusCircle, Settings } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';

export type AppTabKey = 'dashboard' | 'entries' | 'recurring' | 'settings';

export const appTabs: {
  Icon: LucideIcon;
  key: AppTabKey;
  label: string;
}[] = [
  {
    Icon: LayoutDashboard,
    key: 'dashboard',
    label: 'Resumo',
  },
  {
    Icon: PlusCircle,
    key: 'entries',
    label: 'Cadastro',
  },
  {
    Icon: ClipboardList,
    key: 'recurring',
    label: 'Itens',
  },
  {
    Icon: Settings,
    key: 'settings',
    label: 'Config',
  },
];
