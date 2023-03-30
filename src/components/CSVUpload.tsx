import { useState, useTransition } from "react";
import Papa from "papaparse";
import DataTable from "./DataTable";
import { Button, SelectField } from "datocms-react-ui";

import { log, transposeData, moveDataColumn } from "../lib/utils";

type selectOptionType = {
  value: string;
  label: string;
};

function UploadCSV({ setData }) {
  const [_, startTransition] = useTransition();
  const [rawData, setRawData] = useState<any>(null);
  const [category, setCategory] = useState<selectOptionType | null>(null);
  const [series, setSeries] = useState<selectOptionType[] | []>([]);

  function uploadFile(event) {
    let file = event.target.files[0];

    Papa.parse(file, {
      header: false,
      skipEmptyLines: true,
      complete: (results) => {
        const { data } = results;
        log("RESULTS DATA", data);
        const c = getFirstOfMAtrix(data);
        const category = { value: c, label: c };
        log("CATEGORY", category);
        const cols = getCols(data[0]);
        log("COLS", cols);
        const series = cols.filter((i) => !isSameObject(i, category));
        log("SERIES", series);

        startTransition(() => {
          setRawData(data);
          setCategory(category);
          setSeries(series);
        });
      },
    });
  }

  function isSameObject(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
  }
  function getFirstOfMAtrix(matrix) {
    return matrix[0][0]?.trim();
  }
  function getCols(cols: string[]) {
    return cols.map((c: string) => {
      const col = c.trim();
      return { value: col, label: col };
    });
  }

  function transpose() {
    const transposed = transposeData(rawData);
    setRawData(transposed);
    const c = getFirstOfMAtrix(transposed);
    const category = { value: c, label: c };
    setCategory(category);
    setSeries(getCols(transposed[0]).filter((i) => !isSameObject(i, category)));
  }

  function filterData() {
    if (!series) return;
    const cols = [category, ...series].map((col) => col.value);
    const filtered = rawData.map((row) => {
      return row.filter((r, i) => {
        return cols.includes(rawData[0][i].trim());
      });
    });
    return filtered;
  }

  function handleChangeCategory(newValue: any) {
    setSeries([]);
    setCategory(newValue);
    setRawData(moveDataColumn(rawData, newValue.value));
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "start",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <label style={{ width: "200px" }}>Upload a csv:</label>
      <input
        className="input"
        type="file"
        name="file"
        accept=".csv"
        onChange={(e) => uploadFile(e)}
      />

      {rawData && (
        <div>
          <DataTable
            data={rawData}
            transpose={() => transpose()}
            reset={() => setRawData(null)}
          />
          <SelectField
            name="category"
            id="category"
            label="category"
            hint="Select one of the options"
            value={category}
            selectInputProps={{
              options: getCols(rawData[0]),
            }}
            onChange={(newValue) => handleChangeCategory(newValue)}
          />
          {category && (
            <SelectField
              name="series"
              id="series"
              label="series"
              hint="Select some of the options"
              value={series}
              selectInputProps={{
                isMulti: true,
                options: getCols(rawData[0]).filter(
                  (i) => !isSameObject(i, category)
                ),
              }}
              onChange={(newValue: selectOptionType[]) => setSeries(newValue)}
            />
          )}

          <div>
            {series && category?.value && series.length > 0 && (
              <Button
                onClick={() => {
                  setData(filterData());
                }}
              >
                Save Data
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default UploadCSV;
