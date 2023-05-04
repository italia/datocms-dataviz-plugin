import Papa from "papaparse";

function UploadCSVSimple({ setData }) {
  function uploadFile(event) {
    let file = event.target.files[0];

    Papa.parse(file, {
      header: false,
      skipEmptyLines: true,
      complete: (results) => {
        const { data } = results;
        const c = getFirstOfMAtrix(data);
        const category = { value: c, label: c };
        const cols = getCols(data[0]);
        const series = cols.filter((i) => !isSameObject(i, category));

        setData(data);
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

  return (
    <div>
      <label style={{ width: "200px" }}>Carica CSV:</label>
      <input
        className="input"
        type="file"
        name="file"
        accept=".csv"
        onChange={(e) => uploadFile(e)}
      />
    </div>
  );
}

export default UploadCSVSimple;
