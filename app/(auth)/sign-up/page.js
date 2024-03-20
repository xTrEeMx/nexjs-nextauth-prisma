'use client';

import { useFormValidation } from '@/utils/core/useFormValidation';
import { useState } from 'react';
import { useAppState } from "@/utils/core/application";
import FormField from "@/components/form-field";
import Loader from "@/components/loader";
import { redirect } from "next/navigation";

export default function SignUp() {
    const { loadingStart, loadingFinish, isLoading } = useAppState();
    const [isUsernameChecking, setIsUsernameChecking] = useState(false);
    const [isEmailChecking, setIsEmailChecking] = useState(false);

    const { formData, handleChange, handleBlur, formErrors, formTouched, isFormValid, isEditing } = useFormValidation(
        {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        {
            username: async (value) => {
                if (!value) return 'Username is required.';
                if (value.trim().length <= 3) return 'Username must be at least 4 characters.';
                console.log(isEditing.username, formTouched.username);
                let userError = '';
                if (isEditing.username || formTouched.username) {
                    try {
                        setIsUsernameChecking(true);
                        const response = await fetch('/api/auth/check-username', {
                            method: 'POST',
                            body: JSON.stringify({ username: value }),
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        });
                        const data = await response.json();
                        if (!data.available) {
                            userError = 'Username is already taken';
                        }
                    } catch (error) {
                        console.error('Error checking username availability:', error);
                        return 'Error checking username availability.';
                    } finally {
                        setIsUsernameChecking(false);
                    }
                }
                return userError;
            },
            email: async (value) => {
                if (!value) return 'Email is required.';
                if (!/\S+@\S+\.\S+/.test(value)) return 'Email is invalid.';
                let emailError = '';
                if (isEditing.email || !formTouched.email) {
                    try {
                        setIsEmailChecking(true);
                        const response = await fetch('/api/auth/check-email', {
                            method: 'POST',
                            body: JSON.stringify({email: value}),
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        });
                        const data = await response.json();
                        if (!data.available) {
                            emailError = 'Email is already taken.';
                        }
                    } catch (error) {
                        console.error('Error checking email availability:', error);
                        return 'Error checking email availability.';
                    } finally {
                        setIsEmailChecking(false);
                    }
                }
                return emailError;
            },
            password: (value) => {
                if (!value) return 'Password is required.';
                const errors = [];
                if (value.trim().length < 8) errors.push('Password must be at least 8 characters.');
                if (!/(?=.*[a-z])/.test(value)) errors.push('Password must contain at least one lowercase letter.');
                if (!/(?=.*[A-Z])/.test(value)) errors.push('Password must contain at least one uppercase letter.');
                if (!/(?=.*\d)/.test(value)) errors.push('Password must contain at least one number.');
                if (!/(?=.*[@$!%*?&])/.test(value)) errors.push('Password must contain at least one special character.');
                return errors;
            },
            confirmPassword: (value) => {
                if (!value) return 'Confirm Password is required.';
                if (value !== formData.password) return 'Passwords do not match.';
                return '';
            },
        }
    );

    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid) return;
        loadingStart('sign-up');

        try {
            const response = await fetch('/api/auth/sign-up', {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            console.log(response, data);

            if (!response.ok) {
                setError(data.message);
            }

            redirect('/sign-in');
        } catch (error) {
            setError('An error occurred during sign-up');
        } finally {
            loadingFinish('sign-up');
        }
    };

    return (
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign up</h2>
            </div>

            <div className={`mt-10 sm:mx-auto sm:w-full sm:max-w-sm relative shadow-lg p-5 rounded-lg border-t-4
                ${isLoading('sign-up') ? 'border-blue-400' : Object.keys(formTouched).length === 0 ? 'border-gray-400' : !isFormValid ? 'border-red-400' : 'border-green-400'}
                `}>
                {isLoading('sign-up') && <Loader />}
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <FormField
                        id="username"
                        label="Username"
                        type="text"
                        autoComplete="username"
                        value={formData.username}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        isTouched={!formTouched.username}
                        error={formTouched.username && formErrors.username}
                        isChecking={isUsernameChecking}
                    />
                    <FormField
                        id="email"
                        label="Email"
                        type="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        isTouched={!formTouched.email}
                        error={formTouched.email && formErrors.email}
                        isChecking={isEmailChecking}
                    />
                    <FormField
                        id="password"
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                        value={formData.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        isTouched={!formTouched.password}
                        error={formTouched.password && formErrors.password}
                    />
                    <FormField
                        id="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        autoComplete="current-password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        isTouched={!formTouched.confirmPassword}
                        error={formTouched.confirmPassword && formErrors.confirmPassword}
                    />
                    <button
                        type="submit"
                        disabled={!isFormValid}
                        className={`flex w-full justify-center items-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
                            isLoading('sign-up') ? 'bg-blue-400 hover:bg-blue-500' : !isFormValid ? 'bg-gray-400 hover:bg-gray-500 cursor-not-allowed' : 'bg-green-600'
                        }`}
                    >
                        {isLoading('sign-up') ? (
                            <>
                                <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] mr-2"></div>
                                <span>Signing up...</span>
                            </>
                        ) : (!isFormValid ? (
                            <span>Please fill all fields</span>
                        ) : (
                            <span>Sign up</span>
                        ))}
                    </button>

                    {error && (
                        <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2 mx-auto">
                            {error}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
