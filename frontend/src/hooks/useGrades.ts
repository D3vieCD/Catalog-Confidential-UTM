import { useContext } from "react";
import { GradesContext, type GradesContextType } from "../context/GradeProvider";

function useGrades(): GradesContextType {
    const context = useContext(GradesContext);
    if (!context) throw new Error("useGrades must be used within a GradesProvider");
    return context;
}

export default useGrades;
