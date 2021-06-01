import React from "react";
import {
  Spinner,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tag,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
  PopoverFooter,
  ButtonGroup,
  PopoverHeader,
} from "@chakra-ui/react";
import Navbar from "../../components/admin/Navbar";
import { Box, Center, Heading, Stack } from "@chakra-ui/layout";
import useOrders from "../../utils/hooks/useOrders";

const ProductsAdmin = () => {
  const { orders, isLoading, error } = useOrders();

  if (error) {
    console.log("Error fetching products");
    console.log(error);
  }

  if (orders) {
    console.log("got products", orders);
  }

  const productsRows = isLoading
    ? null
    : orders.map(({ id, total, paid, client, dateOfOrder }, key) => {
        const orderDate = new Date(dateOfOrder);

        return (
          <Tr key={key}>
            <Td>{id}</Td>
            <Td>${total}</Td>
            <Td>{client.name}</Td>
            <Td>{client.phone}</Td>
            <Td>{client.email}</Td>
            <Td>{client.address}</Td>
            <Td>{orderDate.toLocaleDateString()}</Td>
            <Td>
              <Tag
                size="md"
                variant="solid"
                colorScheme={paid ? "green" : "red"}
              >
                {paid ? "Pagado" : "Pendiente"}
              </Tag>
            </Td>
            <Td>
              <Stack direction={["column", "row", "row"]}>
                <Button colorScheme="blue">Detalles</Button>
                <Popover>
                  {({ onClose }) => (
                    <>
                      <PopoverTrigger>
                        <Button colorScheme="red">
                          Eliminar
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverHeader>
                          ¿Desea eliminar la órden seleccionada?
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
                                console.log("deleting order with id", id);
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
        );
      });

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
        <Heading mb={5}>Órdenes</Heading>
        {isLoading ? (
          <Center>
            <Spinner size="xl" color={"gray"} />
          </Center>
        ) : (
          <Table variant={"simple"}>
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Total</Th>
                <Th>Nombre de cliente</Th>
                <Th>Teléfono de cliente</Th>
                <Th>Correo de cliente</Th>
                <Th>Dirección</Th>
                <Th>Fecha de órden</Th>
                <Th>Estatus de pago</Th>
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
