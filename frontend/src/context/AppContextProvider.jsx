import combineContext from '@/utils/combineContext';

 import { AuthContextProvider } from './AuthContext';
import { CreateWorkspaceContextProvider } from './CreateWorkspaceContext';
import { WorkspaceContextProvider } from './WorkspaceContext';
import { CreateChannelContextProvider } from './CreateChannelContext';
import { WorkspacePreferencesModalContextProvider } from './WorkspacePreferencesModalContext';

 
 
export const AppContextProvider = combineContext(
    AuthContextProvider,
    CreateWorkspaceContextProvider,
    WorkspacePreferencesModalContextProvider, // This should come before components that use it
    WorkspaceContextProvider,
    CreateChannelContextProvider
  );