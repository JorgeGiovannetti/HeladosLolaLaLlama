import React from "react";
import { Link as ReactRouterLink } from "react-router-dom";
import { Box, Heading, Link, useColorModeValue } from "@chakra-ui/react";
import ProductForm from "../../components/admin/ProductForm";
import Navbar from "../../components/admin/Navbar";
import { ArrowBackIcon } from "@chakra-ui/icons";

const NewProduct = () => {
  return (
    <>
      <Navbar />
      <Box p={"10"} mt={16} w={"100%"}>
        <Heading mb={3}>Nuevo Producto</Heading>
        <Box mb={3}>
          <Link
            as={ReactRouterLink}
            to={"/admin/products"}
            _hover={{
              color: useColorModeValue("purple.400", "purple.200"),
            }}
          >
            <ArrowBackIcon />
            Regresar a productos
          </Link>
        </Box>
        <ProductForm />
      </Box>
    </>
  );
};

export default NewProduct;
