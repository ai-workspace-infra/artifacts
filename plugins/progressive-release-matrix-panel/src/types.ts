export interface PanelOptions {
  mode: 'all' | 'matrix_only' | 'flagger_only' | 'details_only';
  useMockData: boolean;
  environment: string;
  showKpis: boolean;
  showMatrix: boolean;
  showFlagger: boolean;
  showDetails: boolean;
  showFooter: boolean;
  showRoutesTable?: boolean;
}

export interface EndpointStatus {
  service: string;
  route: string;
  status: 'PASS' | 'FAIL' | 'NO DATA';
  httpCode: number | string;
  latencyMs: number | string;
  freshnessSec?: number;
  expectedHttp: number;
}

export interface FlaggerServiceStatus {
  service: string;
  subdomain: string;
  phase: 'Progressing' | 'Succeeded' | 'Failed' | 'Not configured';
  weight: number | null;
  primaryPercent: number;
  candidatePercent: number;
  message?: string;
}

export interface RouteApiStatus {
  id: string;
  order: number;
  type: 'frontend' | 'api';
  categoryKey?: string;
  categoryName?: string;
  categoryEnName?: string;
  service: string;
  serviceDomain: string;
  path: string;
  description: string;
  method: string;
  expectedHttp: number;
  observedHttp: number;
  latencyMs: number | string;
  freshnessSec?: number;
  status: 'PASS' | 'FAIL';
}
