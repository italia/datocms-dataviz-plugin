import { Button } from 'datocms-react-ui';

export default function DataTable({ data, reset, transpose }): JSX.Element {
  let max = 20;
  return (
    <div className="fontSize:12px">
      {data && data[0] && (
        <>
          <table style={{ border: '1px solid lightgray' }}>
            <thead>
              <tr key={`row-head`}>
                {data[0].map((cell, ii) => (
                  <th
                    className={`px-2 border-2 bg-gray-100  border-black`}
                    key={`head-cell-${ii}`}
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
                            ? 'font-bold border-2 bg-gray-100  border-black'
                            : ''
                        }`}
                        style={{
                          borderLeft: ii ? '1px solid black' : '',
                          borderBottom: '1px solid black',
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
              <span className="mx-2 border-2 p-2">
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
              <span className="mx-2 border-2 p-2">
                <Button type="button" onClick={() => reset()} buttonSize="xxs">
                  Reset
                </Button>
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
