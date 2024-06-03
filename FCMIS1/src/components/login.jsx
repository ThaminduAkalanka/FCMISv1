import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '../assets/logo1.png';

const Login = () => {
    const [values, setValues] = useState({
        username: '',
        password: ''
    });

    const [error, setError] = useState(null);
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:3000/auth/adminlogin', values)
            .then(result => {
                if (result.data.loginStatus) {
                    navigate('/dashboard');
                } else {
                    setError(result.data.Error);
                }
            })
            .catch(err => console.log(err));
    };

    return (
        <div className='relative flex flex-col md:flex-row justify-evenly items-center h-screen p-20 sd:p-0'>
            <div className='absolute top-8 right-8 flex space-x-4'>
                <Link to="/login/member" className="text-sm text-white hover:text-red-100">Member Login</Link>
                <Link to="/login/trainer" className="text-sm text-white hover:text-blue-100">Trainer Login</Link>
            </div>
            <div>
                <h2 className='flex justify-left font-bold text-lg pb-6'>
                    Admin Login
                </h2>
                <div className="text-red-700 text-xs">
                    {error && error}
                </div>
                <form onSubmit={handleSubmit} className='p-1'>
                    <div className='space-y-4'>
                        <div className='space-y-3'>
                            <label className='flex justify-left' htmlFor="username">Username</label>
                            <input type="text" name='username' autoComplete='off' placeholder='Enter Username'
                                onChange={(e) => setValues({ ...values, username: e.target.value })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                        </div>
                        <div className='space-y-3'>
                            <label className='flex justify-left' htmlFor="password">Password</label>
                            <input type="password" name='password' placeholder='Enter Password'
                                onChange={(e) => setValues({ ...values, password: e.target.value })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                        </div>
                        <div className='flex grid gap-4 grid-cols-2 '>
                            <div>
                                <input className='h-3 w-3' type='checkbox' name="tick" id="tick" />
                                <label className='text-xs' htmlFor="remember">Remember me</label>
                            </div>
                            <div>
                                <a className="decoration-2 hover:underline text-xs" href="#">
                                    Forgot Password
                                </a>
                            </div>
                        </div>
                        <button className="flex-1 w-full focus:outline-none text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
                            Submit
                        </button>
                    </div>
                </form>
            </div>
            <div>
                <img src={Logo} alt='image1' className='' />
            </div>
        </div>
    );
}

export default Login;
