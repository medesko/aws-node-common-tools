import { Acl, IResource, IRole, IRoleGetter, IResourceGetter } from 'virgen-acl';
import { Permissions, Resources, TargetResource } from './permissions.acl';
import { Roles, IUser, IappScopedData } from '../../models/index';

const isOfType = <T>(obj: any, ...properties: (keyof T)[]): obj is T =>
  properties.every(prop => (obj as T)[prop] !== undefined);

const isUser = (u: any): u is IUser => isOfType<IUser>(u, 'userId', 'email');

const isTargetResource = (e: any): e is TargetResource =>
  isOfType<TargetResource>(e, 'uuid', 'resource');

export class AclPromise extends Acl {
  public query(role: IRole | Array<IRole>, resource: IResource, action: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      super.query(role, resource, action, (err, allowed) => {
        if (err) return reject(err);

        return resolve(<boolean>allowed);
      });
    });
  }
}

export const acl = new AclPromise();

const assertOwnUser = (err, role, resource, action, result, next) => {
  if (!(role instanceof UserData) || !(resource instanceof ResourceData)) return next();
  const uuid: string | undefined = (resource as ResourceData<any>).getUuid();
  if (!uuid) return next(); // no uuid, we can't check
  result(null, uuid === role.currentUser.userId);
};

// Initialize the ACLs and create the rules
(() => {
  // Init roles
  acl.addRole(Roles.ADMIN);
  acl.addRole(Roles.ACCOUNT_MANAGER);
  acl.addRole(Roles.PROVIDER_RESPONSIBLE);
  acl.addRole(Roles.CUSTOMER_RESPONSIBLE);
  acl.addRole(Roles.CONTRACTOR);

  // init resources
  acl.addResource(Resources.AUTH);
  acl.addResource(Resources.USER);
  acl.addResource(Resources.ORDER);

  acl.deny();

  // Account managers permissions
  acl.allow(Roles.ACCOUNT_MANAGER, Resources.AUTH, Permissions.ALL_AUTH());
  acl.allow(Roles.ACCOUNT_MANAGER, Resources.USER, Permissions.ALL_USER());
  acl.allow(Roles.ACCOUNT_MANAGER, Resources.ORDER, Permissions.ALL_ORDER());

  // Can read order if it's a order from its own establishment
  acl.allow(Roles.PROVIDER_RESPONSIBLE, Resources.ORDER, Permissions.ALL_ORDER());

  // CONTRACTOR Can read order data
  acl.allow(Roles.CONTRACTOR, Resources.ORDER, Permissions.ALL_ORDER(), assertOwnUser);

  // admin are allowed to do everything
  acl.allow(Roles.ADMIN);
})();

export class UserData implements IRoleGetter {
  readonly currentUser: IUser;
  readonly appScopedData: IappScopedData;
  readonly cliendId: string;
  roles: Roles[];

  constructor(curentUser: IUser, cliendId: string) {
    this.currentUser = curentUser;
    this.cliendId = cliendId;

    this.appScopedData = this.currentUser.appScopedData[this.cliendId];

    if (this.appScopedData.roles)
      this.roles = this.appScopedData.roles
        .map(role => role.name)
        .reduce((acc: any[], cur: Roles) => {
          if (!acc.includes(cur)) acc.push(cur);

          return acc;
        }, []);
    else this.roles = [];
  }

  public hasRole(role: string, resource?: string): boolean {
    return (
      this.appScopedData.roles?.find(
        r => r.name === role && (!resource || (resource && r.resource === resource)),
      ) !== undefined
    );
  }

  public hasAnyRoles(roles: string[], resource?: string): boolean {
    for (const role of roles) {
      if (this.hasRole(role, resource)) {
        return true;
      }
    }

    return false;
  }

  public getRoleId(): string | string[] {
    return this.roles;
  }
}

export class ResourceData<T> implements IResourceGetter {
  readonly resource: T;

  constructor(resource: T) {
    this.resource = resource;
  }

  public getUuid(): string | undefined {
    if (isUser(this.resource)) return this.resource.userId;
    if (isTargetResource(this.resource)) return this.resource.uuid;

    return undefined;
  }

  public getResourceId(): string {
    if (typeof this.resource === 'string') return this.resource;
    if (isUser(this.resource)) return Resources.USER;
    if (isTargetResource(this.resource)) return this.resource.resource;

    // We don't know what the resource is
    return '';
  }
}
