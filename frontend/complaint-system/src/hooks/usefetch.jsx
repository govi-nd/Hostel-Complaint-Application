import { useEffect, useState } from "react";

export function useFetch(url) {
  const [finalData, setFinalData] = useState(null);

  async function getDetails() {
    try {
      const response = await fetch(url);
      const data = await response.json();
      setFinalData(data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }

  useEffect(() => {
    getDetails();
  }, [url]);

  return {
    finalData
  };
}
