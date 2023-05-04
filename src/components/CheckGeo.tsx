import { useEffect, useState } from "react";
import * as echarts from "echarts";
import ReactEcharts from "echarts-for-react";
import { useForm } from "react-hook-form";
import { Button } from "datocms-react-ui";

import DataTable from "./DataTable";
import { transposeData } from "../lib/utils";
import UploadCSV from "./UploadCSVSimple";

function PreviewGeoMapChart({ url, series, nameProperty }) {
  const [data, setData] = useState(null);

  async function getGeoData() {
    if (url) {
      const response = await fetch(url);
      const raw: any = await response.json();
      setData(raw);
    }
  }

  useEffect(() => {
    getGeoData();
  }, []);

  function getOptions(id, data) {
    echarts.registerMap(id, data);
    const options = {
      series: series.map(({ data }) => {
        return {
          type: "map",
          data,
          map: id,
          nameProperty,
        };
      }),
    };
    return options;
  }
  if (!data) return <div>In attesa dei dati geo...</div>;
  return (
    <div
      style={{
        textAlign: "left",
        border: "1px solid lightgray",
        width: 500,
        height: 500,
        maxWidth: "100%",
      }}
    >
      <ReactEcharts
        option={getOptions(url, data)}
        style={{
          width: 500,
          height: 500,
          maxWidth: "100%",
        }}
      />
    </div>
  );
}

export default function CheckGeo() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [geoProps, setGeoProps] = useState(null);
  const [geoUrl, setGeoUrl] = useState(null);
  const [data, setData] = useState(null);
  const [propertyName, setPropertyName] = useState(null);
  const [loading, setLoading] = useState(false);

  async function getData(url) {
    if (url) {
      const response = await fetch(url);
      const raw: any = await response.json();
      const data = raw.features.slice(0, 20).map((feat, index) => {
        const { properties } = feat;
        if (index === 0) {
          return Object.keys(properties);
        } else {
          return Object.values(properties);
        }
      });
      setGeoProps(data);
    }
  }

  const onSubmit = async (data) => {
    setGeoUrl(data.geoJsonUrl);
    await getData(data.geoJsonUrl);
  };

  function matrixToObjects(matrix) {
    if (!matrix) return;
    const [headers, ...rows] = matrix;
    return rows.map((row) => {
      return row.reduce((acc, value, index) => {
        acc[headers[index]] = value;
        return acc;
      }, {});
    });
  }

  function numMatches(rows1, rows2) {
    return rows1.filter((r1) => rows2.includes(r1));
  }

  function compareTableObjs(tableObj1, tableObj2) {
    const keys1 = Object.keys(tableObj1[0]);
    const keys2 = Object.keys(tableObj2[0]);

    const result = keys1.reduce((res, key) => {
      const col1 = tableObj1.map((o) => o[key]);
      const matches = keys2
        .reduce((all, key) => {
          const col2 = tableObj2.map((o) => o[key]);
          const matches = numMatches(col1, col2);
          if (matches?.length > 0) {
            all = [...all, { name: key, numMatches: matches.length }];
          }
          return all;
        }, [])
        .filter((item) => item.numMatches > 0);

      if (matches.length > 0) {
        res = [
          ...res,
          { key, matches: matches.filter((item) => item.numMatches > 0) },
        ];
      }

      return res;
    }, []);

    return result;
  }

  let columnMatches = [];

  if (data && geoProps) {
    columnMatches = compareTableObjs(
      matrixToObjects(data),
      matrixToObjects(geoProps)
    );
  }

  return (
    <div>
      {loading && <div>Loading...</div>}

      <div style={{ display: "flex" }}>
        {geoProps && (
          <div>
            <DataTable
              data={geoProps}
              reset={undefined}
              transpose={undefined}
            />
          </div>
        )}
        {geoUrl && geoProps && (
          <div style={{ marginLeft: 20 }}>
            <p>
              <select
                onChange={(e) => setPropertyName(e.target.value)}
                defaultValue={propertyName || geoProps[0][0]}
                value={propertyName}
              >
                {geoProps[0].map((prop) => (
                  <option key={prop} value={prop}>
                    {prop}
                  </option>
                ))}
              </select>
            </p>
            <PreviewGeoMapChart
              url={geoUrl}
              series={matrixToObjects(geoProps)}
              nameProperty={propertyName || geoProps[0][0]}
            />
          </div>
        )}
      </div>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              border: "1px solid lightgray",
            }}
          >
            <div
              key="geoJsonUrl"
              style={{ fontSize: 14, padding: 4, margin: 4 }}
            >
              <label>GeoJson URL</label>
              <input
                style={{ minWidth: 250 }}
                type={"text"}
                {...register("geoJsonUrl", { required: true })}
              />
              {errors["geoJsonUrl"] && <span>This field is required</span>}
            </div>
            <div className="ml-5">
              <Button buttonSize="xxs" type="submit">
                Load Geo Json
              </Button>
            </div>
          </div>
        </form>
      </div>
      <div
        style={{
          marginTop: 20,
          marginBottom: 10,
          border: "1px solid lightgray",
          padding: 10,
        }}
      >
        <UploadCSV setData={(d) => setData(d)} />
      </div>
      <div style={{ display: "flex" }}>
        {data && (
          <div>
            <DataTable
              data={data}
              reset={() => setData(null)}
              transpose={() => setData((d) => transposeData(d))}
            />
          </div>
        )}
        <div style={{ padding: 20 }}>
          {columnMatches.length > 0 && (
            <>
              <h4>Data Matching Column</h4>
              {columnMatches.map(({ key, matches }) => (
                <>
                  <h3>{key}</h3>
                  <div key={key + "_matches"}>
                    {matches.map(({ name, numMatches }) => (
                      <Button
                        buttonType="muted"
                        buttonSize="xxs"
                        key={key + "_" + name}
                        onClick={() => setPropertyName(name)}
                      >
                        ({numMatches}){" matches with " + name + " property"}
                      </Button>
                    ))}
                  </div>
                </>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
