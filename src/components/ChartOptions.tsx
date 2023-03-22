import { Button } from "datocms-react-ui";
import { useForm } from "react-hook-form";
import { palettes, getFields } from "../lib/constants";
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
    formState: { errors, isValid, isDirty, isValidating, isSubmitted },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      palette: defaultPalette,
      h: 500,
      ...config,
    },
  });
  const watchPalette = watch("palette", defaultPalette);

  const onSubmit = (data) => {
    console.log("SUBMIT", data);
    const { h, w, palette, ...rest } = data;
    const colors = palettes[palette];
    console.log(palette, "colors", colors);
    const newConfig = { h: Number(h), w: Number(w), ...rest, colors };
    console.log("newConfig", newConfig);
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
          }}
        >
          {fields
            .filter((field) => field.chartType.includes(chart))
            .map((field) => {
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
                      {...field.otherProps}
                      {...register(field.name, { required: field.required })}
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
                        {...field.otherProps}
                        {...register(field.name, { required: field.required })}
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
                  paddingTop: 10,
                  borderBottom: "1px solid #ccc",
                  gridColumn: "span 3",
                  fontWeight: "bold",
                  fontSize: 24,
                };
                return (
                  <>
                    <div style={style}>{field.name}</div>
                  </>
                );
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
