import Swal from 'sweetalert2';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Formik } from 'formik';
import { useNavigate } from 'react-router-dom';

const url = import.meta.env.VITE_BACKEND_URL;

const SignUp = () => {
    const navigate = useNavigate();
    return (
        <div className="font-opensans flex items-center justify-center md:flex-row min-h-screen bg-white">
            <div className="flex items-center justify-center w-full md:w-1/2 px-6 py-8">
                <div className="w-full max-w-md">
                    <h1 className="text-4xl font-bold text-center mb-2 text-black">Sign-Up</h1>
                    <h4 className="font-bold text-center text-black">Kanban board</h4>
                    <Formik
                        initialValues={{ username: '', email: '', password: '' }}
                        validate={(values) => {
                            const errors: any = {};
                            const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/;
                            if (!values.username) {
                                errors.username = 'Required';
                            } else if (values.username.length <= 2 || values.username.length >= 20) {
                                errors.username = 'Must be more than 2 characters and less than 20 characters';
                            }
                            if (!values.email) {
                                errors.email = 'Required';
                            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
                                errors.email = 'Invalid email address';
                            }
                            if (!values.password) {
                                errors.password = 'Required';
                            } else if (!passwordRegex.test(values.password)) {
                                errors.password =
                                    'Password must be at least 6 characters, include at least one special character and one number';
                            }
                            return errors;
                        }}
                        onSubmit={async (values, { setSubmitting }) => {
                            try {
                                const { data } = await axios.post(
                                    `${url}/signup`,
                                    {
                                        email: values.email,
                                        password: values.password,
                                        username: values.username,
                                    },
                                    { withCredentials: true }
                                );
                                const { success, message, token } = data;
                                Cookies.set('token', token, { expires: 1, secure: true, sameSite: 'None' });
                                if (success) {
                                    Swal.fire({
                                        title: 'Good Job!',
                                        text: 'Signup successful! Welcome to Kanban Board',
                                        icon: 'success',
                                    });
                                    setTimeout(() => {
                                        navigate('/');
                                    }, 1000);
                                } else {
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Oops...',
                                        text: message,
                                    });
                                }
                            } catch (error: any) {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Oops...',
                                    text: error.response?.data?.message || 'An error occurred. Please try again later.',
                                });
                            } finally {
                                setSubmitting(false);
                            }
                        }}
                    >
                        {({
                            values,
                            errors,
                            touched,
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            isSubmitting,
                        }) => (
                            <form
                                onSubmit={handleSubmit}
                                className="bg-white text-gray-600 shadow-lg rounded-lg p-6 w-full"
                            >
                                <div className="mb-4">
                                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                        Username
                                    </label>
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        placeholder="Enter your username"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.username}
                                        className={`mt-1 block w-full rounded-md border ${touched.username && errors.username ? 'border-red-500' : 'border-gray-300'
                                            } p-2`}
                                    />
                                    {touched.username && errors.username && (
                                        <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                                    )}
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.email}
                                        className={`mt-1 block w-full rounded-md border ${touched.email && errors.email ? 'border-red-500' : 'border-gray-300'
                                            } p-2`}
                                    />
                                    {touched.email && errors.email && (
                                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                    )}
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="Enter your password"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.password}
                                        className={`mt-1 block w-full rounded-md border ${touched.password && errors.password ? 'border-red-500' : 'border-gray-300'
                                            } p-2`}
                                    />
                                    {touched.password && errors.password && (
                                        <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                                    )}
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-lime-600 hover:bg-lime-700 text-white py-2 rounded-md"
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit'}
                                </button>
                            </form>
                        )}
                    </Formik>

                    <div className="mt-4 text-center">
                        <p className='text-gray-600'>
                            Already a user?{' '}
                            <a className="text-lime-500 hover:underline" href="/login">
                                Login here
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
