import axios, { AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { ApiResponse } from "../models/ApiResponse";
import { Product } from "../models/Product";
import { Rating, Review } from "../models/Review";

const baseUrl = "http://localhost:5041/api/";
axios.defaults.baseURL = "http://localhost:5041/api/";
axios.defaults.withCredentials = true;

const responseBody = (response: AxiosResponse) => response?.data;

const sleep = () => new Promise(resolve => setTimeout(resolve, 500));

const requests = {
  get:(url: string) => axios.get(url).then(responseBody),
  post:(url: string, body: {}) => axios.post(url, body).then(responseBody)
}

function getAxios() {
  const instance = axios.create({ baseURL: baseUrl });
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
            toast.error(response.data.responseMessage)
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

  getTotalProductReviews:  (productUuid: string): Promise<Rating> => {
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

const agent = {
  Catalog,
  Reviews,
  Basket
};

export default agent;
