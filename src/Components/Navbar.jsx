import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

const Navbar = (props) => {
    const [users, setUsers] = useState([]);
    const [result, setResult] = useState([]);
    useEffect(() => {
        try {
            const input = document.getElementById('search');
            const result = document.getElementById('result');
            const remove = document.getElementById('remove');
            const fetchAllUser = async () => {
                const { data } = await axios.post(`${import.meta.env.VITE_REACT_API_URL}/api/user/all`, { user_id: props.user.id });
                setUsers(data);
                
            }
            input.addEventListener('focus', function () {
                result.classList.remove('hidden');
                if (users.length == 0) fetchAllUser();
            })
            input.addEventListener('blur', function () {
                if (input.value) return;
                result.classList.add('hidden');
            })
            input.addEventListener('input', function () {
                if (input.value) remove.classList.remove('hidden');
                else remove.classList.add('hidden');
            })
        } catch { }
    }, [])

    const handleSearch = (query) => {
        if (!query) return setResult([]);
        const list = users.filter(res => (res.user_metadata.user_name && res.user_metadata.user_name.startsWith(query)) || (res.user_metadata.full_name && res.user_metadata.full_name.startsWith(query)));
        setResult(list);
    };
    const removeQuery = () => {
        const remove = document.getElementById('remove');
        const input = document.getElementById('search');
        const result = document.getElementById('result');
        input.value = '';
        remove.classList.add('hidden');
        result.classList.add('hidden');
    }
    return (
        <>
            <nav className="fixed top-0 left-0 w-full bg-dark z-10">
                <div className="mx-auto w-full max-w-xs py-1 lg:max-w-md">
                    <div className='relative w-full flex items-center py-2'>
                        {/* <h1 className='font-semibold text-white text-xl'>Instagram</h1> */}
                        {/* <img src="/icons/arrow.svg" alt="arrow" className='rotate-180' /> */}
                        <input type="text" name="search" id="search" placeholder='Search' autoComplete="off" onChange={(e) => handleSearch(e.target.value)} className='text-white text-sm mx-auto bg-dark w-full border border-gray-600 py-2 px-2 rounded-xl ' />
                        <div id='remove' onClick={removeQuery} className='hidden absolute right-0 text-white text-sm bg-gray-700 p-2 px-4 rounded-r-xl'>X</div>
                        {/* <div className='inline-flex max-w-xs gap-4'>
                        <img src="/icons/newpost.svg" alt="newpost" />
                        <input type="text" name="search" id="search" placeholder='Search' className='w-full max-w-xs py-1 px-2 rounded-md bg-gray-600' />
                        <img src="/icons/Notifications.svg" alt="newpost" />
                    </div> */}
                    </div>

                </div>
            </nav >
            <div id='result' className='hidden fixed left-0 w-full'>
                <div id='blur' className='fixed flex w-full h-full bg-dark opacity-80 -z-10'></div>
                {result.length > 0 &&
                    <div className='text-white mt-16 bg-gray-700 w-full rounded-xl p-2 max-w-xs mx-auto lg:max-w-md'>
                        <h3 className='font-semibold text-xs text-gray-300'>Hasil Pencarian ...</h3>
                        <div className='mt-4'>
                            {result.map((item, index) => {
                                return (
                                    <Link to={`/profile/${item.id}`} key={index} className='flex px-1 py-4 gap-4 border-b border-gray-600'>
                                        <img src={`${import.meta.env.VITE_REACT_API_URL}/proxy?url=${item.user_metadata.avatar_url}`} alt="" className='w-10 rounded-full' />
                                        <div className='flex flex-col gap-y-1'>
                                            <h3 className='font-semibold text-sm'>{item.user_metadata.full_name}</h3>
                                            <p className='text-xs'>10k Followers</p>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                }
            </div>
        </>
    )
}

export default Navbar