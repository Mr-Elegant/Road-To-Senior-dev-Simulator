import { dataAndCapacityIncidents } from './dataAndCapacity';
import { deliveryAndSecurityIncidents } from './deliveryAndSecurity';

export const evolvingIncidents = [...dataAndCapacityIncidents, ...deliveryAndSecurityIncidents];
