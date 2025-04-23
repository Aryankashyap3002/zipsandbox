import { useMutation } from '@tanstack/react-query';
 import { toast } from 'sonner';

 import { signInRequest } from '@/apis/auth';
 import { useAuth } from '@/hooks/context/useAuth';
 
 import { useNavigate } from 'react-router-dom';

export const useSignin = () => {
    const { setAuth } = useAuth();
    const navigate = useNavigate(); // Navigate to redirect after login
    const { isPending, isSuccess, error, mutateAsync: signinMutation } = useMutation({
        mutationFn: signInRequest,
        onSuccess: (response) => {
            console.log('Successfully signed in', response);

            const userObject = JSON.stringify(response.data);

            localStorage.setItem('user', userObject);
            localStorage.setItem('token', response.data.token);

            setAuth({
                token: response.data.token,
                user: response.data,
                isLoading: false
            });

            toast.success('Successfully signed up', {
                style: { 
                    textAlign: 'center',
                    color: 'white',
                    backgroundColor: '#129903',
                },
                description: 'You will be redirected to the login page in a few seconds',
                descriptionStyle: { color: 'black' }
            });

            // Redirect to the dashboard or home after login
            navigate('/'); // Redirect to home page or another route
        },
        onError: (error) => {
            console.error('Failed to sign in', error);
            toast.error('Failed to sign in', {
                description: error.message,
                style: { backgroundColor: '#dc2626', color: 'white', textAlign: 'center' },
            });
        }
    });

    return {
        isPending,
        isSuccess,
        error,
        signinMutation
    };
};
