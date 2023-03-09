import { RenderPageCtx } from "datocms-plugin-sdk";
import { Canvas } from "datocms-react-ui";
import CheckGeo from "./CheckGeo";

type PropTypes = {
  ctx: RenderPageCtx;
};

export default function SamplePage({ ctx }: PropTypes) {
  return (
    <Canvas ctx={ctx}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 20,
          width: "100%",
        }}
      >
        <CheckGeo />
      </div>
    </Canvas>
  );
}
