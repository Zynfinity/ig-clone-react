import axios from 'axios';
import React, { useEffect } from 'react'
import { useState } from 'react'
import { Link, NavLink, Navigate } from 'react-router-dom';

const Search = ({ setOffSearch }) => {
    // const [query, setQuery] = useState('');
    const [users, setUsers] = useState([]);
    const [result, setResult] = useState([]);
    // useEffect(() => {
    //     const fetchAllUser = async () => {
    //         const { data } = await axios.get(`${import.meta.env.VITE_REACT_API_URL}/api/users`);
    //         setUsers(data);
    //     }
    //     fetchAllUser();
    // }, [])

    const handleSearch = (query) => {
        if (!query) return setResult([]);
        const list = users.filter(res => res.username && res.username.startsWith(query) || res.username == query || res.fullName.startsWith(query) || res.fullName == query);
        setResult(list);
    };
    return (
        <>
            <div className='fixed top-0 left-0 bg-dark w-full h-full opacity-80'></div>
            <div className='flex flex-col mx-auto justify-center items-center fixed top-0 left-0 w-full h-full'>
                <div className='flex flex-col max-w-sm items-center rounded-lg p-4 w-full bg-gray-600'>
                    <div className='flex relative max-w-sm items-center rounded-lg w-full'>
                        <input type="text" name="search" id="search" className='w-full text-white text-sm rounded-md p-2 bg-dark' onChange={(e) => handleSearch(e.target.value)} />
                        <div className='flex absolute right-0 items-center justify-center bg-gray-600 p-4 rounded-lg'>
                            <img src="/icons/Search.svg" alt="" className='w-4' />
                        </div>
                        <button onClick={setOffSearch} className='absolute -right-6 -top-6 font-semibold bg-red-400 w-6 rounded-full text-center'>X</button>
                    </div>
                    <div className='text-white mt-6 bg-dark w-full rounded-md p-2'>
                        <h3 className='font-semibold text-xs text-gray-300'>Hasil Pencarian ...</h3>
                        <div className='mt-4'>
                            {result.map((item, index) => {
                                return (
                                    <a href={`/profile/${item.id}`} key={index} className='flex px-1 py-4 gap-4 border-b border-gray-600'>
                                        <img src={item.imageUrl} alt="" className='w-10 rounded-full' />
                                        <div className='flex flex-col gap-y-1'>
                                            <h3 className='font-semibold text-sm'>{item.lastName ? item.firstName + ' ' + item.lastName : item.firstName ? item.firstName : item.username}</h3>
                                            <p className='text-xs'>10k Followers</p>
                                        </div>
                                    </a>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Search