import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom';
import { useUser } from '../Components/UserContext';
import axios from 'axios';
import { supabase } from '../Utils/supabaseClient';

const Chat = () => {
    const { id } = useParams();
    const { user } = useUser();
    const messagesEndRef = useRef(null);
    const location = useLocation();
    const [messages, setMessages] = useState([]);
    const [textMsg, setTextMsg] = useState();
    const [partnerId, setPartnerId] = useState();
    const [partner, setPartner] = useState();

    const loadMsg = () => {
        axios.post(`${import.meta.env.VITE_REACT_API_URL}/api/chat`, { user_id: user.id, room_id: id }).then(({ data }) => {
            if (!Array.isArray(data) && !data.status) {
                setPartnerId(data.partnerid);
            } else {
                setPartnerId(data[0].sender_id == user.id ? data[0].receiver_id : data[0].sender_id);
                setMessages(data);
            }
            axios.post(`${import.meta.env.VITE_REACT_API_URL}/api/user/find`, { user_id: !Array.isArray(data) && !data.status ? data.partnerid : data[0].sender_id == user.id ? data[0].receiver_id : data[0].sender_id, my_id: user.id }).then(({ data: data2 }) => {
                setPartner(data2);
            }).catch((e) => {
                console.log(e);
            })
        }).catch((e) => {
            console.log(e);
        });
    };
    useEffect(() => {
        loadMsg();
        const channel = supabase
            .channel('public:messages')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chats' }, (payload) => {
                if (payload.new.room_id != id) return
                payload.new['isFromMe'] = payload.new.sender_id == user.id ? true : false;
                console.log(messages.length);
                setMessages(prevData => [...prevData, payload.new]);
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            })
            .subscribe();
    }, [id || !messages]);
    const sendMsg = () => {
        axios.post(`${import.meta.env.VITE_REACT_API_URL}/api/chat/send`, { user_id: user.id, partner_id: partnerId, room_id: id, text: textMsg }).then(({ data }) => {
        }).catch((e) => {
            console.log(e);
        });
        const newMsg = document.getElementById('new-msg');
        const newMsg2 = document.getElementById('new-msg2');
        newMsg.value = '';
        newMsg2.value = '';
    }
    return (
        <>
            <main className={`relative pt-10 w-full ${location.pathname == '/chats' || location.pathname.startsWith('/chat') ? '' : ''} lg:hidden`}>
                <nav className={`fixed top-0 bg-dark w-full border-b border-gray-600 z-10 ${location.pathname == '/chats' ? 'hidden' : ''}`}>
                    <div className="w-full p-2">
                        <div className="flex items-center">
                            <Link to='/chats' className='z-10'>
                                <img src="/icons/arrow.svg" alt="" className="-rotate-90 w-5 mr-2" />
                            </Link>
                            <div className="absolute left-0 w-full flex-grow text-center">
                                <h1 className="text-md text-white ">{partner?.user_metadata.full_name}</h1>
                            </div>
                            {/* <img onClick={showMore} src="/icons/Settings.svg" alt="" className='absolute right-2 cursor-pointer' /> */}
                        </div>
                    </div>
                </nav>
                <div className='w-full h-screen'>
                    <div className='pb-12'>
                        {messages && messages.map((item, index) => {
                            if (item.isFromMe) return (
                                <div key={index} className="chat chat-end">
                                    <div className="chat-bubble">{item.body}</div>
                                </div>
                            );
                            else return (
                                <div key={index} className="chat chat-start">
                                    <div className="chat-bubble">{item.body}</div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} className='mb-12' />
                    </div>
                    <div className={`fixed bottom-0 flex w-full gap-x-2 items-center bg-slate-700 py-2 rounded-full px-4 ${location.pathname == '/chats' ? 'hidden' : ''}`}>
                        <input id='new-msg' type="text" onChange={(e) => setTextMsg(e.target.value)} className='w-full bg-slate-700 text-sm text-white rounded-full py-1 px-2' placeholder='Type Here' autoComplete='off' />
                        <button onClick={sendMsg} className='text-sm'>Send</button>
                    </div>
                </div>
            </main>
            <main className='hidden w-2/3 lg:block lg:w-full right-0 z-10 ml-10 mr-14 2xl:mr-16'>
                <nav className={`fixed top-0 bg-dark w-[71%] border-b border-gray-600 z-10 ${location.pathname == '/chats' ? 'hidden' : ''}`}>
                    <div className="w-full p-2">
                        <div className="flex items-center">
                            <Link to='/chats' className='z-10'>
                                <img src="/icons/arrow.svg" alt="" className="-rotate-90 w-5 mr-2" />
                            </Link>
                            <div className="absolute left-0 w-full flex-grow text-center">
                                <h1 className="text-md text-white ">{partner?.user_metadata.full_name}</h1>
                            </div>
                            {/* <img onClick={showMore} src="/icons/Settings.svg" alt="" className='absolute right-2 cursor-pointer' /> */}
                        </div>
                    </div>
                </nav>
                <div className='flex w-full'>
                    <div className='pt-12 pb-12 w-full'>
                        {messages && messages.map((item, index) => {
                            if (item.isFromMe) return (
                                <div key={index} className="chat chat-end">
                                    <div className="chat-bubble">{item.body}</div>
                                </div>
                            );
                            else return (
                                <div key={index} className="chat chat-start">
                                    <div className="chat-bubble">{item.body}</div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} className='mb-12' />
                    </div>
                    <div className={`fixed bottom-0 flex justify-center items-center w-[65%] xl:w-[65%] 2xl:w-[71%] py-2 px-4 ${location.pathname == '/chats' ? 'hidden' : ''}`}>
                        <div className={`flex w-[90%] gap-x-2 items-center bg-slate-700 rounded-full py-2 px-4`}>
                            <input id='new-msg2' type="text" onChange={(e) => setTextMsg(e.target.value)} className='w-full bg-slate-700 text-sm text-white rounded-full py-1 px-2' placeholder='Type Here' autoComplete='off' />
                            <button onClick={sendMsg} className='text-sm'>Send</button>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default Chat