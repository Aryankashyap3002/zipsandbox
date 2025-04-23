import { WorkspaceContext } from "@/context/WorkspaceContext";
import { useContext } from "react";

export const useWorkspaceContext = () => {
    const context = useContext(WorkspaceContext);
    if (!context) {
      throw new Error('useWorkspaceContext must be used within a WorkspaceContextProvider');
    }
    return context;
  };