// States:
// ACTIVATING: waiting for the user to activate his account via email
// ACTIVE: activated via email
// DISABLING: waiting for the administrator to disable his account
// DISABLED: disabled by an administrator
// LOCKED: too many bad logins, locked for a moment
export enum UserState {
  ACTIVATING = 'ACTIVATING',
  ACTIVE = 'ACTIVE',
  DISABLING = 'DISABLING',
  DISABLED = 'DISABLED',
  LOCKED = 'LOCKED'
}

export const AllUserStates: UserState[] = [
  UserState.ACTIVATING,
  UserState.ACTIVE,
  UserState.DISABLING,
  UserState.DISABLED,
  UserState.LOCKED
];
