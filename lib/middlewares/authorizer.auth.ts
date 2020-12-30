import { Roles, IUser } from '../models/index';
import { UserData, ResourceData, acl } from './access-control-list/helpers.acl';
import { Permissions } from './access-control-list/permissions.acl';

export class Authorizer {
  readonly clientId: string;
  readonly currentUser: IUser;
  readonly userDetails: UserData; // The user details for the ACL

  constructor(currentUser: IUser, clientId: string) {
    this.currentUser = currentUser;
    this.clientId = clientId;
    this.userDetails = new UserData(currentUser, clientId);
  }

  public async isAllowed(resource: any, action: string): Promise<boolean> {
    const resDet: ResourceData<any> = new ResourceData(resource);
    if (!Permissions.exists(resDet.getResourceId(), action)) return false;

    return acl.query(this.userDetails, resDet, action);
  }

  public async assertAllowed(
    resource: any,
    action: string,
    deniedMessage?: string,
  ): Promise<boolean> {
    return this.isAllowed(resource, action).then((allowed: boolean) => {
      return allowed;
    });
  }

  /** * Check whether the user linked to this auth helper has the specified role */
  public hasRole(role: string, resource?: string): boolean {
    return this.userDetails.hasRole(role, resource);
  }

  /** * Check whether the user linked to this auth helper has at least one of the specified roles */
  public hasAnyRoles(roles: Roles[], resource?: string): boolean {
    return this.userDetails.hasAnyRoles(roles, resource);
  }
}

export let authorizer: Authorizer;

export function auth(currentUser: IUser, clientId: string): void {
  authorizer = new Authorizer(currentUser, clientId);
}
