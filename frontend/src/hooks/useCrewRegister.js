import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/authContext';
import api from '../api/axios';
import { CONFIG_JSON_LD } from '../constants/apiConstant';

export const useCrewRegister = () => {
    const navigate = useNavigate();
    const { userId, role, refreshProfile } = useAuthContext();
    const [step, setStep] = useState(1);
    const [selectedRole, setSelectedRole] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        phoneNumber: '',
        position: '',
        houseNumber: '',
        streetName: '',
        postcode: '',
        city: ''
    });

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegistration = async () => {
        setLoading(true);
        try {
            const roleRes = await api.get(`/api/roles?label=${selectedRole}`);
            const roleData = roleRes.data['member'] || roleRes.data['hydra:member'] || [];
            if (roleData.length === 0) throw new Error("Rôle non trouvé.");
            const roleIri = roleData[0]['@id'];

            const addressRes = await api.post('/api/addresses', {
                houseNumber: formData.houseNumber,
                streetName: formData.streetName,
                postcode: formData.postcode,
                city: formData.city
            }, CONFIG_JSON_LD);
            const addressIri = addressRes.data['@id'];

            await api.patch(`/api/users/${userId}`, {
                role: roleIri,
                phoneNumber: formData.phoneNumber,
                position: formData.position,
                address: addressIri
            }, {
                headers: { 'Content-Type': 'application/merge-patch+json' }
            });

            await refreshProfile();
            navigate('/crew/dashboard');
        } catch (err) {
            console.error("Registration error", err);
            alert("Erreur lors de l'inscription.");
        } finally {
            setLoading(false);
        }
    };

    return {
        step,
        setStep,
        selectedRole,
        setSelectedRole,
        formData,
        loading,
        handleFormChange,
        handleRegistration,
        role
    };
};
