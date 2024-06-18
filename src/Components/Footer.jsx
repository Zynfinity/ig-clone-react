import axios from 'axios';
import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import NewPost from './NewPost';
import Alert from './Alert';
import { useUser } from './UserContext';
import { supabase } from '../Utils/supabaseClient';

const Footer = (props) => {
    const {user, id, idpost} = props;
    const {user_metadata: User} = user;
    const navigate = useNavigate();
    const location = useLocation();
    const [preview, setPreview] = useState(null);
    const [image, setImage] = useState(null);
    const [post, setPost] = useState(false);
    useEffect(() => {
        const fileInput = document.getElementById('fileInput');
        if (id) {
            const profile = document.getElementById('profile');
            profile.classList.remove('active');
        }
    }, [])

    const handleActive = () => {
        const more = document.getElementById('more-button');
        const menu = document.getElementById('menu');
        more.classList.contains('active') ? more.classList.remove('active') : more.classList.add('active');
        menu.classList.contains('hidden') ? menu.classList.remove('hidden') : menu.classList.add('hidden');
    };
    const handleLogout = async () => {
        try {
            await supabase.auth.signOut();
            navigate('/login');
        } catch (e) {
            console.log(e)
        }
    }
    const setPostOff = () => {
        setPost(false);
    }
    const newPost = () => {
        const fileInput = document.getElementById('inputFile');
        fileInput.addEventListener('change', function () {
            const file = this.files[0];
            setPost(true);
            setImage(file);
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreview(reader.result);
                };
                reader.readAsDataURL(file);
            };
        })
        fileInput.click();
    }

    return (
        <>
            {/* <Alert pesan={'asu'} /> */}
            {post && <NewPost setPostOff={setPostOff} preview={preview} image={image} user={user} />}
            <footer className={`${id && idpost ? 'hidden lg:block' : ''} fixed bottom-0 w-full bg-dark md:left-0 md:top-0 md:w-fit md:border-r md:border-gray-600 ${location.pathname == '/chats' || location.pathname.startsWith('/chat') ? 'hidden lg:block' : 'xl:w-full xl:max-w-64'}`}>
                <div className="md:h-full">
                    <div className="h-full w-full p-1">
                        <div className='hidden mt-8 mb-14 md:block xl:flex xl:gap-x-2 xl:px-4'>
                            <img src="/icons/Instagram.svg" alt="" className='mx-auto w-5 xl:mx-0' />
                            <h2 className={`hidden font-semibold text-xl text-white ${location.pathname == '/chats' || location.pathname.startsWith('/chat') ? '' : 'xl:block'}`}>Instagram</h2>
                        </div>
                        <input type="file" accept='image/*' hidden id='inputFile' />
                        <div className="relative p-1 grid grid-cols-6 md:grid-cols-1 md:p-2 md:grid-rows-6 md:gap-4">
                            <NavLink to="/" className={`flex group justify-center lg:justify-start lg:gap-x-2 p-2 rounded-lg hover:bg-gray-600 hover:transition-all ease-in-out-600 cursor-pointer`}>
                                <img src="/icons/Home.svg" alt="" className='w-5' />
                                <h2 className={`hidden font-semibold text-sm text-white ${location.pathname == '/chats' || location.pathname.startsWith('/chat') ? '' : 'xl:block'}`}>Home</h2>
                            </NavLink>
                            {/* <div onClick={() => search ? setSearch(false) : setSearch(true)} className='hidden md:flex justify-center lg:justify-start lg:gap-x-2 p-2 rounded-lg hover:bg-gray-600 hover:transition-all ease-in-out-600 cursor-pointer'>
                                <img src="/icons/Search.svg" alt="" className='w-5' />
                                <h2 className={`hidden font-semibold text-sm text-white ${location.pathname == '/chats' || location.pathname.startsWith('/chat') ? '' : 'xl:block'}`}>Search</h2>
                            </div> */}
                            <div className='flex justify-center lg:justify-start lg:gap-x-2 p-2 rounded-lg hover:bg-gray-600 hover:transition-all ease-in-out-600 cursor-pointer'>
                                <img src="/icons/Explore.svg" alt="" className='w-5' />
                                <h2 className={`hidden font-semibold text-sm text-white ${location.pathname == '/chats' || location.pathname.startsWith('/chat') ? '' : 'xl:block'}`}>Explore</h2>
                            </div>
                            <div className='flex justify-center lg:justify-start lg:gap-x-2 p-2 rounded-lg hover:bg-gray-600 hover:transition-all ease-in-out-600 cursor-pointer'>
                                <img src="/icons/Reels.svg" alt="" className='w-5' />
                                <h2 className={`hidden font-semibold text-sm text-white ${location.pathname == '/chats' || location.pathname.startsWith('/chat') ? '' : 'xl:block'}`}>Reels</h2>
                            </div>
                            <div onClick={() => newPost()} className='flex justify-center lg:justify-start lg:gap-x-2 p-2 rounded-lg hover:bg-gray-600 hover:transition-all ease-in-out-600 cursor-pointer'>
                                <img src="/icons/newpost.svg" alt="" className='w-5' />
                                <h2 className={`hidden font-semibold text-sm text-white ${location.pathname == '/chats' || location.pathname.startsWith('/chat') ? '' : 'xl:block'}`}>New Post</h2>
                            </div>
                            <NavLink to='/chats' className='flex justify-center lg:justify-start lg:gap-x-2 p-2 rounded-lg hover:bg-gray-600 hover:transition-all ease-in-out-600 cursor-pointer'>
                                <img src="/icons/Messenger.svg" alt="" className='w-5' />
                                <h2 className={`hidden font-semibold text-sm text-white ${location.pathname == '/chats' || location.pathname.startsWith('/chat') ? '' : 'xl:block'}`}>Message</h2>
                            </NavLink>
                            <NavLink id="profile" to="/profile" className='flex justify-center lg:justify-start lg:gap-x-2 p-2 rounded-lg hover:bg-gray-600 hover:transition-all ease-in-out-600 cursor-pointer'>
                                <img src={`${import.meta.env.VITE_REACT_API_URL}/proxy?url=${User.avatar_url}`} alt="" className='w-5 rounded-full' />
                                <h2 className={`hidden font-semibold text-sm text-white ${location.pathname == '/chats' || location.pathname.startsWith('/chat') ? '' : 'xl:block'}`}>Profile</h2>
                            </NavLink>
                            <button id="more-button" type="button" onClick={(e) => handleActive(e)} className={`hidden ${location.pathname == '/chats' || location.pathname.startsWith('/chat') ? '' : 'xl:flex'} justify-center items-center lg:justify-start lg:gap-x-2 p-2 rounded-lg mt-60 mb-6 hover:bg-gray-600 hover:transition-all ease-in-out-600 cursor-pointer`}>
                                <img src="/icons/Settings.svg" alt="" className='w-5'/>
                                <h2 className='hidden font-semibold text-sm text-white xl:block'>More</h2>
                            </button>
                            <div id="menu" className="hidden absolute flex-col bg-gray-700 text-white bottom-20 left-2 w-60 rounded-lg transition ease-in-out">
                                {/* <!-- Active: "bg-gray-100", Not Active: "" --> */}
                                <a href="#" className="block px-4 py-4 text-sm text-white rounded-lg hover:bg-gray-600" role="menuitem" id="user-menu-item-0">Settings</a>
                                <a href="#" className="block px-4 py-4 text-sm text-white rounded-lg hover:bg-gray-600" role="menuitem" id="user-menu-item-1">Saved</a>
                                {/* <UserButton /> */}
                                <button onClick={(e) => handleLogout(e)} className="block w-full text-left px-4 py-4 text-sm text-white rounded-lg hover:bg-gray-600" role="menuitem" id="user-menu-item-2">Logout</button>
                            </div>
                        </div>
                    </div>
                    {/* <div x-data="{false}" className='hidden absolute md:left-1/2 md:translate-x-[-50%] bottom-[5%] md:block xl:flex xl:gap-x-2 xl:left-16 hover:bg-gray-600'>
                    <img src="/icons/Settings.svg" alt="" />
                    <h2 className='hidden font-semibold text-md text-white xl:block'>More</h2>
                </div> */}
                </div>
                {/* <!--
            Dropdown menu, show/hide based on menu state.

            Entering: "transition ease-out duration-100"
            From: "transform opacity-0 scale-95"
            To: "transform opacity-100 scale-100"
            Leaving: "transition ease-in duration-75"
            From: "transform opacity-100 scale-100"
            To: "transform opacity-0 scale-95"
          --> */}

            </footer >
        </>
    )
}

export default Footer