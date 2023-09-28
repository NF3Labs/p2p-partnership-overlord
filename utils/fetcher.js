import axios from "axios";

export const defaultHeaders = () => {
  const user = localStorage.getItem("CSRF") && JSON.parse(localStorage.getItem("CSRF"));

  if (user && user.access_token) {
    return { Authorization: "Bearer " + user.access_token };
  } else {
    return {};
  }
};

export const fetcher = async (href) => {
  const res = await axios.get(href, { headers: defaultHeaders() });
  return res.data;
};

export const fetchWithParams = async (input) => {
  const res = await axios.get(input.url, {
    params: { ...input.args },
    headers: defaultHeaders(),
  });
  return res.data.data;
};
