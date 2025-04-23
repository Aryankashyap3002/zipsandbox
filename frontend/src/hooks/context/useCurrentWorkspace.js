// In hooks/context/useCurrentWorkspace.js
import { useContext } from 'react';
import WorkspaceContext from '@/context/WorkspaceContext';

export const useCurrentWorkspace = () => {
  const context = useContext(WorkspaceContext);
  
  if (context === undefined) {
    throw new Error('useCurrentWorkspace must be used within a WorkspaceContextProvider');
  }
  
  return context;
};