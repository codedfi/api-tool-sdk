import axios from "axios";

const instance = axios.create({
  baseURL: "https://api2.chainge.finance/v1",
  timeout: 60000,
});

instance.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    const { status, data: responseData } = response;
    if (status === 200) {
        return responseData;
    } else {
      return null;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
