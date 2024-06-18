import React, { useEffect, useState } from 'react'
import Footer from '../Components/Footer'
import { useUser } from '../Components/UserContext'
import { supabase } from '../Utils/supabaseClient';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import Chat from './Chat';

const Chats = () => {
    const {user} = useUser();
    const { id } = useParams();
    const [chats, setChats] = useState();
    useEffect(() => {
        const loadRoom = async() => {
            axios.post(`${import.meta.env.VITE_REACT_API_URL}/api/chat/all`, {user_id: user.id}).then(({data}) => {
                setChats(data);
            }).catch((e) => {
                console.log(e);
            })
        };
        loadRoom();
    },[id])
    return (
        <>
            <main className='flex justify-between'>
                <div className='hidden lg:block lg:w-1/2 2xl:w-1/3'></div>
                <aside className={`${id ? 'hidden lg:block' : ''} bg-dark flex flex-col items-center fixed left-0 top-0 h-full border-r border-gray-600 w-full pl-4 lg:pl-20 pr-4 pt-8 lg:max-w-96 lg:w-1/3`}>
                    <h1 className='font-semibold text-white text-2xl pb-2'>Chats</h1>
                    <hr className='border-gray-600'/>
                    <div className='flex flex-col items-center w-full mt-4 gap-2'>
                        {chats && chats.map((item, index) => {
                            const {user_1:{user_metadata: user1}, user_2:{user_metadata: user2}} = item;
                            const me = user1.id == user.id ?  user1 : user2;
                            const other = user1.id == user.id ?  user2 : user1;
                            return (
                                <Link to={`/chat/${item.id}`} key={index} className='flex gap-2 bg-slate-700 py-1 w-full rounded-full overflow-hidden'>
                                    <img src={other.avatar_url} alt="" className='w-10 rounded-full'/>
                                    <div className='w-56'>
                                        <p className='font-semibold text-white text-sm'>{other.full_name}</p>
                                        <p className='font-semibold text-gray-400 text-sm truncate ...'>{item.lastmsg && item.lastmsg[0].sender_id == user.id ? 'You : ' : ''}{item.lastmsg && item.lastmsg[0].body}</p>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </aside>
                {id && <Chat/>}
                {/* <div className='hidden lg:block lg:w-1/2 2xl:w-1/2'></div> */}
            </main>
            <Footer user={user}/>
        </>
    )
}

export default Chats