import { eq } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import { db } from '../../storage/sqlite/client';
import { userProfileTable } from '../../storage/sqlite/schema/finance-schema';
import type { SaveUserProfileInput, UserProfile } from '../../domain/user/user-types';

const localUserProfileId = 'local-user-profile';

function createTimestamp() {
  return new Date().toISOString();
}

export function useUserProfile() {
  const userProfileQuery = useLiveQuery(db.select().from(userProfileTable).limit(1));

  return {
    error: userProfileQuery.error,
    isLoading: !userProfileQuery.error && userProfileQuery.data === undefined,
    profile: ((userProfileQuery.data?.[0] as UserProfile | undefined) ??
      null) as UserProfile | null,
  };
}

export async function saveUserProfile({ name, photoUri }: SaveUserProfileInput) {
  const timestamp = createTimestamp();
  const existingProfile = await db
    .select()
    .from(userProfileTable)
    .where(eq(userProfileTable.id, localUserProfileId))
    .limit(1);

  await db
    .insert(userProfileTable)
    .values({
      id: localUserProfileId,
      name,
      photoUri: photoUri ?? null,
      createdAt: existingProfile[0]?.createdAt ?? timestamp,
      updatedAt: timestamp,
    })
    .onConflictDoUpdate({
      target: userProfileTable.id,
      set: {
        name,
        photoUri: photoUri ?? null,
        updatedAt: timestamp,
      },
    });
}
