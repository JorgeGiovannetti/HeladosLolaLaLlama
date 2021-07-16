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
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialog,
} from "@chakra-ui/react";
import Navbar from "../../components/admin/Navbar";
import { Box, Center, Heading, Stack } from "@chakra-ui/layout";
import useProducts from "../../utils/hooks/useProducts";
import { HiCurrencyDollar } from "react-icons/hi";
import { useHistory } from "react-router";
import axiosClient from "../../utils/providers/AxiosClient";

const AlertaEliminar = ({ id }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef();

  const eliminarProducto = () => {   
    axiosClient.delete(`/helados/${id}`);

    onClose();
  }

  return (
    <>
      <Button colorScheme="red" onClick={() => setIsOpen(true)}>
        Eliminar
      </Button>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Customer
            </AlertDialogHeader>

            <AlertDialogBody>
            ¿Desea eliminar el producto seleccionado? <br/>
            Los datos no podrán ser recuperados.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancelar
              </Button>
              <Button colorScheme="red" onClick={eliminarProducto} ml={3}>
                Eliminar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

const AlertaDeshabilitar = ({ id }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef();

  const deshabilitarProducto = () => {   
    axiosClient.post(`product/changeAvailable/${id}`);
    onClose();
  }

  return (
    <>
      <Button colorScheme="blue" onClick={() => setIsOpen(true)}>
        Cambiar estado
      </Button>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Customer
            </AlertDialogHeader>

            <AlertDialogBody>
            ¿Desea cambiar el estado de disponibilidad del producto seleccionado? <br/>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancelar
              </Button>
              <Button colorScheme="blue" onClick={deshabilitarProducto} ml={3}>
                Cambiar estado
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

const ProductsAdmin = () => {
  const { products, isLoading, error } = useProducts();
  const history = useHistory();

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
              src={product?.fotos[product?.fotos.length - 1]?.foto}
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
            <Stack direction={["column", "row", "row", "row"]}>
              <Button colorScheme="blue" onClick={() => history.push(`/admin/products/${id}`)}>Editar</Button>
              <AlertaEliminar id={id}/>
              <AlertaDeshabilitar id={id}/>
            </Stack>
          </Td>
        </Tr>
      ));

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
        <Heading mb={5}>Productos</Heading>
        <Stack direction="row" mb={"3"}>
          <Button colorScheme="green" onClick={() => history.push('/admin/products/new-product')}>Nuevo producto</Button>
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
