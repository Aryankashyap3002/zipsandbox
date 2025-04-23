import fetchWithConfig from '@/config/fetchConfig';

export const createWorkspaceRequest = async ({ name, description, token }) => {
    try {
        const response = await fetchWithConfig('/api/v1/workspaces', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token
            },
            body: JSON.stringify({ name, description })
        });
        console.log('Response in create workspace request', response?.data);
        return response?.data; // Remove the extra .data here
    } catch(error) {
        console.log('Error in create workspace request', error);
        throw error;
    }
};

export const fetchWorkspacesRequest = async ({ token }) => {
    try {
        const response = await fetchWithConfig('/api/v1/workspaces', {
            method: 'GET', 
            headers: {
                'x-access-token': token
            }
        });
        
        

        
        return response?.data;
    } catch(error) {
        console.log('Error in fetching workspace request', error);
        throw error;
    }
};

export const fetchWorkspaceDetailsRequest = async ({ workspaceId, token }) => {
   

    try {
        const response = await fetchWithConfig(`/api/v1/workspaces/${workspaceId}`, {
            method: 'GET',
            headers: {
                'x-access-token': token
            }
        });
        console.log('Workspace details response:', response);
        return response;
    } catch(error) {
        console.error('Error fetching workspace details:', error);
        throw error;
    }
};

export const deleteWorkspaceRequest = async ({ workspaceId, token}) => {
    try {
        const response = await fetchWithConfig(`/api/v1/workspaces/${workspaceId}`, {
            method: 'DELETE',
            headers: {
                'x-access-token': token
            }
        });
        return response?.data?.data;
    } catch(error) {
        console.log('Error in deleting workspace request', error);
        throw error;
    }
};

export const updateWorkspaceRequest = async ({ workspaceId, name, token}) => {
    try {
        const response = await fetchWithConfig(`/api/v1/workspaces/${workspaceId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token
            },
            body: JSON.stringify({ name })
        });
        return response?.data?.data;
    } catch(error) {
        console.log('Error in updating workspace request', error);
        throw error;
    }
};

export const addChannelToWorkspaceRequest = async ({ workspaceId, channelName, token }) => {
    try {
        const response = await fetchWithConfig(`/api/v1/workspaces/${workspaceId}/channels`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token
            },
            body: JSON.stringify({ channelName })
        });
        return response?.data?.data;
    } catch(error) {
        console.log('Error in adding channel to workspace request', error);
        throw error;
    }
};

export const resetJoinCodeRequest = async ({ workspaceId, token }) => {
    try {
        const response = await fetchWithConfig(`/api/v1/workspaces/${workspaceId}/joinCode/reset`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token
            },
            body: JSON.stringify({})
        });
        return response?.data?.data;
    } catch(error) {
        console.log('Error in resetting join code request', error);
        throw error;
    }
};

export const addMemberToWorkspaceRequest = async ({ workspaceId, token }) => {
    try {
        const response = await fetchWithConfig(`/api/v1/workspaces/${workspaceId}/members`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token
            },
            body: JSON.stringify({})
        });
        return response?.data?.data;
    } catch(error) {
        console.log('Error in adding member to workspace request', error);
        throw error;
    }
};

export const joinWorkspaceRequest = async ({ workspaceId, joinCode, token }) => {
    try {
        const response = await fetchWithConfig(`/api/v1/workspaces/${workspaceId}/join`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token
            },
            body: JSON.stringify({ joinCode })
        });
        return response?.data?.data;
    } catch(error) {
        console.log('Error in joining workspace request', error);
        throw error;
    }
};