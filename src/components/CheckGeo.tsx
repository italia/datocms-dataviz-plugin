import { Canvas, Button } from "datocms-react-ui";
import { useForm } from "react-hook-form";
import { useState } from "react";
import DataTable from "./DataTable";

function ChartOptions() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [geoData, setGeoData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fields = [
    {
      label: "GeoJson URL",
      name: "geoJsonUrl",
      type: "text",
      options: [],
      required: true,
      chartType: ["map"],
      otherProps: {
        defaultValue:
          "https://www.datocms-assets.com/88680/1678208188-europe-geojson.json",
      },
      layout: "single",
    },
  ];

  async function getData(url) {
    if (url) {
      const response = await fetch(url);
      console.log("response", response.status);
      const raw: any = await response.json();
      console.log("length", raw.features.length);

      const data = raw.features.slice(0, 20).map((feat, index) => {
        const { properties } = feat;
        if (index === 0) {
          return Object.keys(properties);
        } else {
          return Object.values(properties);
        }
      });
      console.log(data);
      setGeoData(data);
    }
  }

  const onSubmit = async (data) => {
    console.log(data);
    await getData(data.geoJsonUrl);
  };

  return (
    <div>
      {loading && <div>Loading...</div>}
      {geoData && (
        <DataTable data={geoData} reset={undefined} transpose={undefined} />
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gridGap: 10,
          }}
        >
          {fields.map((field) => {
            if (["text", "email", "number"].includes(field.type)) {
              let style = {};
              if (field.layout === "single") {
                style = { gridColumn: "span 3" };
              }
              return (
                <div key={field.name} style={style}>
                  <label>{field.label}</label>
                  <input
                    type={field.type}
                    {...register(field.name, { required: field.required })}
                    {...field.otherProps}
                  />
                  {errors[field.name] && <span>This field is required</span>}
                </div>
              );
            } else if (["checkbox"].includes(field.type)) {
              let style = {};
              if (field.layout === "single") {
                style = { gridColumn: "span 3" };
              }
              return (
                <div key={field.name} style={style}>
                  <label>{field.label}</label>
                  <div>
                    <input
                      type="checkbox"
                      {...register(field.name, { required: field.required })}
                      {...field.otherProps}
                    />
                  </div>
                  {errors[field.name] && <span>This field is required</span>}
                </div>
              );
            } else if (["select"].includes(field.type)) {
              let style = {};
              if (field.layout === "single") {
                style = { gridColumn: "span 3" };
              }
              return (
                <div key={field.name} style={style}>
                  <div>{field.label}</div>
                  <select
                    className="my-2 p-2"
                    style={{ width: "80%" }}
                    {...register(field.name, { required: field.required })}
                    {...field.otherProps}
                  >
                    {field.options.map((option) => {
                      return (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      );
                    })}
                  </select>
                  {errors[field.name] && <span>This field is required</span>}
                </div>
              );
            } else {
              let style = {};
              if (field.layout === "single") {
                style = { gridColumn: "span 3" };
              }
              return <div style={style}>{field.name}</div>;
            }
          })}
        </div>
        <div className="mt-5">
          <Button fullWidth type="submit">
            Applica
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ChartOptions;
