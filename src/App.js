import React, { useEffect, useState } from "react";
import classnames from "classnames";
import lodash from "lodash";
import axios from "axios";

const ITEMS_API_URL = "https://example.com/api/items";
const DEBOUNCE_DELAY = 500;


function useSearch(query) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  useEffect(() => {
    if (!query) return;
    setIsLoading(true);
    const timeOutId = setTimeout(() => fetchData(query), 500);
    return () => clearTimeout(timeOutId);
  }, [query]);

  function fetchData() {
    setData([]);
    let cancel;
    axios({
      method: "GET",
      url: "https://example.com/api/items",
      params: { q: query },
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then((res) => {
        setIsLoading(false);
        setData(res.data);
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
      });
    return () => cancel();
  }
  return { data, isLoading };
}

//not so familier with bulma so not spending more time on finding classname (sorry)
export default function App() {
  const [query, setQuery] = useState("");
  const { data, isLoading } = useSearch(query);

  function handleSearch(e) {
    const { value } = e.target;
    setTimeout(() => {
      if (value) setQuery(value);
    }, 500);
  }

  function selectItem(index) {
    alert("selected: " + data[index]);
  }

  return (
    <div className="wrapper">
      <div className="control">
        <div className={classnames("control", { "is-loading": isLoading })}>
          <input type="text" className="input" onChange={handleSearch} />
        </div>
        {data.length > 0 && !isLoading && (
          <div class="list">
            {data.map((i, index) => (
              <div
                key={i}
                onClick={() => selectItem(index)}
                className="list-item"
              >
                {i}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="list is-hoverable" />
    </div>
  );
}
