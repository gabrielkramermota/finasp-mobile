import { appName, appReleaseLabel, appVersion } from '../../core/app-info';
import { Text, View } from '../ui/NativePrimitives';

export function AppInfoSection() {
  return (
    <View className="items-center py-3">
      <Text className="text-content-subtle text-xs font-semibold">
        {appName} v{appVersion} · {appReleaseLabel}
      </Text>
    </View>
  );
}
