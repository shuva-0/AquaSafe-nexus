import type { DomainConfig, DomainScenarios, DomainType } from '@/types';
import { waterConfig, waterScenarios } from './water';
import { infrastructureConfig, infrastructureScenarios } from './infrastructure';
import { environmentConfig, environmentScenarios } from './environment';

export const domainConfigs: Record<DomainType, DomainConfig> = {
  water: waterConfig,
  infrastructure: infrastructureConfig,
  environment: environmentConfig,
};

export const domainScenarios: Record<DomainType, DomainScenarios> = {
  water: waterScenarios,
  infrastructure: infrastructureScenarios,
  environment: environmentScenarios,
};

export const domainList: DomainType[] = ['water', 'infrastructure', 'environment'];

export { waterConfig, infrastructureConfig, environmentConfig };
export { waterScenarios, infrastructureScenarios, environmentScenarios };
