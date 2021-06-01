import React from "react";
import {
  Spinner,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Image,
  Td,
  Icon,
  Tag,
  Button,
  Popover,
  PopoverTrigger,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  ButtonGroup,
  PopoverContent,
} from "@chakra-ui/react";
import Navbar from "../../components/admin/Navbar";
import { Box, Center, Heading, Stack } from "@chakra-ui/layout";
import useProducts from "../../utils/hooks/useProducts";
import { HiCurrencyDollar } from "react-icons/hi";

const ProductsAdmin = () => {
  const { products, isLoading, error } = useProducts();

  if (error) {
    console.log("Error fetching products");
    console.log(error);
  }

  if (products) {
    console.log("got products", products);
  }

  const productsRows = isLoading
    ? null
    : products.map(({ flavor, product, id }, key) => (
        <Tr key={key}>
          <Td>
            <Image
              src={product.fotos[0].foto}
              h={"80px"}
              w={"80px"}
              alt={"Helado de " + flavor}
            />
          </Td>
          <Td>{product.name}</Td>
          <Td>{product.description}</Td>
          <Td>
            <Box d="flex" mt="2" alignItems="left">
              <Box as="span" color="gray.600" fontSize="sm">
                {product.precios[0] ? (
                  <>
                    <Icon w={5} h={5} color="green.400" as={HiCurrencyDollar} />
                    {product.precios[0].price}
                    {"  "}
                  </>
                ) : null}
                {product.precios[1] ? (
                  <>
                    <Icon
                      w={5}
                      h={5}
                      color="yellow.400"
                      as={HiCurrencyDollar}
                    />
                    {product.precios[1].price}
                    {"  "}
                  </>
                ) : null}
                {product.precios[2] ? (
                  <>
                    <Icon w={5} h={5} color="pink.400" as={HiCurrencyDollar} />
                    {product.precios[2].price}
                  </>
                ) : null}
              </Box>
            </Box>
          </Td>
          <Td>
            <Tag
              size="md"
              variant="solid"
              colorScheme={product.available ? "green" : "red"}
            >
              {product.available ? "Disponible" : "Agotado"}
            </Tag>
          </Td>
          <Td>
            <Stack direction={["column", "row", "row"]}>
              <Button colorScheme="blue">Editar</Button>
              <Popover>
                {({ onClose }) => (
                  <>
                    <PopoverTrigger>
                      <Button colorScheme="red">Eliminar</Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <PopoverArrow />
                      <PopoverCloseButton />
                      <PopoverHeader>
                        ¿Desea eliminar el producto seleccionado?
                      </PopoverHeader>
                      <PopoverBody>
                        Los datos no podrán ser recuperados.
                      </PopoverBody>
                      <PopoverFooter d="flex" justifyContent="flex-end">
                        <ButtonGroup size="sm">
                          <Button variant="outline" onClick={onClose}>
                            Cancelar
                          </Button>
                          <Button
                            colorScheme="red"
                            onClick={() => {
                              console.log("deleting product with id", id);
                              onClose();
                            }}
                          >
                            Eliminar
                          </Button>
                        </ButtonGroup>
                      </PopoverFooter>
                    </PopoverContent>
                  </>
                )}
              </Popover>
            </Stack>
          </Td>
        </Tr>
      ));

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
        <Heading mb={5}>Productos</Heading>
        <Stack direction="row" mb={"3"}>
          <Button colorScheme="green">Nuevo producto</Button>
        </Stack>
        {isLoading ? (
          <Center>
            <Spinner size="xl" color={"gray"} />
          </Center>
        ) : (
          <Table variant={"simple"}>
            <Thead>
              <Tr>
                <Th>Imagen</Th>
                <Th>Nombre</Th>
                <Th>Descripción</Th>
                <Th>Precios</Th>
                <Th>Disponible</Th>
                <Th>Acciones</Th>
              </Tr>
            </Thead>
            <Tbody>{productsRows}</Tbody>
          </Table>
        )}
      </Box>
    </>
  );
};

export default ProductsAdmin;
