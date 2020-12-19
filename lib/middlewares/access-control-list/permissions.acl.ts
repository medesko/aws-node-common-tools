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
