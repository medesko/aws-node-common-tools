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
  LOCKED = 'LOCKED',
}

export const AllUserStates: UserState[] = [
  UserState.ACTIVATING,
  UserState.ACTIVE,
  UserState.DISABLING,
  UserState.DISABLED,
  UserState.LOCKED,
];

// Roles:
// ADMIN: Tech Department, we, us
// ACCOUNT_MANAGER: Acount manager, regular FCOM User
// CUSTOMER_RESPONSIBLE: External customers manager
// PROVIDER_RESPONSIBLE: External provider manager
// CONTRACTOR: External contractor
export enum Roles {
  ADMIN = 'ADMIN',
  ACCOUNT_MANAGER = 'ACCOUNT_MANAGER',
  CUSTOMER_RESPONSIBLE = 'CUSTOMER_RESPONSIBLE',
  PROVIDER_RESPONSIBLE = 'PROVIDER_RESPONSIBLE',
  CONTRACTOR = 'CONTRACTOR',
}

export const AllUserRoles: Roles[] = [
  Roles.ADMIN,
  Roles.ACCOUNT_MANAGER,
  Roles.CUSTOMER_RESPONSIBLE,
  Roles.PROVIDER_RESPONSIBLE,
  Roles.CONTRACTOR,
];

// Civility:
// MR: Man
// MS: Woman
// NOT_SPECIFIED: Not specified
export enum Civility {
  MR = 0,
  MS = 1,
  NOT_SPECIFIED = 3,
}
