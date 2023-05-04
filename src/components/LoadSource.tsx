import { Button } from "datocms-react-ui";
import { useState } from "react";
import axios from "axios";
import { log } from "../lib/utils";

function TransformSource({ setRawData }) {
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState(null);

  async function getData() {
    setLoading(true);
    try {
      let testUrl = new URL(url);
      if (testUrl) {
        const { data } = await axios.get(url);
        setRawData(data);
      }
    } catch (error) {
      log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        marginTop: 10,
        marginBottom: 10,
        width: "100%",
      }}
    >
      {loading && <p>Loading...</p>}
      <div>
        <p>Url:</p>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>
      <Button onClick={() => getData()}>fetch data</Button>
    </div>
  );
}

export default TransformSource;
