import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import CustomeInput from '../../components/UI/CustomeInput';
import ErrorMessage from '../../components/UI/ErrorMessage';
import CustomeButton from '../../components/UI/CustomeButton';
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
            // On affiche le message d'erreur renvoyé par le contexte
            setErrorMessage(error.message);
        }finally{
            setIsLoading(false);
        }
    }
    
    return (
        <div className='w-full max-w-md animate-slideup'>
            <div className="bg-slate-900/30 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl shadow-black/50">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Bon retour à bord</h1>
                    <p className="text-slate-400 text-sm font-light">
                        Accédez a notre flotte et a votre espace personnelle.
                    </p>
                </div>
                <form 
                onSubmit={handleSubmit} 
                className="w-full">
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

                    <div className='mt-6'>
                        <CustomeButton type="submit" isLoading={isLoading}>
                            Se connecter
                        </CustomeButton>
                    </div>
                    <p className="mt-6 text-center text-slate-500 text-xs font-medium uppercase tracking-wider">
                        Pas encore de compte ?{' '}
                        <Link to="/register"
                        className='text-teal-400 hover:text-teal-300 ml-1 transition-colors duration-200 underline decoration-teal-500/30 underline-offset-4'>
                            Créer un compte
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default Login;
