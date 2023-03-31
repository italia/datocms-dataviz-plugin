import BasicChart from "./charts/BasicChart";
import PieChart from "./charts/PieChart";
import GeoMapChart from "./charts/GeoMapChart";
import { getPieValues, getBasicValues, getMapValues } from "../lib/utils";
import { useEffect, useState, memo } from "react";

function RenderChart({ ds, config }) {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [config]);

  if (loading) return null;
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

// export default memo(RenderChart);
export default RenderChart;
