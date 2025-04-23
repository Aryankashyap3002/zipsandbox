// src/api/projectApi.js
import fetchWithConfig from "@/config/fetchConfig";

// Create a new project
export const createProjectApi = async ({ name, token }) => {
    try {
        const response = await fetchWithConfig('/api/v1/projects', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token
            },
            body: JSON.stringify({ name })
        });
        console.log('Project created:', response?.data);
        return response?.data;
    } catch (error) {
        console.error('Error creating project:', error);
        throw error;
    }
};

// Get all projects the authenticated user is a member of
export const getProjectsUserIsMemberOf = async (token) => {
    try {
        const data = await fetchWithConfig('/api/v1/projects', {
            method: 'GET',
            headers: {
                'x-access-token': token
            }
        });
        console.log("User projects:", data);
        return data?.data;
    } catch (error) {
        console.error('Error fetching user projects:', error);
        throw error;
    }
};

// Get projects by workspace ID
export const getProjectsByWorkspace = async ({ workspaceId, token }) => {
    try {
        const data = await fetchWithConfig(`/api/v1/projects/workspace/${workspaceId}`, {
            method: 'GET',
            headers: {
                'x-access-token': token
            }
        });
        return data?.data;
    } catch (error) {
        console.error('Error fetching workspace projects:', error);
        throw error;
    }
};

// Get project details by ID
export const getProjectById = async ({ projectId, token }) => {
    try {
        const data = await fetchWithConfig(`/api/v1/projects/${projectId}`, {
            method: 'GET',
            headers: {
                'x-access-token': token
            }
        });
        return data?.data;
    } catch (error) {
        console.error('Error fetching project:', error);
        throw error;
    }
};

// Update project details
export const updateProject = async ({ projectId, updatedData, token }) => {
    try {
        const response = await fetchWithConfig(`/api/v1/projects/${projectId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token
            },
            body: JSON.stringify(updatedData)
        });
        return response?.data;
    } catch (error) {
        console.error('Error updating project:', error);
        throw error;
    }
};

// Delete (soft delete) a project
export const deleteProject = async ({ projectId, token }) => {
    try {
        const response = await fetchWithConfig(`/api/v1/projects/${projectId}`, {
            method: 'DELETE',
            headers: {
                'x-access-token': token
            }
        });
        return response?.data;
    } catch (error) {
        console.error('Error deleting project:', error);
        throw error;
    }
};

// Archive a project
export const archiveProject = async ({ projectId, token }) => {
    try {
        const response = await fetchWithConfig(`/api/v1/projects/${projectId}/archive`, {
            method: 'PUT',
            headers: {
                'x-access-token': token
            }
        });
        return response?.data;
    } catch (error) {
        console.error('Error archiving project:', error);
        throw error;
    }
};

// Reactivate an archived project
export const reactivateProject = async ({ projectId, token }) => {
    try {
        const response = await fetchWithConfig(`/api/v1/projects/${projectId}/reactivate`, {
            method: 'PUT',
            headers: {
                'x-access-token': token
            }
        });
        return response?.data;
    } catch (error) {
        console.error('Error reactivating project:', error);
        throw error;
    }
};

// Add a member to a project
export const addMemberToProject = async ({ projectId, memberData, token }) => {
    try {
        const response = await fetchWithConfig(`/api/v1/projects/${projectId}/members`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token
            },
            body: JSON.stringify(memberData)
        });
        return response?.data;
    } catch (error) {
        console.error('Error adding member to project:', error);
        throw error;
    }
};

// Get project file tree
export const getProjectTree = async ({ projectId, token }) => {
    try {
        const data = await fetchWithConfig(`/api/v1/projects/${projectId}/tree`, {
            method: 'GET',
            headers: {
                'x-access-token': token
            }
        });
        console.log('Project file tree:', data);
        return data?.data;
    } catch (error) {
        console.error('Error fetching project tree:', error);
        throw error;
    }
};
