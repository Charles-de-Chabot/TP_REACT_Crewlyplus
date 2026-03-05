import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import CustomeInput from '../../components/UI/CustomeInput';
import ErrorMessage from '../../components/UI/ErrorMessage';
import ButtonLoader from '../../components/Loader/ButtonLoader';
import { useAuthContext } from '../../contexts/authContext';
import axios from 'axios';
import { API_ROOT } from '../../constants/apiConstant';

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
    const { signIn, userId } = useAuthContext();
    

    useEffect(() => {
        if(userId){
            navigate("/");
        }
    }, [userId, navigate])

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
                const response = await axios.post(`${API_ROOT}/register`, {
                    email,
                    password,
                    firstname,
                    lastname
                })
                if(response.data?.success === false){
                    setErrorMessage(response.data.message);
                }else{
                    // Connexion automatique après inscription
                    await signIn(email, password);
                    navigate("/");
                }
            }
        } catch (error) {
            console.log(`Erreur : ${error}`);
            setErrorMessage("Erreur lors de l'inscription")
        }finally{
            setIsLoading(false);
        }
    }
    
    return (
        <div className='flex flex-col items-center justify-center w-full min-h-[70vh] px-4 sm:px-6 py-8'>
            <div className="w-full max-w-md animate-slideup2">
                <div className="text-center mb-8">
                    <h1 className="title-h1">Créez votre compte</h1>
                    <p className="text-gray-200 mt-2 text-sm">
                        Rejoignez la Platforme en quelques secondes...
                    </p>
                </div>
                <form 
                onSubmit={handleSubmit} 
                className="w-full rounded-2xl bg-black/60 backdrop-blur-xs border border-white/10 p-8 sm:p-10 shadow-2xl shadow-black_05">
                    <div className="space-y-1">
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
                        placeholder='ex: Rico'
                        state={lastname}
                        callable={(event) => setLastname(event.target.value)}
                        />
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
                        <CustomeInput 
                        label={"confirmez votre mot de passe"}
                        type={"password"}
                        placeholder='••••••••'
                        state={confirmPassword}
                        callable={(event) => setConfirmPassword(event.target.value)}
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
                                Créer un compte
                            </button>
                        )}
                    </div>
                    <p className="mt-6 text-center text-gray-300 text-sm">
                        Déja un compte ?{' '}
                        <Link to="/"
                        className='text-green font-semibold hover:text-green_top underline underline-offset-2 transition-colors'>
                            Connectez-vous
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default Register;
