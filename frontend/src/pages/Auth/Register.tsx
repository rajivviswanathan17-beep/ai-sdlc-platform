import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { register, isAuthenticated, isLoading } = useAuth();

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to=\"/dashboard\" replace />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });
    } catch (error) {
      // Error is handled in AuthContext
    }
  };

  return (
    <div className=\"min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8\">
      <div className=\"max-w-md w-full space-y-8\">
        <div>
          <h2 className=\"mt-6 text-center text-3xl font-extrabold text-gray-900\">
            Create your account
          </h2>
          <p className=\"mt-2 text-center text-sm text-gray-600\">
            Or{' '}
            <Link
              to=\"/login\"
              className=\"font-medium text-blue-600 hover:text-blue-500\"
            >
              sign in to existing account
            </Link>
          </p>
        </div>
        <form className=\"mt-8 space-y-6\" onSubmit={handleSubmit}>
          <div className=\"space-y-4\">
            <div className=\"grid grid-cols-2 gap-4\">
              <div>
                <label htmlFor=\"firstName\" className=\"label\">
                  First Name *
                </label>
                <input
                  id=\"firstName\"
                  name=\"firstName\"
                  type=\"text\"
                  required
                  className={`input ${errors.firstName ? 'input-error' : ''}`}
                  value={formData.firstName}
                  onChange={handleChange}
                />
                {errors.firstName && (
                  <p className=\"mt-1 text-sm text-red-600\">{errors.firstName}</p>
                )}
              </div>
              <div>
                <label htmlFor=\"lastName\" className=\"label\">
                  Last Name
                </label>
                <input
                  id=\"lastName\"
                  name=\"lastName\"
                  type=\"text\"
                  className=\"input\"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor=\"email\" className=\"label\">
                Email Address *
              </label>
              <input
                id=\"email\"
                name=\"email\"
                type=\"email\"
                autoComplete=\"email\"
                required
                className={`input ${errors.email ? 'input-error' : ''}`}
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className=\"mt-1 text-sm text-red-600\">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor=\"password\" className=\"label\">
                Password *
              </label>
              <input
                id=\"password\"
                name=\"password\"
                type=\"password\"
                autoComplete=\"new-password\"
                required
                className={`input ${errors.password ? 'input-error' : ''}`}
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p className=\"mt-1 text-sm text-red-600\">{errors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor=\"confirmPassword\" className=\"label\">
                Confirm Password *
              </label>
              <input
                id=\"confirmPassword\"
                name=\"confirmPassword\"
                type=\"password\"
                autoComplete=\"new-password\"
                required
                className={`input ${errors.confirmPassword ? 'input-error' : ''}`}
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && (
                <p className=\"mt-1 text-sm text-red-600\">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type=\"submit\"
              disabled={isLoading}
              className=\"btn btn-primary w-full\"
            >
              {isLoading ? (
                <div className=\"flex items-center justify-center\">
                  <div className=\"spinner w-4 h-4 border-white mr-2\"></div>
                  Creating account...
                </div>
              ) : (
                'Create account'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;