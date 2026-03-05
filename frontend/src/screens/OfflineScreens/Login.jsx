import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import CustomeInput from '../../components/UI/CustomeInput';
import ErrorMessage from '../../components/UI/ErrorMessage';
import ButtonLoader from '../../components/Loader/ButtonLoader';
import { useAuthContext } from '../../contexts/authContext';

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    // On utilise signIn du nouveau contexte
    const { signIn } = useAuthContext();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true); 
        setErrorMessage('');

        try {
            if(email === '' || password === ''){
                setErrorMessage("Tous les champs doivent être remplis");
                return;
            }

            // Appel de signIn
            await signIn(email, password);
            // La redirection est gérée automatiquement par le AppRouter qui bascule sur le OnlineRouter
        } catch (error) {
            console.log(error);
            // On affiche le message d'erreur renvoyé par le contexte
            setErrorMessage(error.message);
        }finally{
            setIsLoading(false);
        }
    }
    
    return (
        <div className='flex flex-col items-center justify-center w-full min-h-[70vh] px-4 sm:px-6 py-8'>
            <div className="w-full max-w-md animate-slideup2">
                <div className="text-center mb-8">
                    <h1 className="title-h1">Connectez-vous</h1>
                    <p className="text-gray-200 mt-2 text-sm">
                        Accédez à votre bibliothèque musicale
                    </p>
                </div>
                <form 
                onSubmit={handleSubmit} 
                className="w-full rounded-2xl bg-black/60 backdrop-blur-xs border border-white/10 p-8 sm:p-10 shadow-2xl shadow-black_05">
                    <div className="space-y-1">
                        <CustomeInput 
                        label={"Email"}
                        type={"email"}
                        placeholder='votre@email.com'
                        state={email}
                        callable={(event) => setEmail(event.target.value)}
                        />
                        <CustomeInput 
                        label={"Mot de passe"}
                        type={"password"}
                        placeholder='••••••••'
                        state={password}
                        callable={(event) => setPassword(event.target.value)}
                        />
                    </div>
                    {errorMessage && <ErrorMessage message={errorMessage}/>}

                    <div className='mt-8'>
                        {isLoading ? (
                            <div className="flex justify-center py-2">
                                <ButtonLoader/>
                            </div>
                        )
                        : (
                            <button className='main-button' type="submit">
                                Se connecter
                            </button>
                        )}
                    </div>
                    <p className="mt-6 text-center text-gray-300 text-sm">
                        Pas encore de compte ?{' '}
                        <Link to="/register"
                        className='text-green font-semibold hover:text-green_top underline underline-offset-2 transition-colors'>
                            Créer un compte
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default Login;
