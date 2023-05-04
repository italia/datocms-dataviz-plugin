import { Button } from "datocms-react-ui";
import { useForm } from "react-hook-form";
import { palettes, getFields, defaultConfig } from "../lib/constants";
import { getAvailablePalettes, getMapPalettes } from "../lib/utils";
import ShowPalette from "./ShowPalette";

function ChartOptions({ config, setConfig, chart, numSeries }) {
  const availabelPalettes =
    chart === "map" ? getMapPalettes() : getAvailablePalettes(numSeries);
  const defaultPalette = availabelPalettes[0];
  const fields = getFields(availabelPalettes, defaultPalette);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      ...defaultConfig,
      palette: defaultPalette,
      ...config,
    },
  });
  const watchPalette = watch("palette", config?.palette || defaultPalette);
  const watchDirection = watch("direction", null);
  const watchToltip = watch("tooltip", true);
  const watchLegend = watch("legend", true);
  const watchShowPieLabels = watch("showPieLabels", true);

  const onSubmit = (data) => {
    const { h, w, palette, ...rest } = data;
    const colors = palettes[palette];
    const newConfig = { h: Number(h), w: Number(w), ...rest, colors, palette };
    setConfig(newConfig);
  };
  if (!chart) {
    return <div className="my-5">Please choose a chart type</div>;
  }

  let filteredFields = fields.filter((field) =>
    field.chartType.includes(chart)
  );
  if (!watchToltip) {
    filteredFields = filteredFields.filter(
      (field) => field.dependsOn !== "tooltip"
    );
  }
  if (!watchLegend) {
    filteredFields = filteredFields.filter(
      (field) => field.dependsOn !== "legend"
    );
  }
  if (!watchShowPieLabels) {
    filteredFields = filteredFields.filter(
      (field) => field.dependsOn !== "showPieLabels"
    );
  }
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gridGap: 10,
            fontSize: 14,
          }}
        >
          {filteredFields.map((field) => {
            if (["text", "email", "number", "color"].includes(field.type)) {
              let style = {};
              if (field.layout) {
                style = { gridColumn: `span ${field.layout}` };
              }
              let label = field.label;
              if (
                (field.name === "xLabel" || field.name === "yLabel") &&
                watchDirection === "horizontal"
              ) {
                label =
                  field.name === "xLabel"
                    ? field.label.replace("X", "Y")
                    : field.label.replace("Y", "X");
              }
              return (
                <div key={field.name} style={style}>
                  <label>{label}</label>
                  <input
                    type={field.type}
                    {...field.otherProps}
                    {...register(field.name, { required: field.required })}
                  />
                  {errors[field.name] && <span>This field is required</span>}
                </div>
              );
            } else if (["checkbox"].includes(field.type)) {
              let style = {};
              if (field.layout) {
                style = { gridColumn: `span ${field.layout}` };
              }
              return (
                <div key={field.name} style={style}>
                  <label>{field.label}</label>
                  <div>
                    <input
                      type="checkbox"
                      {...field.otherProps}
                      {...register(field.name, { required: field.required })}
                    />
                  </div>
                  {errors[field.name] && <span>This field is required</span>}
                </div>
              );
            } else if (["select"].includes(field.type)) {
              let style = {};
              if (field.layout) {
                style = { gridColumn: `span ${field.layout}` };
              }
              return (
                <div key={field.name} style={style}>
                  <div>{field.label}</div>
                  <select
                    className="my-2 p-2"
                    style={{ width: "80%" }}
                    {...field.otherProps}
                    {...register(field.name, { required: field.required })}
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
                  {field.name === "palette" && watchPalette && (
                    <>
                      <ShowPalette palette={palettes[watchPalette]} />
                    </>
                  )}
                </div>
              );
            } else {
              let style = {
                marginTop: 10,
                gridColumn: "span 3",
                fontWeight: "bold",
                fontSize: 16,
              };
              return (
                <>
                  <div style={style}>
                    <span
                      style={{
                        padding: 5,
                        backgroundColor: "#eee",
                        borderRadius: 5,
                      }}
                    >
                      {field.name}
                    </span>
                  </div>
                </>
              );
            }
          })}
        </div>
        <div className="mt-5">
          <Button fullWidth type="submit" buttonType="muted">
            Applica
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ChartOptions;
