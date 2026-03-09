import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';

import { BrandMark } from '../../components/branding/BrandMark';
import { ProfileAvatar } from '../../components/profile/ProfileAvatar';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from '../../components/ui/NativePrimitives';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { TextField } from '../../components/ui/TextField';
import { useToast } from '../../components/ui/ToastProvider';
import { saveUserProfile } from '../../service/user/user-repository';
import { storeProfilePhoto } from '../../storage/profile/profile-photo';
import { cn } from '../../utils/cn';

type OnboardingStep = 'intro' | 'profile';

const introHighlights = [
  'Cadastre salario, renda extra e investimentos do mes.',
  'Organize despesas fixas, parcelas e pendencias com clareza.',
  'Veja quanto deve sobrar antes do mes apertar.',
  'Tudo fica salvo localmente no seu celular.',
];

export function OnboardingPage() {
  const { showToast } = useToast();
  const [step, setStep] = useState<OnboardingStep>('intro');
  const [name, setName] = useState('');
  const [selectedPhotoUri, setSelectedPhotoUri] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isPickingPhoto, setIsPickingPhoto] = useState(false);

  async function handlePickPhoto() {
    setIsPickingPhoto(true);

    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        showToast({
          message: 'Permita o acesso as fotos para escolher uma imagem de perfil.',
          tone: 'error',
        });
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        mediaTypes: ['images'],
        quality: 0.8,
      });

      if (result.canceled || !result.assets?.[0]?.uri) {
        return;
      }

      setSelectedPhotoUri(result.assets[0].uri);
      showToast({
        message: 'Foto selecionada. Ela sera salva no armazenamento do app.',
        tone: 'success',
      });
    } catch (caughtError) {
      showToast({
        message: caughtError instanceof Error ? caughtError.message : 'Falha ao selecionar a foto.',
        tone: 'error',
      });
    } finally {
      setIsPickingPhoto(false);
    }
  }

  async function handleFinishOnboarding() {
    const trimmedName = name.trim();

    if (!trimmedName) {
      showToast({
        message: 'Informe seu nome para finalizar a configuracao inicial.',
        tone: 'error',
      });
      return;
    }

    setIsSaving(true);

    try {
      const storedPhotoUri = selectedPhotoUri ? storeProfilePhoto(selectedPhotoUri) : null;

      await saveUserProfile({
        name: trimmedName,
        photoUri: storedPhotoUri,
      });

      showToast({
        message: 'Perfil salvo. Agora o app esta pronto para uso.',
        tone: 'success',
      });
    } catch (caughtError) {
      showToast({
        message:
          caughtError instanceof Error ? caughtError.message : 'Falha ao salvar seu perfil local.',
        tone: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View className="gap-6 px-5 pt-6 pb-10">
        {step === 'intro' ? (
          <>
            <View className="items-center pt-6">
              <BrandMark imageClassName="h-32 w-48" />
            </View>

            <View className="items-start">
              <Text className="text-brand-200 text-[11px] font-semibold tracking-[1.6px] uppercase">
                Primeiro acesso
              </Text>
              <Text className="text-content-primary mt-3 text-[34px] font-black tracking-tight">
                Bem-vindo ao Finasp
              </Text>
              <Text className="text-content-secondary mt-4 text-base leading-7">
                O app foi pensado para substituir sua planilha mensal com uma visao mais clara do
                salario, das despesas e do valor que deve sobrar.
              </Text>
            </View>

            <View className="gap-3">
              {introHighlights.map((highlight) => (
                <View
                  key={highlight}
                  className="border-border-subtle bg-surface flex-row items-start gap-3 rounded-[18px] border px-4 py-4">
                  <View className="bg-brand mt-1 h-2.5 w-2.5 rounded-full" />
                  <Text className="text-content-secondary flex-1 text-sm leading-6">
                    {highlight}
                  </Text>
                </View>
              ))}
            </View>

            <PrimaryButton onPress={() => setStep('profile')} title="Continuar" />
          </>
        ) : (
          <>
            <View className="items-center pt-2">
              <ProfileAvatar name={name || 'Finasp'} photoUri={selectedPhotoUri} size="lg" />
            </View>

            <View>
              <Text className="text-brand-200 text-[11px] font-semibold tracking-[1.6px] uppercase">
                Seu perfil
              </Text>
              <Text className="text-content-primary mt-3 text-[32px] font-black tracking-tight">
                Configure seu nome
              </Text>
              <Text className="text-content-secondary mt-4 text-base leading-7">
                Seu nome fica salvo localmente para personalizar o app. A foto e opcional e tambem
                fica armazenada no proprio aparelho.
              </Text>
            </View>

            <View className="border-border-subtle bg-surface gap-4 rounded-[18px] border px-4 py-4">
              <TextField label="Nome" onChangeText={setName} placeholder="Seu nome" value={name} />

              <View className="gap-3">
                <Pressable
                  accessibilityRole="button"
                  className={cn(
                    'border-border-subtle bg-background items-center justify-center rounded-[14px] border px-5 py-4',
                    isPickingPhoto && 'opacity-60'
                  )}
                  disabled={isPickingPhoto}
                  onPress={handlePickPhoto}>
                  <Text className="text-content-secondary text-sm font-semibold tracking-[1.2px] uppercase">
                    {isPickingPhoto ? 'Selecionando foto...' : 'Escolher foto'}
                  </Text>
                </Pressable>

                {selectedPhotoUri ? (
                  <Pressable
                    accessibilityRole="button"
                    className="items-center justify-center rounded-[14px] px-5 py-3"
                    onPress={() => setSelectedPhotoUri(null)}>
                    <Text className="text-content-muted text-sm font-semibold">Remover foto</Text>
                  </Pressable>
                ) : null}
              </View>
            </View>

            <PrimaryButton
              disabled={isSaving}
              onPress={handleFinishOnboarding}
              title={isSaving ? 'Salvando...' : 'Entrar no app'}
            />

            <Pressable
              accessibilityRole="button"
              className="items-center justify-center px-5 py-3"
              disabled={isSaving}
              onPress={() => setStep('intro')}>
              {isSaving ? (
                <ActivityIndicator color="#d4d4d8" />
              ) : (
                <Text className="text-content-muted text-sm font-semibold">Voltar</Text>
              )}
            </Pressable>
          </>
        )}
      </View>
    </ScrollView>
  );
}
