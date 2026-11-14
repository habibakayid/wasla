export type PrivacyKey = 'public' | 'followers' | 'only_me';

export const PRIVACY_OPTIONS: { key: PrivacyKey; icon: string; label: string }[] = [
  { key: 'public', icon: 'fa-earth-africa', label: 'Public' },
  { key: 'followers', icon: 'fa-user-group', label: 'Followers' },
  { key: 'only_me', icon: 'fa-lock', label: 'Only me' },
];


export function privacyOf(value: string | undefined | null): PrivacyKey {
  const v = (value || 'public').toLowerCase().replace(/[^a-z]/g, '');
  if (v.includes('follow') || v === 'friends') {
    return 'followers';
  }
  if (v.includes('onlyme') || v === 'private' || v === 'me' || v === 'onlyus') {
    return 'only_me';
  }
  return 'public';
}

export function privacyIcon(value: string | undefined | null): string {
  const key = privacyOf(value);
  return PRIVACY_OPTIONS.find((o) => o.key === key)!.icon;
}