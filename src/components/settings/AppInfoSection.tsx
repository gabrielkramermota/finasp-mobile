import { appName, appReleaseLabel, appVersion } from '../../core/app-info';
import { PlannerSectionCard } from '../planner/PlannerSectionCard';
import { Text, View } from '../ui/NativePrimitives';

export function AppInfoSection() {
  return (
    <PlannerSectionCard title="Detalhes do app">
      <View className="gap-4 py-2">
        <View className="border-brand/20 bg-brand-soft rounded-2xl border px-4 py-4">
          <Text className="text-brand-200 text-[10px] font-semibold tracking-[1.2px] uppercase">
            Aplicativo
          </Text>
          <Text className="text-content-primary mt-2 text-2xl font-black tracking-tight">
            {appName}
          </Text>
          <Text className="text-content-secondary mt-2 text-sm leading-6">
            Controle financeiro pessoal com foco em uso local no aparelho.
          </Text>
        </View>

        <View className="flex-row flex-wrap gap-3">
          <View className="border-border-subtle bg-background min-w-35 flex-1 rounded-[14px] border px-4 py-4">
            <Text className="text-content-subtle text-[10px] font-semibold tracking-[1.2px] uppercase">
              Versao do app
            </Text>
            <Text className="text-content-primary mt-2 text-xl font-black tracking-tight">
              v{appVersion}
            </Text>
          </View>

          <View className="border-border-subtle bg-background min-w-35 flex-1 rounded-[14px] border px-4 py-4">
            <Text className="text-content-subtle text-[10px] font-semibold tracking-[1.2px] uppercase">
              Status atual
            </Text>
            <Text className="text-brand-200 mt-2 text-xl font-black tracking-tight">
              {appReleaseLabel}
            </Text>
          </View>
        </View>

        <Text className="text-content-secondary text-sm leading-6">
          Esta versao esta em testes antes da release final. Use esse bloco para conferir a versao
          instalada.
        </Text>
      </View>
    </PlannerSectionCard>
  );
}
