// api.js
import fetchWithConfig from "@/config/fetchConfig";

export const createProjectApi = async () => {
    try {
        const data = await fetchWithConfig('/api/v1/projects', { 
            method: 'POST' 
        });
        console.log(data);
        return data;
    } catch(error) {
        console.error('Error creating project:', error);
        throw error;
    }
}

export const getProjectTree = async ({ projectId }) => {
    try {
        const data = await fetchWithConfig(`/api/v1/projects/${projectId}/tree`);
        console.log(data);
        return data?.data;
    } catch(error) {
        console.error('Error fetching project tree:', error);
        throw error;
    }
}