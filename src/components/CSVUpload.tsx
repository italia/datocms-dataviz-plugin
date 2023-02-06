import { useState } from 'react';
import { Canvas, Button, SwitchField } from 'datocms-react-ui';
import Papa from 'papaparse';

function UploadCSV({ setData }) {
  function uploadFile(event) {
    let file = event.target.files[0];

    Papa.parse(file, {
      header: false,
      skipEmptyLines: true,
      complete: (results) => {
        console.log('RESULTS DATA', results.data);
        setData(results.data);
        // const data = results.data.map((row, i) => {
        //   if (i === 0) {
        //     return row;
        //   } else {
        //     return row.map((cell, index) => {
        //       if (index === 0) {
        //         return cell;
        //       } else {
        //         return Number(cell);
        //       }
        //     });
        //   }
        // });
        // setData(data);
      },
    });
  }

  return (
    <div className="w-full px-10">
      <div className="m-10 border-2">
        <p>Upload a csv</p>
        <input
          className="input"
          type="file"
          name="file"
          accept=".csv"
          onChange={(e) => uploadFile(e)}
        />
      </div>
    </div>
  );
}

export default UploadCSV;
