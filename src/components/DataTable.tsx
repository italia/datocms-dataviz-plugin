import { Button } from "datocms-react-ui";

export default function DataTable({ data, reset, transpose }): JSX.Element {
  let max = 10;
  return (
    <div className="fontSize:12px">
      {data && data[0] && (
        <div
          style={{
            margin: "20px",
          }}
        >
          <table
            style={{
              border: "1px solid gray",
              width: "100%",
            }}
          >
            <thead>
              <tr key={`row-head`}>
                {data[0].map((cell, ii) => (
                  <th
                    className={`px-2 border-2 bg-gray-100  border-black`}
                    key={`head-cell-${ii}`}
                    style={{
                      borderLeft: ii ? "1px solid gray" : "",
                      borderBottom: "1px solid gray",
                    }}
                  >
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data?.slice(1, max).map((row, index) => {
                return (
                  <tr key={`row-${index}`}>
                    {row.map((cell, ii) => (
                      <td
                        key={`cell-${ii}`}
                        className={`px-2 ${
                          ii === 0
                            ? "font-bold border-2 bg-gray-100  border-gray"
                            : ""
                        }`}
                        style={{
                          borderLeft: ii ? "1px solid gray" : "",
                          borderBottom: "1px solid gray",
                        }}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="my-4">
            {transpose && (
              <span className="">
                <Button
                  type="button"
                  onClick={() => transpose()}
                  buttonSize="xxs"
                >
                  Transpose
                </Button>
              </span>
            )}
            {reset && (
              <span className="ms-3">
                <Button type="button" onClick={() => reset()} buttonSize="xxs">
                  Reset
                </Button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
