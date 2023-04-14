import BasicChart from "./charts/BasicChart";
import PieChart from "./charts/PieChart";
import GeoMapChart from "./charts/GeoMapChart";
import { getPieValues, getBasicValues, getMapValues } from "../lib/utils";
import { useEffect, useState, useRef } from "react";

function RenderChart({ ds, config }) {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [config]);

  const wrapRef = useRef(null);
  const [width, setWidth] = useState(null);
  const isMobile = width && width <= 480;

  function setDimension() {
    setWidth(wrapRef?.current?.clientWidth);
  }

  useEffect(() => {
    window.addEventListener("resize", setDimension);
    setDimension();
    return () => {
      window.removeEventListener("resize", setDimension);
    };
  }, []);

  if (loading) return null;
  return (
    <div className="w-full min-height-[800px]">
      <div ref={wrapRef}>
        {ds && (
          <>
            {(ds.chart === "bar" || ds.chart === "line") && (
              <BasicChart data={getBasicValues(ds)} isMobile={isMobile} />
            )}
            {ds.chart === "pie" && (
              <PieChart data={getPieValues(ds)} isMobile={isMobile} />
            )}
            {ds.chart === "map" && (
              <GeoMapChart
                data={getMapValues(ds)}
                id="sample"
                isMobile={isMobile}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default RenderChart;
