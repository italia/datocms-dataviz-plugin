import { RenderConfigScreenCtx } from "datocms-plugin-sdk";
import { Canvas } from "datocms-react-ui";

type Props = {
  ctx: RenderConfigScreenCtx;
};

export default function ConfigScreen({ ctx }: Props) {
  return (
    <Canvas ctx={ctx}>
      <div></div>
    </Canvas>
  );
}
