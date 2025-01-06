import { useNavigate } from "react-router-dom";
import { paths } from "@/config/paths";

export const useNavigation = () => {
  const navigate = useNavigate();

  const goToAuth = () => navigate(paths.auth.main.getHref());
  const goToSolver = () => navigate(paths.app.solver.getHref());
  const goToPredictions = () => navigate(paths.app.predictions.getHref());
  const goToPlans = () => navigate(paths.app.plans.getHref());
  const goToRoot = () => navigate(paths.app.root.getHref());

  return {
    goToAuth,
    goToSolver,
    goToPredictions,
    goToPlans,
    goToRoot,
  };
};
