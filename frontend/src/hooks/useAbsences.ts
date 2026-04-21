import { useContext } from "react";
import { AbsencesContext, type AbsencesContextType } from "../context/AbsenceProvider";

function useAbsences(): AbsencesContextType {
    const context = useContext(AbsencesContext);
    if (!context) throw new Error("useAbsences must be used within an AbsencesProvider");
    return context;
}

export default useAbsences;
