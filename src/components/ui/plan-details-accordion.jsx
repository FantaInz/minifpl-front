import React from "react";
import { Box, Heading, Text, List } from "@chakra-ui/react";
import {
  AccordionRoot,
  AccordionItem,
  AccordionItemTrigger,
  AccordionItemContent,
} from "@/components/ui/accordion";
import { DataListItem, DataListRoot } from "@/components/ui/data-list";

const PlanDetailsAccordion = ({ planDetails }) => {
  if (!planDetails) return null;

  return (
    <Box
      p={8}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="lg"
      bg="white"
      width={{ base: "100%", md: "60%" }}
      margin="auto"
      mt="3"
    >
      <Heading size="2xl" mb={6} textAlign="center">
        Szczegóły Planu
      </Heading>
      <AccordionRoot multiple="true" collapsible="true">
        {Array.from(
          { length: planDetails.end_gameweek - planDetails.start_gameweek + 1 },
          (_, i) => {
            const gw = planDetails.start_gameweek + i;
            const squad = planDetails.squads[i];
            const transfers = planDetails.transfers[i];

            return (
              <AccordionItem key={gw} value={`gw-${gw}`}>
                <AccordionItemTrigger>
                  Kolejka {gw} ({squad?.estimated_points})
                </AccordionItemTrigger>
                <AccordionItemContent>
                  <DataListRoot
                    orientation="horizontal"
                    divideY="0.5px"
                    mx="auto"
                  >
                    <DataListItem
                      pt="4"
                      pb="2"
                      grow
                      label="Kapitan"
                      value={squad?.captain?.name || "Brak kapitana"}
                    />
                    <DataListItem
                      pt="4"
                      pb="2"
                      label="Sprzedaż"
                      grow
                      value={
                        transfers?.transfer_out?.length > 0 ? (
                          <List.Root variant="plain" mt={2}>
                            {transfers.transfer_out.map((out, index) => (
                              <List.Item key={index}>{out.name}</List.Item>
                            ))}
                          </List.Root>
                        ) : (
                          "Brak transferów"
                        )
                      }
                    />
                    <DataListItem
                      pt="4"
                      pb="2"
                      label="Kupno"
                      grow
                      value={
                        transfers?.transfer_in?.length > 0 ? (
                          <List.Root variant="plain" mt={2}>
                            {transfers.transfer_in.map((inTransfer, index) => (
                              <List.Item key={index}>
                                {inTransfer.name}
                              </List.Item>
                            ))}
                          </List.Root>
                        ) : (
                          "Brak transferów"
                        )
                      }
                    />
                  </DataListRoot>
                </AccordionItemContent>
              </AccordionItem>
            );
          },
        )}
      </AccordionRoot>
    </Box>
  );
};

export default PlanDetailsAccordion;
