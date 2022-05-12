import axios, { AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { AccountLoginResponse } from "../models/AccountLoginResponse";
import { ApiResponse } from "../models/ApiResponse";
import { Product } from "../models/Product";
import { Rating, Review } from "../models/Review";
import { store } from "../store/configureStore";

const baseUrl = "http://localhost:5041/api/";
axios.defaults.baseURL = "http://localhost:5041/api/";
axios.defaults.withCredentials = true;

const responseBody = (response: AxiosResponse) => response?.data;

axios.interceptors.request.use((config) => {
  const token = store.getState().account.user?.token.token;
  if (token) config.headers!.Authorization = `Bearer ${token}`;
  return config;
});

const sleep = () => new Promise((resolve) => setTimeout(resolve, 500));

const requests = {
  get: (url: string) => axios.get(url).then(responseBody),
  post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
};

function getAxios() {
  const instance = axios.create({ baseURL: baseUrl });
  const token = store.getState().account.user?.token?.token;
  if (token != null && token !== "") {
    instance.defaults.headers.common["Authorization"] = "Bearer " + token;
  }
  instance.interceptors.response.use(
    async function (response) {
      await sleep();
      return response;
    },
    function (error) {
      if (429 === error.response?.status) {
        return Promise.resolve({
          data: { success: false, responseMessage: error.response.data },
        });
      }
    }
  );
  return instance;
}

const Catalog = {
  getProducts: async (): Promise<Product[]> => {
    try {
      let request = await getAxios().get(baseUrl + "products/GetProducts");
      let response = request.data as ApiResponse;
      if (response.success) return response.data as Product[];
      return [] as Product[];
    } catch (error) {
      console.log(error);
      return [] as Product[];
    }
  },

  getProduct: (productUuid: string): Promise<Product> => {
    return new Promise((resolve) => {
      if (productUuid !== null || productUuid !== "") {
        getAxios()
          .get(baseUrl + `products/GetProduct/${productUuid}`)
          .then(function (response) {
            if (response.data.success) {
              var data = response.data.data;
              resolve(data as Product);
              return true;
            }
            toast.error(response.data.responseMessage);
          })
          .catch(function (error) {
            toast.error(error);
            console.log(error);
          });
      } else {
        toast.error("invalid request identifier");
      }
    });
  },
};

const Reviews = {
  getProductReviews: async (productUuid: string): Promise<Review[]> => {
    try {
      let request = await getAxios().get(
        baseUrl + `products/GetProductReviews/${productUuid}`
      );
      let response = request.data as ApiResponse;
      if (response.success) return response.data as Review[];
      return [] as Review[];
    } catch (error) {
      console.log(error);
      return [] as Review[];
    }
  },

  getTotalProductReviews: (productUuid: string): Promise<Rating> => {
    return new Promise((resolve) => {
      if (productUuid !== null || productUuid !== "") {
        getAxios()
          .get(baseUrl + `products/GetTotalProductReviews/${productUuid}`)
          .then(function (response) {
            if (response.data.success) {
              var data = response.data.data;
              resolve(data as Rating);
              return true;
            }
            //toast.error(response.data.responseMessage);
          })
          .catch(function (error) {
            toast.error(error);
          });
      } else {
        toast.error("invalid request identifier");
      }
    });
  },
};

const Basket = {
  getBasket: () => requests.get("basket/GetBasket"),
  addItem: (productId: number, quantity = 1) =>
    requests.post(
      `basket/AddItemToBasket?productId=${productId}&quantity=${quantity}`,
      {}
    ),
  removeItem: (productId: number, quantity: number) =>
    requests.post(
      `basket/RemoveItemFromBasket?productId=${productId}&quantity=${quantity}`,
      {}
    ),
};

const Account = {
  login: async (payload: any): Promise<AccountLoginResponse> => {
    try {
      let request = await getAxios().post(baseUrl + "auth/login", payload);
      let response = request.data as ApiResponse;
      if (response.success) {
        toast.success('Login successful');
        return response.data as AccountLoginResponse;
      }
      toast.error(response.responseMessage);
      return {} as AccountLoginResponse;
    } catch (error) {
      console.log(error);
      return {} as AccountLoginResponse;
    }
  },
  register: async (payload: any): Promise<ApiResponse> => {
    try {
      let request = await getAxios().post(baseUrl + "auth/register", payload);
      let response = request.data as ApiResponse;
      if (response.success) {
        return {
          success: true,
          responseMessage: response.responseMessage,
          data: response.data,
        } as ApiResponse;
      }
      toast.error(response.responseMessage);
      return {
        success: false,
        responseMessage: response.responseMessage,
      } as ApiResponse;
    } catch (error) {
      toast.error("A system error occured, try again");
      return {
        success: false,
        responseMessage: "A system error occured, try again",
      } as ApiResponse;
    }
  },
  checkAuthentication: async () => {
    try {
      let local = localStorage.getItem("user");
      let userData = JSON.parse(local!) as AccountLoginResponse;
      if (store.getState().account.user) {
        return { success: true, userData: userData };
      }
      let request = await getAxios().get(baseUrl + "auth/VerifySession");
      console.log("request-->", request);
      let data = request.data as ApiResponse;
      if (request.status === 200 && data.success) {
        localStorage.setItem("user", JSON.stringify(userData));
        console.log("data--->", data);
        return data;
      }
      localStorage.removeItem("user");
      toast.error("Session expired - please login again");
      window.location.href = "/";
      return { success: false, responseMessage: "Unauthorized" };
    } catch (error) {
      console.log(error);
      toast.error("An error occured");
      return { success: false, responseMessage: "An error occured" };
    }
  },
};

const agent = {
  Catalog,
  Reviews,
  Basket,
  Account,
};

export default agent;
