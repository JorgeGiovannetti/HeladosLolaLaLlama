import React from "react";
import { useParams } from "react-router-dom";
import { Box, Heading } from "@chakra-ui/react";
import Navbar from "../../components/admin/Navbar";

const OrderDetails = () => {
  const { id } = useParams();

  return (
    <>
    <Navbar />
      <Box
        mt={16}
        p={"10"}
        w={"100%"}
        flexDirection={"column"}
        justifyContent={"center"}
      >
        <Heading mb={5}>Detalles de orden</Heading>
      <Box>Detail for order with id: {id}</Box>
      </Box>
    </>
  );
};

export default OrderDetails;
