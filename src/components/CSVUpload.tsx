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
      },
    });
  }

  return (
    <div>
      <div>
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
