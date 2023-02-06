import {
  connect,
  FieldIntentCtx,
  IntentCtx,
  Field,
  RenderFieldExtensionCtx,
  RenderItemFormOutletCtx,
  ItemType,
} from 'datocms-plugin-sdk';
import { render } from './utils/render';
import ConfigScreen from './entrypoints/ConfigScreen';
import 'datocms-react-ui/styles.css';
import ChartEditor from './components/ChartEditor';
import { Canvas } from 'datocms-react-ui';
// import LoremIpsumGenerator from './components/LoremIpsumGenerator';

connect({
  itemFormOutlets(itemType: ItemType, ctx: IntentCtx) {
    // if (itemType.attributes.api_key !== 'kpi_element') {return [];}
    return [
      {
        id: 'myOutlet',
        initialHeight: 100,
      },
    ];
  },
  renderItemFormOutlet(outletId: string, ctx: RenderItemFormOutletCtx) {
    return render(<Canvas ctx={ctx}>Hello from the outlet!</Canvas>);
  },
  renderConfigScreen(ctx) {
    return render(<ConfigScreen ctx={ctx} />);
  },
  overrideFieldExtensions(field: Field, ctx: FieldIntentCtx) {
    if (
      field.attributes.field_type === 'json' &&
      field.attributes.api_key === 'chart_data'
    ) {
      return {
        editor: { id: 'chartEditor' },
      };
      // } else if (
      //   field.attributes.field_type === 'string' &&
      //   field.attributes.api_key === 'title'
      // ) {
      //   return {
      //     addons: [{ id: 'loremIpsumGenerator' }],
      //   };
    }
  },
  renderFieldExtension(fieldExtensionId: string, ctx: RenderFieldExtensionCtx) {
    switch (fieldExtensionId) {
      case 'chartEditor':
        return render(<ChartEditor ctx={ctx} />);
      // case 'loremIpsumGenerator':
      //   return render(<LoremIpsumGenerator ctx={ctx} />);
    }
  },
});
