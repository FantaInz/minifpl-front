import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/components/ui/select";

const PlanSelector = ({
  plansCollection,
  selectedPlanId,
  setSelectedPlanId,
}) => {
  return (
    <SelectRoot
      collection={plansCollection}
      size="lg"
      bg="white"
      width={{ base: "70%", md: "40%" }}
      borderRadius="md"
      shadow="lg"
      value={[selectedPlanId]}
      onValueChange={(e) => {
        setSelectedPlanId(e.value[0]);
      }}
    >
      <SelectTrigger>
        <SelectValueText placeholder="Wybierz plan" />
      </SelectTrigger>
      <SelectContent>
        {plansCollection.items.map((plan) => (
          <SelectItem item={plan} key={plan.value}>
            {plan.label}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectRoot>
  );
};

export default PlanSelector;
