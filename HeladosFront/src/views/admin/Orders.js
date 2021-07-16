import React, { useState } from "react";
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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  ModalFooter,
  useDisclosure,
  CloseButton,
  AlertIcon,
  Alert,
  AlertDescription
} from "@chakra-ui/react";
import Navbar from "../../components/admin/Navbar";
import { Box, Center, Heading, Stack } from "@chakra-ui/layout";
import useOrders from "../../utils/hooks/useOrders";
import { useForm } from "react-hook-form";
import ChakraDatePicker from "../../components/admin/ChakraDatePicker";
import axiosClient from "../../utils/providers/AxiosClient";
import { useHistory } from "react-router";

const AprobaPagoModal = ({ id }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { handleSubmit } = useForm();
  const [fechaEntrega, setFechaEntrega] = useState();
  const [errorFecha, setErrorFecha] = useState(false);

  const onSubmit = () => {
    if (!fechaEntrega) {
      setErrorFecha(true);
    } else {
      const fecha = fechaEntrega.toLocaleDateString("es-ES");
      console.log("Aprobando pago de", id, "para", fecha);

      axiosClient.patch(`/orders/${id}/approved`, { fechaEntrega: fecha });

      close();
    }
  };

  const close = () => {
    setFechaEntrega(null);
    setErrorFecha(false);
    onClose();
  };

  return (
    <>
      <Button colorScheme="green" onClick={onOpen}>
        Aprobar pago
      </Button>

      <Modal isOpen={isOpen} onClose={close}>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader>Aprobar pago</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <FormLabel>Fecha de entrega</FormLabel>
                <ChakraDatePicker
                  selectedDate={fechaEntrega}
                  onChange={(date) => setFechaEntrega(date)}
                />
              </FormControl>
              {errorFecha && (
                <Alert status="error" mt={4}>
                  <AlertIcon />
                  <AlertDescription>
                    Introducir fecha de entrega
                  </AlertDescription>
                  <CloseButton
                    onClick={() => setErrorFecha(false)}
                    position="absolute"
                    right="8px"
                    top="8px"
                  />
                </Alert>
              )}
            </ModalBody>
            <ModalFooter>
              <Button type={"submit"} colorScheme="blue" mr={3}>
                Save
              </Button>
              <Button onClick={close}>Cancel</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

const OrdersAdmin = () => {
  const { orders, isLoading, error } = useOrders();
  const history = useHistory();

  if (error) {
    console.log("Error fetching products");
    console.log(error);
  }

  if (orders) {
    console.log("got products", orders);
  }

  // filtrar

  const productsRows = isLoading
    ? null
    : orders.sort((a, b) => new Date(b.dateOfOrder) - new Date(a.dateOfOrder)).map(({ id, total, paid, client, dateOfOrder }, key) => {
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
              <Stack direction={["column", "row", "row"]} justify={"flex-end"}>
                {!paid && <AprobaPagoModal id={id} />}
                <Button colorScheme="blue" onClick={() => history.push(`/admin/orders/${id}`)}>Detalles</Button>
              </Stack>
            </Td>
          </Tr>
        );
      });

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

export default OrdersAdmin;
