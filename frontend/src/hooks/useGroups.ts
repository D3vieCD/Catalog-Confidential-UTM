
import { useContext } from "react";
import { GroupsContext, type GroupsContextType } from "../context/GroupProvider";

function useGroups(): GroupsContextType  {
    const context = useContext(GroupsContext);
    if (!context) throw new Error("useGroups must be used within a GroupsProvider");
    return context;
};

export default useGroups;