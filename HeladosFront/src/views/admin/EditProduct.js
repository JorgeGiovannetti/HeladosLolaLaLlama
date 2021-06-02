import React, { useState } from "react";
import {
  useParams,
  Link as ReactRouterLink,
  useHistory,
} from "react-router-dom";
import { Box, Heading, Link, useColorModeValue } from "@chakra-ui/react";
import ProductForm from "../../components/admin/ProductForm";
import Navbar from "../../components/admin/Navbar";
import { ArrowBackIcon } from "@chakra-ui/icons";
import useProduct from "../../utils/hooks/useProduct";

const EditProduct = () => {
  const { id } = useParams();
  const { product, isLoading } = useProduct(id);
  const history = useHistory();

  if (!isLoading && !product) {
    history.push("/admin/products");
  }

  return (
    <>
      <Navbar />
      <Box p={3} mt={10} w={"100%"}>
        <Heading mb={3}>Editar producto</Heading>
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

export default EditProduct;
