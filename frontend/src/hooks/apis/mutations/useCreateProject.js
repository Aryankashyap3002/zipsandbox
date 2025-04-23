// hooks/apis/mutations/useCreateProject.js
import { useMutation } from "@tanstack/react-query";
import { createProjectApi } from "@/apis/projects"; 
import { useAuth } from "@/hooks/context/useAuth";

export const useCreateProject = () => {
    const { auth } = useAuth();

    const {
        mutateAsync: createProjectMutation,
        isPending,
        isSuccess,
        error
    } = useMutation({
        mutationFn: ({ name }) => createProjectApi({ name, token: auth?.token }),
        onSuccess: (data) => {
            console.log("Project created successfully:", data);
            // Optional: trigger refetch, toast, or redirect
        },
        onError: (error) => {
            console.error("Error creating project:", error?.message || error);
            // Optional: show error toast or alert
        }
    });

    return {
        createProjectMutation,
        isPending,
        isSuccess,
        error
    };
};
