import React from "react";
import { useParams } from "react-router-dom";
import { Box } from "@chakra-ui/react";

const OrderDetails = () => {
  const { id } = useParams();

  return (
    <>
      <Box>Detail for order with id: {id}</Box>
    </>
  );
};

export default OrderDetails;
