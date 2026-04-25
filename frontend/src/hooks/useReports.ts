import { useContext } from "react";
import { ReportsContext, type ReportsContextType } from "../context/ReportProvider";

function useReports(): ReportsContextType {
    const context = useContext(ReportsContext);
    if (!context) throw new Error("useReports must be used within a ReportsProvider");
    return context;
}

export default useReports;
