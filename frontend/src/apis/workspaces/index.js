import fetchWithConfig from '@/config/fetchConfig';

export const createWorkspaceRequest = async ({ name, description, token }) => {
    try {
        const response = await fetchWithConfig('/api/v1/workspaces', {
            method: 'POST',
            headers: {
                'x-access-token': token
            },
            body: JSON.stringify({ name, description })
        });
        return response?.data;
    } catch(error) {
        console.error('Error in create workspace request', error);
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
        console.error('Error in fetching workspace request', error);
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
        return response?.data;
    } catch(error) {
        console.error('Error in fetching workspace details request', error);
        throw error;
    }
};

export const deleteWorkspaceRequest = async ({ workspaceId, token }) => {
    try {
        const response = await fetchWithConfig(`/api/v1/workspaces/${workspaceId}`, {
            method: 'DELETE',
            headers: {
                'x-access-token': token
            }
        });
        return response?.data;
    } catch(error) {
        console.error('Error in deleting workspace request', error);
        throw error;
    }
};

export const updateWorkspaceRequest = async ({ workspaceId, name, token }) => {
    try {
        const response = await fetchWithConfig(`/workspaces/${workspaceId}`, {
            method: 'PUT',
            headers: {
                'x-access-token': token
            },
            body: JSON.stringify({ name })
        });
        return response?.data;
    } catch(error) {
        console.error('Error in updating workspace request', error);
        throw error;
    }
};

export const addChannelToWorkspaceRequest = async ({ workspaceId, channelName, token }) => {
    try {
        const response = await fetchWithConfig(`/api/v1/workspaces/${workspaceId}/channels`, {
            method: 'PUT',
            headers: {
                'x-access-token': token
            },
            body: JSON.stringify({ channelName })
        });
        return response?.data;
    } catch(error) {
        console.error('Error in adding channel to workspace request', error);
        throw error;
    }
};

export const resetJoinCodeRequest = async ({ workspaceId, token }) => {
    try {
        const response = await fetchWithConfig(`/api/v1/workspaces/${workspaceId}/joinCode/reset`, {
            method: 'PUT',
            headers: {
                'x-access-token': token
            },
            body: JSON.stringify({})
        });
        return response?.data;
    } catch(error) {
        console.error('Error in resetting join code request', error);
        throw error;
    }
};

export const addMemberToWorkspaceRequest = async ({ workspaceId, token }) => {
    try {
        const response = await fetchWithConfig(`/api/v1/workspaces/${workspaceId}/members`, {
            method: 'PUT',
            headers: {
                'x-access-token': token
            },
            body: JSON.stringify({})
        });
        return response?.data;
    } catch(error) {
        console.error('Error in adding member to workspace request', error);
        throw error;
    }
};

export const joinWorkspaceRequest = async ({ workspaceId, joinCode, token }) => {
    try {
        const response = await fetchWithConfig(`/api/v1/workspaces/${workspaceId}/join`, {
            method: 'PUT',
            headers: {
                'x-access-token': token
            },
            body: JSON.stringify({ joinCode })
        });
        return response?.data;
    } catch(error) {
        console.error('Error in joining workspace request', error);
        throw error;
    }
};