import axios from 'axios';

interface ContactFormData {
    name: string;
    email: string;
    comment: string;
}

export const ContactService = {
    submitContactForm: async (formData: ContactFormData) => {
        try {
            const response = await axios.post('http://localhost:8082/api/v1/contactus/create', formData);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};