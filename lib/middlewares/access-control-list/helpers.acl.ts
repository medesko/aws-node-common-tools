import { Acl, IResource, IRole } from 'virgen-acl';
import { Permissions } from './permissions.acl';
import { Resources } from './resources.acl';
import { Roles } from '../../models/index';

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

  // define permissions
  // The ACL rules are resolved in Last In First Out order, so if you have custom assertions that can stop the chain
  // you should make sure that the "higher" roles are declared AFTER those with more restrictions
  acl.deny();

  // Account managers permissions
  acl.allow(Roles.ACCOUNT_MANAGER, Resources.AUTH, Permissions.ALL_AUTH());
  acl.allow(Roles.ACCOUNT_MANAGER, Resources.USER, Permissions.ALL_USER());
  acl.allow(Roles.ACCOUNT_MANAGER, Resources.ORDER, Permissions.ALL_ORDER());

  // admin are allowed to do everything
  acl.allow(Roles.ADMIN);
})();
