import { PanelPlugin } from '@grafana/data';
import { PanelOptions } from './types';
import { ProgressiveReleasePanel } from './ProgressiveReleasePanel';

export const plugin = new PanelPlugin<PanelOptions>(ProgressiveReleasePanel)
  .setPanelOptions((builder) => {
    builder
      .addRadio({
        path: 'mode',
        name: 'Display Mode',
        description: 'Choose which sections of the design to display',
        defaultValue: 'all',
        settings: {
          options: [
            { value: 'all', label: 'Full Dashboard View' },
            { value: 'matrix_only', label: 'Matrix Only' },
            { value: 'flagger_only', label: 'Flagger Only' },
            { value: 'details_only', label: 'Details Table Only' },
          ],
        },
      })
      .addBooleanSwitch({
        path: 'useMockData',
        name: 'Force Design Mock Data',
        description: 'Render the exact sample dataset from the design prototype',
        defaultValue: false,
      })
      .addTextInput({
        path: 'environment',
        name: 'Environment Label',
        description: 'Default environment label (PROD, SIT, etc.)',
        defaultValue: 'PROD',
      })
      .addBooleanSwitch({
        path: 'showKpis',
        name: 'Show Top KPI Cards',
        defaultValue: true,
      })
      .addBooleanSwitch({
        path: 'showMatrix',
        name: 'Show Service × Endpoint Matrix',
        defaultValue: true,
      })
      .addBooleanSwitch({
        path: 'showFlagger',
        name: 'Show Flagger Section',
        defaultValue: true,
      })
      .addBooleanSwitch({
        path: 'showDetails',
        name: 'Show Top 10 Endpoint Details',
        defaultValue: true,
      })
      .addBooleanSwitch({
        path: 'showFooter',
        name: 'Show Gate Rule & Candidate Samples',
        defaultValue: true,
      });
  });
