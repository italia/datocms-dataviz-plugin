function SelectChart({ chart, setChart }) {
  return (
    <div>
      <select value={chart} onChange={(e) => setChart(e.target.value)}>
        <option value={''}>{`-select an option-`}</option>
        <option value="bar">Bar</option>
        <option value="line">Line</option>
        <option value="pie">Pie</option>
      </select>
    </div>
  );
}

export default SelectChart;
