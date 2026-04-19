import { useContext } from "react";
import { StudentsContext, type StudentsContextType } from "../context/StudentProvider";

function useStudents(): StudentsContextType {
    const context = useContext(StudentsContext);
    if (!context) throw new Error("useStudents must be used within a StudentsProvider");
    return context;
};

export default useStudents;
