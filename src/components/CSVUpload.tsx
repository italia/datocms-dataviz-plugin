import Papa from "papaparse";

function UploadCSV({ setData }) {
  function uploadFile(event) {
    let file = event.target.files[0];

    Papa.parse(file, {
      header: false,
      skipEmptyLines: true,
      complete: (results) => {
        console.log("RESULTS DATA", results.data);
        setData(results.data);
      },
    });
  }

  return (
    <div
      style={{ display: "flex", justifyContent: "start", alignItems: "center" }}
    >
      <label style={{ width: "200px" }}>Upload a csv:</label>
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

export default UploadCSV;
