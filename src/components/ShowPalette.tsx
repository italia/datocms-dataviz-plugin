export default function ShowPalette({ palette }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", margin: "10px 0" }}>
      {palette.map((p, i) => (
        <div
          key={i}
          style={{
            width: 8,
            height: 8,
            margin: 2,
            borderRadius: 10,
            backgroundColor: p,
          }}
        ></div>
      ))}
    </div>
  );
}
