/**
 * User profile feature — public API.
 * Maps to the "/profile" page.
 */

export { UserProfilePage, ProfileCard, ProfileField } from './components';
export { useUserProfile } from './hooks';
export { fetchUserProfile } from './services';
export type { UserProfile, UserProfilePageProps, UserProfileState } from './types';
