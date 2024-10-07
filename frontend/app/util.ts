import { enqueueSnackbar } from "notistack";
// Local
import { API_URL } from "./constants";
import { IFetchOptions } from "./interface";

// Utility function to fetch data from an API
export async function fetchData(url: string, options: IFetchOptions = {}) {
  const { method = "GET", headers = {}, body = null } = options;

  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body ? JSON.stringify(body) : null,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

export async function fetchStockDataFromSymbol(symbol: string) {
  const response = await fetchData(`${API_URL}/quote?symbol=${symbol}`);
  return response;
}

export function alertUser(message: string, variant: any) {
  enqueueSnackbar(message, {
    variant,
    preventDuplicate: true,
    autoHideDuration: 3000,
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "center", // Assuming you want to specify horizontal as well
    },
  });
}
