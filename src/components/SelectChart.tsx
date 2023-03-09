function SelectChart({ chart, setChart }) {
  return (
    <div
      style={{ display: "flex", justifyContent: "start", alignItems: "center" }}
    >
      <label style={{ width: "200px" }}>Select a chart type:</label>
      <select value={chart} onChange={(e) => setChart(e.target.value || "")}>
        <option value="">{`-select an option-`}</option>
        <option value="bar">Bar</option>
        <option value="line">Line</option>
        <option value="pie">Pie</option>
        <option value="map">GeoMap</option>
      </select>
    </div>
  );
}

export default SelectChart;
