import BasicChart from "./charts/BasicChart";
import PieChart from "./charts/PieChart";
import GeoMapChart from "./charts/GeoMapChart";
import { getPieValues, getBasicValues, getMapValues } from "../lib/utils";

function RenderChart({ ds }) {
  return (
    <div className="w-full min-height-[800px]">
      {ds && (
        <>
          {(ds.chart === "bar" || ds.chart === "line") && (
            <BasicChart data={getBasicValues(ds)} />
          )}
          {ds.chart === "pie" && <PieChart data={getPieValues(ds)} />}
          {ds.chart === "map" && (
            <GeoMapChart data={getMapValues(ds)} id="sample" />
          )}
        </>
      )}
    </div>
  );
}

export default RenderChart;
