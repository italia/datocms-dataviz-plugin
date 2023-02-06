function SelectChart({ chart, setChart }) {
  return (
    <div className="w-full my-10">
      <select
        value={chart}
        onChange={(e) => setChart(e.target.value)}
        className="py-4 rounded-md ring-2 ring-blue-400 ring-opacity-75  focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
      >
        <option value={''}>{`-select an option-`}</option>
        <option value="bar">Bar</option>
        <option value="line">Line</option>
        <option value="pie">Pie</option>
      </select>
    </div>
  );
}

export default SelectChart;
