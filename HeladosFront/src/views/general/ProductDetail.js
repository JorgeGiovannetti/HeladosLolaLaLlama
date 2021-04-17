import React from "react";
import { useParams } from "react-router-dom";
import { Box } from "@chakra-ui/react";

const ProductDetail = () => {
  const { id } = useParams();

  return (
    <>
      <Box>Detail for product with id: {id}</Box>
    </>
  );
};

export default ProductDetail;
