// stores/workspaceStore.js
import { useGetWorkspaceById } from '@/hooks/apis/workspaces/useGetWorkspaceById';
import { create } from 'zustand';

export const useWorkspaceStore = create((set) => ({
  currentWorkspaceId: null,
  setCurrentWorkspaceId: (id) => set({ currentWorkspaceId: id }),
  clearCurrentWorkspace: () => set({ currentWorkspaceId: null }),
}));

// Helper hook to get current workspace details
export const useCurrentWorkspace = () => {
  const { currentWorkspaceId } = useWorkspaceStore();
  const { workspace } = useGetWorkspaceById(currentWorkspaceId || '');
  return workspace;
};