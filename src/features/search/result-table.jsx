import React from "react";
import PropTypes from "prop-types";
import { Table } from "@chakra-ui/react";

const positionMap = {
  Goalkeeper: "Bramkarz",
  Defender: "Obrońca",
  Midfielder: "Pomocnik",
  Forward: "Napastnik",
};

const ResultTable = ({ startGameweek, endGameweek, players }) => {
  const renderPointsColumns = () => {
    const columns = [];
    for (let gw = startGameweek; gw <= endGameweek; gw++) {
      columns.push(
        <Table.ColumnHeader key={`expected-${gw}`}>
          Przew. GW{gw}
        </Table.ColumnHeader>,
      );
      columns.push(
        <Table.ColumnHeader key={`actual-${gw}`}>
          Zdob. GW{gw}
        </Table.ColumnHeader>,
      );
    }
    return columns;
  };

  const renderPointsCells = (player) => {
    const cells = [];
    for (let gw = startGameweek; gw <= endGameweek; gw++) {
      cells.push(
        <Table.Cell key={`expected-${gw}`}>
          {player.expectedPoints?.[gw - 1] !== undefined
            ? parseFloat(player.expectedPoints[gw - 1]).toFixed(2)
            : "??"}
        </Table.Cell>,
      );
      cells.push(
        <Table.Cell key={`actual-${gw}`}>
          {player.points?.[gw - 1] ?? "??"}
        </Table.Cell>,
      );
    }
    return cells;
  };

  return (
    <Table.ScrollArea borderWidth="1px" maxW="5xl" mx="auto">
      <Table.Root
        size="sm"
        striped
        showColumnBorder
        interactive
        colorPalette="blue"
        stickyHeader
      >
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Piłkarz</Table.ColumnHeader>
            <Table.ColumnHeader>Drużyna</Table.ColumnHeader>
            <Table.ColumnHeader>Pozycja</Table.ColumnHeader>
            <Table.ColumnHeader>Cena</Table.ColumnHeader>
            {renderPointsColumns()}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {players.length > 0 ? (
            players.map((player) => (
              <Table.Row key={player.id}>
                <Table.Cell>{player.name}</Table.Cell>
                <Table.Cell>{player.team.name}</Table.Cell>
                <Table.Cell>
                  {positionMap[player.position] || player.position}
                </Table.Cell>
                <Table.Cell>{(player.price / 10).toFixed(1)}</Table.Cell>{" "}
                {renderPointsCells(player)}
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Table.Cell>Brak wyników</Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  );
};

ResultTable.propTypes = {
  startGameweek: PropTypes.number.isRequired,
  endGameweek: PropTypes.number.isRequired,
  players: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      team: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }).isRequired,
      position: PropTypes.string.isRequired,
      points: PropTypes.number,
    }),
  ).isRequired,
};

export default ResultTable;
