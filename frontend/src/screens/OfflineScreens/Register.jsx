import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import CustomeInput from '../../components/UI/CustomeInput';
import ErrorMessage from '../../components/UI/ErrorMessage';
import CustomeButton from '../../components/UI/CustomeButton';
import { useAuthContext } from '../../contexts/authContext';
import api from '../../api/axios';
import { URL_USERS, CONFIG_JSON_LD } from '../../constants/apiConstant';

const Register = () => {

    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    // Utilisation de signIn et userId
    const { signIn } = useAuthContext();
    

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setErrorMessage('');

        try {
            if(!firstname || !lastname || !email || !password || !confirmPassword)
                {
                setErrorMessage("Tous les champs soit obligatoires")
                return;
            }else if(password !== confirmPassword){
                setErrorMessage("Les mots de passes doivent êtres identiques");
                return;
            }else if(password.length < 4 ){
                setErrorMessage("Le mots de passe doit contenir au moins 4 caractères");
                return;
            }else{
                // Utilisation de l'instance api et du endpoint standard API Platform (/api/users)
                await api.post(URL_USERS, {
                    email,
                    password,
                    firstname,
                    lastname
                }, CONFIG_JSON_LD)
                
                // Si axios ne lance pas d'erreur, c'est que c'est un succès (201 Created)
                // Connexion automatique après inscription
                await signIn(email, password);
                navigate('/');
            }
        } catch (error) {
            console.error(error);
            
            let message = "Une erreur est survenue lors de l'inscription.";

            // Gestion améliorée pour récupérer le message exact (ex: Email déjà pris)
            if (error.response?.data?.violations && error.response.data.violations.length > 0) {
                message = error.response.data.violations[0].message;
            } else if (error.response?.data?.['hydra:description'] || error.response?.data?.detail) {
                message = error.response.data['hydra:description'] || error.response.data.detail;
            }
            setErrorMessage(message);
        }finally{
            setIsLoading(false);
        }
    }
    
    return (
        <div className='w-full max-w-2xl animate-slideup'>
            <div className="bg-slate-900/30 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl shadow-black/50">
                <div className="text-center mb-4">
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Rejoignez l'équipage</h1>
                    <p className="text-slate-400 text-sm font-light">
                        Vos plus beaux voyages vous attendent
                    </p>
                </div>
                <form 
                onSubmit={handleSubmit} 
                className="w-full">
                    <CustomeInput 
                    label={"Email"}
                    type={"email"}
                    placeholder='votre@email.com'
                    state={email}
                    callable={(event) => setEmail(event.target.value)}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                        {/* Colonne Gauche : Identité */}
                        <div>
                            <CustomeInput 
                            label={"Votre Prénom"}
                            type={"text"}
                            placeholder='ex: Eric'
                            state={firstname}
                            callable={(event) => setFirstname(event.target.value)}
                            />
                            <CustomeInput 
                            label={"Votre nom de famille"}
                            type={"text"}
                            placeholder='ex: Tabarly'
                            state={lastname}
                            callable={(event) => setLastname(event.target.value)}
                            />
                        </div>

                        {/* Colonne Droite : Sécurité */}
                        <div>
                            <CustomeInput 
                            label={"Mot de passe"}
                            type={"password"}
                            placeholder='••••••••'
                            state={password}
                            callable={(event) => setPassword(event.target.value)}
                            />
                            <CustomeInput 
                            label={"confirmez votre mot de passe"}
                            type={"password"}
                            placeholder='••••••••'
                            state={confirmPassword}
                            callable={(event) => setConfirmPassword(event.target.value)}
                            />
                        </div>
                    </div>
                    {errorMessage && <ErrorMessage message={errorMessage}/>}

                    <div className='mt-5'>
                        <CustomeButton type="submit" isLoading={isLoading}>
                            Créer un compte
                        </CustomeButton>
                    </div>
                    <p className="mt-4 text-center text-slate-500 text-xs font-medium uppercase tracking-wider">
                        Déja un compte ?{' '}
                        <Link to="/login"
                        className='text-teal-400 hover:text-teal-300 ml-1 transition-colors duration-200 underline decoration-teal-500/30 underline-offset-4'>
                            Connectez-vous
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default Register;
