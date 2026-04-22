import { useContext } from "react";
import { SubjectsContext, type SubjectsContextType } from "../context/SubjectProvider";

function useSubjects(): SubjectsContextType {
    const context = useContext(SubjectsContext);
    if (!context) throw new Error("useSubjects must be used within a SubjectsProvider");
    return context;
}

export default useSubjects;
