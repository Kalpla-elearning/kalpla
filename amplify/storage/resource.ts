import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'kalpla-storage',
  access: (allow) => ({
    'public/*': [
      allow.guest.to(['read']),
      allow.authenticated.to(['read', 'write', 'delete']),
    ],
    'private/{identity_id}/*': [
      allow.authenticated.to(['read', 'write', 'delete']),
    ],
    'courses/*': [
      allow.authenticated.to(['read']),
      allow.authenticated.role('ADMIN').to(['read', 'write', 'delete']),
    ],
    'assignments/*': [
      allow.authenticated.to(['read', 'write']),
      allow.authenticated.role('ADMIN').to(['read', 'write', 'delete']),
    ],
    'videos/*': [
      allow.authenticated.to(['read']),
      allow.authenticated.role('ADMIN').to(['read', 'write', 'delete']),
    ],
  }),
});
