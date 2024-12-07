import { Component } from "@dolphjs/dolph/decorators";
import { IcpController } from "./icp.controller";
import { IcpService } from "./icp.service";

@Component({ controllers: [IcpController], services: [IcpService] })
export class IcpComponent {}
