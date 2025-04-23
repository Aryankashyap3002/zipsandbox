import { useQuery } from "@tanstack/react-query"
import { getProjectTree } from "../../../apis/projects"

export const useGetProjects = () => {
    
    const { isLoading, isError, data: projectTree, error } = useQuery({
        queryFn: () => getProjectTree(),
    });

    return {
        isLoading,
        isError,
        projectTree,
        error,
    };
}