import { Button } from "datocms-react-ui";
import { useForm } from "react-hook-form";
import { palettes, getFields, defaultConfig } from "../lib/constants";
import { getAvailablePalettes, getMapPalettes } from "../lib/utils";
import ShowPalette from "./ShowPalette";
import { log } from "../lib/utils";

function ChartOptions({ config, setConfig, chart, numSeries }) {
  const availabelPalettes =
    chart === "map" ? getMapPalettes() : getAvailablePalettes(numSeries);
  const defaultPalette = availabelPalettes[0];
  const fields = getFields(availabelPalettes, defaultPalette);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, isDirty, isValidating, isSubmitted },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      ...defaultConfig,
      palette: defaultPalette,
      ...config,
    },
  });
  const watchPalette = watch("palette", defaultPalette);

  const onSubmit = (data) => {
    log("SUBMIT", data);
    const { h, w, palette, ...rest } = data;
    const colors = palettes[palette];
    log(palette, "colors", colors);
    const newConfig = { h: Number(h), w: Number(w), ...rest, colors };
    log("newConfig", newConfig);
    setConfig(newConfig);
  };
  if (!chart) {
    return <div className="my-5">Please choose a chart type</div>;
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
          {fields
            .filter((field) => field.chartType.includes(chart))
            .map((field) => {
              if (["text", "email", "number", "color"].includes(field.type)) {
                let style = {};
                if (field.layout) {
                  style = { gridColumn: `span ${field.layout}` };
                }
                return (
                  <div key={field.name} style={style}>
                    <label>{field.label}</label>
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
                      <ShowPalette palette={palettes[watchPalette]} />
                    )}
                  </div>
                );
              } else {
                let style = {
                  marginTop: 10,
                  // borderBottom: "1px solid #fafafa",
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
