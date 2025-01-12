import React from "react";
import PropTypes from "prop-types";
import { Table } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

const ResultTable = ({ startGameweek, endGameweek, players }) => {
  const { t } = useTranslation();

  const renderPointsColumns = () => {
    const columns = [];
    for (let gw = startGameweek; gw <= endGameweek; gw++) {
      columns.push(
        <Table.ColumnHeader key={`expected-${gw}`}>
          {t("resultTable.expectedPoints", { gw })}
        </Table.ColumnHeader>,
      );
      columns.push(
        <Table.ColumnHeader key={`actual-${gw}`}>
          {t("resultTable.actualPoints", { gw })}
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
            : t("resultTable.noData")}
        </Table.Cell>,
      );
      cells.push(
        <Table.Cell key={`actual-${gw}`}>
          {player.points?.[gw - 1] ?? t("resultTable.noData")}
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
            <Table.ColumnHeader>{t("resultTable.player")}</Table.ColumnHeader>
            <Table.ColumnHeader>{t("resultTable.team")}</Table.ColumnHeader>
            <Table.ColumnHeader>{t("resultTable.position")}</Table.ColumnHeader>
            <Table.ColumnHeader>{t("resultTable.price")}</Table.ColumnHeader>
            <Table.ColumnHeader>
              {t("resultTable.availability")}
            </Table.ColumnHeader>
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
                  {t(`positions.${player.position.toLowerCase()}`, {
                    defaultValue: player.position,
                  })}
                </Table.Cell>
                <Table.Cell>{(player.price / 10).toFixed(1)}</Table.Cell>
                <Table.Cell>
                  {player.availability !== undefined
                    ? `${player.availability}%`
                    : t("resultTable.noData")}
                </Table.Cell>
                {renderPointsCells(player)}
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Table.Cell> {t("resultTable.noResults")}</Table.Cell>
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
      price: PropTypes.number.isRequired,
      availability: PropTypes.number,
      expectedPoints: PropTypes.arrayOf(PropTypes.string),
      points: PropTypes.arrayOf(PropTypes.number),
    }),
  ).isRequired,
};

export default ResultTable;
