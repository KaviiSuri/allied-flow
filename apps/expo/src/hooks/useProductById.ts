import { api } from "~/utils/api";

export const useProductById = (id: string) => {
  const { data: productList, isLoading } = api.products.read.useQuery(
    undefined,
    {
      gcTime: Infinity,
      staleTime: 10 * 60 * 1000,
    },
  );
  if (isLoading) {
    return {
      isLoading,
      product: null,
    };
  }
  const product = productList?.find((product) => product.id === id);

  return {
    isLoading,
    product,
  };
};

export const useProductList = () => {
  const { data: productList, isLoading } = api.products.read.useQuery(
    undefined,
    {
      gcTime: Infinity,
      staleTime: 10 * 60 * 1000,
    },
  );

  return {
    isLoading,
    productList,
  };
};
