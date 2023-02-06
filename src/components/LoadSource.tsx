import { Button } from 'datocms-react-ui';
import { useState } from 'react';

import axios from 'axios';

function TransformSource({ setRawData }) {
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState(
    'https://raw.githubusercontent.com/teamdigitale/padigitale2026-opendata/main/data/candidature_altrienti_finanziate.json'
  );

  async function getData() {
    setLoading(true);
    try {
      let testUrl = new URL(url);
      if (testUrl) {
        const { data } = await axios.get(url);
        setRawData(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full my-10">
      {loading && <p>Loading...</p>}
      <div>
        <p>Url:</p>
        <input
          className="border-2"
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>

      <Button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => getData()}
      >
        fetch data
      </Button>
    </div>
  );
}

export default TransformSource;
