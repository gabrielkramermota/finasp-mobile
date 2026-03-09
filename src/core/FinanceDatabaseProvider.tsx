import React from 'react';
import type { ReactNode } from 'react';

import { BootSplash } from '../components/branding/BootSplash';
import { Text, View } from '../components/ui/NativePrimitives';
import { bootstrapFinanceDatabase } from '../storage/sqlite/bootstrap-finance-database';

type FinanceDatabaseProviderProps = {
  children: ReactNode;
};

function LoadingState() {
  return (
    <BootSplash
      message="Preparando a estrutura do banco local para o app funcionar."
      title="Preparando banco local"
    />
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <View className="bg-background flex-1 items-center justify-center px-8">
      <Text className="text-expense text-[11px] font-semibold tracking-[1.6px] uppercase">
        Banco indisponivel
      </Text>
      <Text className="text-content-primary mt-4 max-w-sm text-center text-lg font-bold">
        Nao foi possivel preparar o banco local do app.
      </Text>
      <Text className="text-content-muted mt-3 max-w-sm text-center text-sm leading-6">
        {message}
      </Text>
    </View>
  );
}

export function FinanceDatabaseProvider({ children }: FinanceDatabaseProviderProps) {
  const [error, setError] = React.useState<Error | null>(null);
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    try {
      bootstrapFinanceDatabase();
      setIsReady(true);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError
          : new Error('Falha desconhecida ao preparar o banco local.')
      );
    }
  }, []);

  if (error) {
    return <ErrorState message={error.message} />;
  }

  if (!isReady) {
    return <LoadingState />;
  }

  return <>{children}</>;
}
