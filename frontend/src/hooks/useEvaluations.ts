import { useContext } from "react";
import { EvaluationsContext, type EvaluationsContextType } from "../context/EvaluationProvider";

function useEvaluations(): EvaluationsContextType {
    const context = useContext(EvaluationsContext);
    if (!context) throw new Error("useEvaluations must be used within an EvaluationsProvider");
    return context;
}

export default useEvaluations;
