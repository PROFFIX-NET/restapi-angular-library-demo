import { Injectable } from '@angular/core';
import { PxConfiguration, PxModule, PxVersion } from '@proffix/restapi-angular-library';

@Injectable()
export class AppConfiguration extends PxConfiguration {
  public get requiredWebserviceVersion(): PxVersion {
    return { Major: 2, Minor: 2, Patch: 0 };
  }
  public get requiredLicencedModules(): PxModule[] {
    return [ PxModule.ZEI, PxModule.ADR, PxModule.STU ];
  }
}
