import React, { useState } from 'react';
import { supabase } from '../Utils/supabaseClient';
const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const Signin = async(val) => {
        if(val == 'google'){
            await supabase.auth.signInWithOAuth({
                provider: 'google'
            })
        }else{
            await supabase.auth.signInWithOAuth({
                provider: 'github'
            })
        }
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm">
                <h2 className="text-3xl font-bold text-center text-white mb-6">Instagram</h2>
                <div className='flex justify-between gap-4 mb-4'>
                    <div onClick={() => Signin('google')} className='flex items-center gap-2 p-2 bg-[#2F3D53] rounded-lg'>
                        <img src="/icons/google.svg" alt="" className='w-5'/>
                        <p className='text-xs'>Signin With Google</p>
                    </div>
                    <div onClick={() => Signin('github')} className='flex items-center gap-2 p-2 bg-[#2F3D53] rounded-lg'>
                        <img src="/icons/google.svg" alt="" className='w-5'/>
                        <p className='text-xs'>Signin With Github</p>
                    </div>
                </div>
                {/* <form onSubmit={(e) => handleLogin(e)}>
                    <div className="mb-4">
                        <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="username">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            placeholder="Username"
                            className="w-full px-3 py-2 text-gray-900 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Password"
                            className="w-full px-3 py-2 text-gray-900 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Log In
                    </button>
                    <div className="mt-4 text-center">
                        <a href="#" className="text-sm text-blue-500 hover:text-blue-700">Forgot password?</a>
                    </div>
                </form> */}
            </div>
        </div>
    );
};

export default Login;
