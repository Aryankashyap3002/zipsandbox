import { getProjectsUserIsMemberOf, getProjectTree } from "@/apis/projects";

/**
 * Fetches all projects and appends their corresponding tree structure.
 * Each project is returned with a `tree` field attached.
 */
export const getAllProjectsWithTrees = async () => {
    try {
        // Fetch all basic project info
        const projectsResponse = await getProjectsUserIsMemberOf();
        const projects = Array.isArray(projectsResponse?.data) ? projectsResponse.data : [];

        // Attach tree structure for each project
        const projectsWithTrees = await Promise.all(
            projects.map(async (project) => {
                try {
                    const treeResponse = await getProjectTree({ projectId: project.id });
                    const tree = treeResponse?.data || null;

                    return {
                        ...project,
                        tree,
                    };
                } catch (error) {
                    console.error(`❌ Error fetching tree for project ${project.id}:`, error);
                    return {
                        ...project,
                        tree: null,
                    };
                }
            })
        );

        return projectsWithTrees;
    } catch (error) {
        console.error("❌ Error fetching all projects with trees:", error);
        throw error;
    }
};
