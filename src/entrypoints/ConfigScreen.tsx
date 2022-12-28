import { RenderConfigScreenCtx } from 'datocms-plugin-sdk';
import { Canvas, ContextInspector, SwitchField } from 'datocms-react-ui';
import s from './styles.module.css';

type Props = {
  ctx: RenderConfigScreenCtx;
};

type ValidParameters = { devMode: boolean };
// parameters can be either empty or filled in
type Parameters = ValidParameters;

export default function ConfigScreen({ ctx }: Props) {
  const parameters = ctx.plugin.attributes.parameters as Parameters;
  return (
    <Canvas ctx={ctx}>
      <SwitchField
        id="01"
        name="development"
        label="Enable development mode?"
        hint="Log debug information in console"
        value={parameters.devMode ?? false}
        onChange={(newValue) => {
          ctx.updatePluginParameters({ devMode: newValue });
          ctx.notice('Settings updated successfully!');
        }}
      />

      <div className={s.inspector}>
        <ContextInspector />
      </div>
    </Canvas>
  );
}
