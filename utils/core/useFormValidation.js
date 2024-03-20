import { useState, useEffect } from 'react';

export function useFormValidation(initialState, validationRules) {
    const [formData, setFormData] = useState(initialState);
    const [formErrors, setFormErrors] = useState({});
    const [formTouched, setFormTouched] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);
    const [isEditing, setIsEditing] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;

        setIsEditing({
            ...isEditing,
            [name]: true,
        });

        setFormData({
            ...formData,
            [name]: value,
        });
        setFormTouched({
            ...formTouched,
            [name]: true,
        });
    };

    const handleBlur = (e) => {
        const { name } = e.target;

        setIsEditing({
            ...isEditing,
            [name]: false,
        });

        setFormTouched({
            ...formTouched,
            [name]: true,
        });
    };

    const runValidation = async () => {
        const newErrors = {};
        let isValid = true;

        for (const [fieldName, validationFn] of Object.entries(validationRules)) {
            const validationError = await validationFn(formData[fieldName]);
            if (validationError && validationError.length > 0) {
                newErrors[fieldName] = validationError;
                isValid = false;
            }
        }

        setFormErrors(newErrors);
        setIsFormValid(isValid);
    };

    useEffect(() => {
        runValidation().catch((error) => {
            console.log(error);
        });
    }, [formData, isEditing]);

    return {
        formData,
        handleChange,
        handleBlur,
        formErrors,
        formTouched,
        isFormValid,
        isEditing
    };
}
