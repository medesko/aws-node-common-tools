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

export class Permissions {
  public static readonly AUTH = {};

  public static readonly USER = {
    READ: 'READ',
    UPDATE: 'UPDATE',
  };

  public static readonly ORDER = {
    CREATE: 'CREATE',
    READ: 'READ',
    UPDATE: 'UPDATE',
    DELETE: 'DELETE',
  };

  public static readonly ALL_AUTH = (): string[] => Object.values(Permissions.AUTH);

  public static readonly ALL_USER = (): string[] => Object.values(Permissions.USER);

  public static readonly ALL_ORDER = (): string[] => Object.values(Permissions.ORDER);

  public static readonly exists = (resource: string, action: string): boolean => {
    const res: string = resource.toUpperCase();

    return Permissions[res] !== undefined && Object.values(Permissions[res]).includes(action);
  };
}
