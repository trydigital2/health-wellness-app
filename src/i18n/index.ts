import en from '@/languages/en';

type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

export type TranslationKey = NestedKeyOf<typeof en>;

export function t(path: string, fallback?: string): string {
  const keys = path.split('.');
  let current: any = en;

  for (const k of keys) {
    if (current && typeof current === 'object' && k in current) {
      current = current[k];
    } else {
      return fallback || path;
    }
  }

  return typeof current === 'string' ? current : fallback || path;
}

export default { t, en };
