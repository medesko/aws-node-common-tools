export enum Resources {
  AUTH = 'auth',
  USER = 'user',
  ORDER = 'order',
}

/**
 * This interface can be used as a resource and is recognized by the ResourceDetail class
 * This allow to check directly a permission on a specific resource if we already know its uuid
 * This can be used as a shortcut in some cases, for example when the uuid is available from the http request parameters
 * without having to retrieve the object from the database beforhand
 */
export interface TargetResource {
  resource: Resources;
  uuid: string;
}
