// Demo Mode Configuration
// Controls demo scenarios and guided tours

interface DemoConfig {
  enabled: boolean;
  scenarioId: string;
  autoPlay: boolean;
  showTours: boolean;
  dataResetOnReload: boolean;
}

export const demoConfig: DemoConfig = {
  enabled: process.env.NEXT_PUBLIC_DEMO_MODE === 'true',
  scenarioId: process.env.NEXT_PUBLIC_DEMO_SCENARIO || 'manufacturing-basic',
  autoPlay: false,
  showTours: true,
  dataResetOnReload: false,
};

// Check if demo mode is active
export const isDemoMode = () => demoConfig.enabled;

// Get current demo scenario
export const getDemoScenario = () => demoConfig.scenarioId;

// Get API mode (mock or live)
export const getApiMode = () => process.env.NEXT_PUBLIC_API_MODE || 'mock';

// Check if using mock services
export const isMockMode = () => getApiMode() === 'mock';

// Demo scenario definitions
export const demoScenarios = {
  'manufacturing-basic': {
    name: 'Basic Manufacturing',
    description: 'Standard manufacturing company with inventory and work orders',
    companies: 1,
    products: 50,
    warehouses: 2,
    workOrders: 25,
  },
  'multi-warehouse': {
    name: 'Multi-Warehouse Operations',
    description: 'Company with 5 warehouses and transfer operations',
    companies: 1,
    products: 200,
    warehouses: 5,
    workOrders: 100,
  },
  'quality-focus': {
    name: 'Quality-Focused Manufacturing',
    description: 'Emphasis on quality control and compliance',
    companies: 1,
    products: 75,
    warehouses: 2,
    workOrders: 50,
    qualityInspections: 200,
  },
  'enterprise': {
    name: 'Enterprise Multi-Company',
    description: 'Multiple companies with shared resources',
    companies: 3,
    products: 500,
    warehouses: 10,
    workOrders: 300,
  },
} as const;

export type DemoScenarioId = keyof typeof demoScenarios;
