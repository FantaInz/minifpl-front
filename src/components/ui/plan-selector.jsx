import React from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import customStyles from "@/config/select-styles";

const PlanSelector = ({ plans, selectedPlanId, setSelectedPlanId }) => {
  const { t } = useTranslation();

  const selectedOption = plans.find(
    (option) => option.value === selectedPlanId,
  );

  return (
    <Select
      options={plans}
      value={selectedOption}
      onChange={(option) => setSelectedPlanId(option.value)}
      placeholder={t("planSelector.placeholder")}
      styles={customStyles({
        minWidth: "200px",
        width: "100%",
      })}
    />
  );
};

PlanSelector.propTypes = {
  plans: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ).isRequired,
  selectedPlanId: PropTypes.string,
  setSelectedPlanId: PropTypes.func.isRequired,
};

export default PlanSelector;
