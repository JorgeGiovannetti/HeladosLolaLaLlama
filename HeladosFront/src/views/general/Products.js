import React from "react";
import { Spinner } from "@chakra-ui/react";
import Navbar from "../../components/general/Navbar";
import { Center, Flex, SimpleGrid } from "@chakra-ui/layout";
import useProducts from "../../utils/hooks/useProducts";
import Product from "../../components/general/Product";
import { Redirect } from "react-router-dom";

const Products = () => {
  const { products, isLoading, error } = useProducts();

  if (error) {
    console.log("Error fetching products");
    console.log(error);
  }

  const componentsChild = isLoading ? (
    <Center>
      <Spinner size="xl" color={"gray"} />
    </Center>
  ) : products === undefined ? null : (
    products.map(({ categories, flavor, id, product }) => (
      <Product
        categories={categories}
        flavor={flavor}
        product={product}
        id={id}
        key={id}
      />
    ))
  );

  return (
    <Flex minH={"100vh"} w={"100%"} direction={"column"} align={"center"} justify={"center"}>
      {!isLoading && products === undefined ? (
        <Redirect to="/" />
      ) : (
        <>
          <Navbar />
          <SimpleGrid minChildWidth="360px" gap={12} w="100%" p="12" mt={12}>
            {componentsChild}
          </SimpleGrid>
        </>
      )}
    </Flex>
  );
};

export default Products;
