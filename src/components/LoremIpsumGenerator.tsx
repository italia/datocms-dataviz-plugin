import { RenderFieldExtensionCtx } from 'datocms-plugin-sdk';
import { Canvas, Button } from 'datocms-react-ui';
import { loremIpsum } from 'lorem-ipsum';
type PropTypes = {
  ctx: RenderFieldExtensionCtx;
};
export default function LoremIpsumGenerator({ ctx }: PropTypes) {
  const insertLoremIpsum = () => {
    ctx.setFieldValue(ctx.fieldPath, loremIpsum({ format: 'plain' }));
  };
  return (
    <Canvas ctx={ctx}>
      <p>{ctx.fieldPath}</p>
      <Button type="button" onClick={insertLoremIpsum} buttonSize="xxs">
        Add lorem ipsum
      </Button>
    </Canvas>
  );
}
