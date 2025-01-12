import React from "react";
import Select from "react-select";
import customStyles from "@/config/select-styles";

const PlanSelector = ({ plans, selectedPlanId, setSelectedPlanId }) => {
  const selectedOption = plans.find(
    (option) => option.value === selectedPlanId,
  );

  return (
    <Select
      options={plans}
      value={selectedOption}
      onChange={(option) => setSelectedPlanId(option.value)}
      placeholder="Wybierz plan"
      styles={customStyles({
        minWidth: "200px",
        width: "100%",
      })}
    />
  );
};

export default PlanSelector;
