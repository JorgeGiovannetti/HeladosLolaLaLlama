import React from "react";
import {
  Box,
  Center,
  Heading,
  HStack,
  Spinner,
  Stack,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";
import Navbar from "../../components/admin/Navbar";
import useStats from "../../utils/hooks/useStats";

const Dashboard = () => {
  const { data, isLoading, error } = useStats();

  if (!isLoading) {
    console.log("data", data);
  }

  if (error) {
    console.log("error", error);
  }

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
        <Heading mb={5}>Dashboard</Heading>
        {isLoading ? (
          <Center>
            <Spinner size="xl" color={"gray"} />
          </Center>
        ) : (
          <Stack direction={["column", "column", "row"]}>
              <Stat
                px={{ base: 4, md: 8 }}
                py={"5"}
                shadow={"xl"}
                border={"2px solid"}
                borderColor={"purple.400"}
                rounded={"lg"}
              >
                <StatLabel>Ganancias</StatLabel>
                <StatNumber>${data.lastMonthProfits?.totalSum ?? 0}</StatNumber>
                <StatHelpText>en los últimos 30 días</StatHelpText>
              </Stat>
              <Stat
                px={{ base: 4, md: 8 }}
                py={"5"}
                shadow={"xl"}
                border={"2px solid"}
                borderColor={"purple.400"}
                rounded={"lg"}
              >
                <StatLabel>Órdenes pagadas</StatLabel>
                <StatNumber>{data.numberPaidOrdersLastMonth ?? 0}</StatNumber>
                <StatHelpText>en los últimos 30 días</StatHelpText>
              </Stat>
          </Stack>
        )}
      </Box>
    </>
  );
};

export default Dashboard;
