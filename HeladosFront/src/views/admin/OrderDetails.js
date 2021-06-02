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
        mt={20}
        p={"20"}
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
