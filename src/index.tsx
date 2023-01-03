import {
  connect,
  FieldIntentCtx,
  Field,
  RenderFieldExtensionCtx,
} from 'datocms-plugin-sdk';
import { render } from './utils/render';
import ConfigScreen from './entrypoints/ConfigScreen';
import 'datocms-react-ui/styles.css';
import ChartEditor from './components/ChartEditor';
// import LoremIpsumGenerator from './components/LoremIpsumGenerator';

connect({
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
