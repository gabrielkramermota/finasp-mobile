import { Directory, File, Paths } from 'expo-file-system';

const profileDirectory = new Directory(Paths.document, 'profile');

function normalizeExtension(extension: string) {
  if (!extension) {
    return '.jpg';
  }

  return extension.startsWith('.') ? extension : `.${extension}`;
}

function ensureProfileDirectory() {
  if (profileDirectory.exists) {
    return profileDirectory;
  }

  profileDirectory.create({
    idempotent: true,
    intermediates: true,
  });

  return profileDirectory;
}

export function clearStoredProfilePhoto() {
  if (!profileDirectory.exists) {
    return;
  }

  profileDirectory.list().forEach((entry) => {
    if (entry.exists) {
      entry.delete();
    }
  });
}

export function storeProfilePhoto(sourceUri: string) {
  const sourceFile = new File(sourceUri);
  const targetDirectory = ensureProfileDirectory();

  clearStoredProfilePhoto();

  const targetFile = new File(
    targetDirectory,
    `profile-photo${normalizeExtension(sourceFile.extension)}`
  );

  if (targetFile.exists) {
    targetFile.delete();
  }

  sourceFile.copy(targetFile);
  return targetFile.uri;
}
