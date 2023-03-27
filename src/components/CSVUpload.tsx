import { useState } from "react";
import Papa from "papaparse";
import DataTable from "./DataTable";
import { Button, SelectField } from "datocms-react-ui";

import { log, transposeData, moveDataColumn } from "../lib/utils";

function UploadCSV({ setData }) {
  const [rawData, setRawData] = useState<any>(null);
  const [category, setCategory] = useState<any>(null);
  const [series, setSeries] = useState<any>([]);

  function uploadFile(event) {
    let file = event.target.files[0];

    Papa.parse(file, {
      header: false,
      skipEmptyLines: true,
      complete: (results) => {
        log("RESULTS DATA", results.data);
        setRawData(results.data);

        const category = results.data[0][0];
        setCategory({ value: category, label: category });
        setSeries(getCols(results.data[0].filter((i) => i != category?.value)));
      },
    });
  }

  function getCols(cols: string[]) {
    return cols.map((col: string) => {
      return { value: col, label: col };
    });
  }

  function transpose() {
    const transposed = transposeData(rawData);
    setRawData(transposed);
    const category = transposed[0][0];
    setCategory({ value: category, label: category });
    setSeries(getCols(transposed[0].filter((i) => i !== category?.value)));
  }

  function filterData() {
    if (!series) return;
    const cols = [category, ...series].map((col) => col.value);
    const filtered = rawData.map((row) => {
      return row.filter((r, i) => {
        return cols.includes(rawData[0][i]);
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
                  (i) => i.value !== category?.value
                ),
              }}
              onChange={(newValue) => setSeries(newValue)}
            />
          )}

          <div>
            {series && category && series.length > 0 && (
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
