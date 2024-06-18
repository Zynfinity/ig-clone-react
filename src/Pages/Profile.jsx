import React, { useEffect, useState } from 'react'
import Footer from '../Components/Footer';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import Loading from '../Components/Loading';
import axios from 'axios';
import { useUser } from '../Components/UserContext';

const Profile = (props) => {
    const { id } = useParams();
    const {user, loading: load} = useUser();
    const Navigate = useNavigate();
    const [userData, setUserData] = useState({});
    const {user_metadata: User} = userData;
    const [loading, setLoading] = useState(false);
    document.title = props.title;
    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        
        const fetchUser = async () => {
            setLoading(true);
            try {
                const { data } = await axios.post(`${import.meta.env.VITE_REACT_API_URL}/api/user/find`, { user_id: id ? id : user.id, my_id: user.id }, {signal});
                setUserData(data);
            } catch (e) {
                setUserData('');
            } finally {
                setLoading(false);
            }
        }
        if(id) fetchUser();
        else setUserData(user);
        return () => {
            controller.abort();
        }
    }, []);
    const follow = () => {
        const fbutton = document.getElementById('follow-button');
        axios.post(`${import.meta.env.VITE_REACT_API_URL}/api/user/follow`, { followed_id: userData.id && userData.id, follower_id: user.id, action: User.isFollowing ? 'unfollow' : 'follow' }).then(({ data }) => {
            if (User?.isFollowed) {
                fbutton.innerText = 'Follow';
                User.isFollowing = false;
            } else {
                User.isFollower = true;
                fbutton.innerText = 'Followed';
            };
        }).catch = (e) => {
            console.log(e);
        }
    };

const createRoom = () => {
    axios.post(`${import.meta.env.VITE_REACT_API_URL}/api/chat/new`, {user1: user.id, user2:id}).then(({data}) => {
        console.log(data);
        if(data.id) Navigate(`/chat/${data.id}`);
    }).catch((e) => {
        console.log(e);
    })
}

    if (loading || load || !User?.avatar_url) return <Loading />
    const showMore = () => {
        const menu = document.getElementById('menu2');
        if (menu.classList.contains('hidden')) menu.classList.remove('hidden');
        else menu.classList.add('hidden');
    }
    const handleLogout = async () => {
        try {
            signOut();
            Navigate('/login');
        } catch (e) {
            console.log(e)
        }
    }
    return (
        <>
            {/* <Alert pesan={'Post sudah dikirim!'} /> */}
            <div className='bg-dark md:pl-28 md:pr-10 xl:ml-64 animate__animated animate__fadeIn'>
                <div id="menu2" className="hidden absolute flex-col bg-gray-700 text-white top-12 right-2 w-60 rounded-lg transition ease-in-out">
                    {/* <!-- Active: "bg-gray-100", Not Active: "" --> */}
                    <a href="#" className="block px-4 py-4 text-sm text-white rounded-lg hover:bg-gray-600" role="menuitem" id="user-menu-item-0">Settings</a>
                    <a href="#" className="block px-4 py-4 text-sm text-white rounded-lg hover:bg-gray-600" role="menuitem" id="user-menu-item-1">Saved</a>
                    {/* <UserButton /> */}
                    <button onClick={(e) => handleLogout(e)} className="block w-full text-left px-4 py-4 text-sm text-white rounded-lg hover:bg-gray-600" role="menuitem" id="user-menu-item-2">Logout</button>
                </div>
                <nav className='fixed bg-dark w-full border-b border-gray-600 md:hidden'>
                    <div className="w-full p-2">
                        <div className="flex items-center">
                            <img src="/icons/arrow.svg" alt="" className="-rotate-90 w-6 mr-2" />
                            <div className="absolute left-0 w-full flex-grow text-center">
                                <h1 className="text-md text-white ">{User?.full_name}</h1>
                            </div>
                            <img onClick={showMore} src="/icons/Settings.svg" alt="" className='absolute right-2 cursor-pointer' />
                        </div>
                    </div>
                </nav>

                <main className='pt-16 pb-20 container max-w-6xl w-full '>
                    <div className="w-full">
                        {/* Header */}
                        <div className="flex flex-col">
                            <div className='flex gap-x-6'>
                                <div className='p-0.5 rounded-full border border-blue-400'>
                                    <img src={`${import.meta.env.VITE_REACT_API_URL}/proxy?url=${User?.avatar_url}`} alt="" className='w-20 md:w-full md:max-w-40 max-w-sm mx-auto rounded-full' loading='lazy' />

                                </div>
                                <div className='flex flex-col md:h-fit'>
                                    <div className='flex flex-col gap-4 md:flex-row'>
                                        <h3 className='text-lg text-white flex gap-2'>{User ? User.user_name : 'Account Not Found'} <img src="/icons/Verified.svg" alt="" className='w-4' /></h3>
                                        {id && <div className='flex gap-x-4'>
                                            <button onClick={() => follow()} id='follow-button' className='font-semibold text-sm text-white tracking-wide w-fit bg-gray-600 py-1 px-2 rounded-md'>{User?.isFollowing ? 'Followed' : 'Follow'}</button>
                                            <button onClick={() => createRoom()} className='font-semibold text-sm text-white tracking-wide w-fit bg-gray-600 py-1 px-2 rounded-md'>Message</button>
                                        </div>}
                                    </div>
                                    <div className='hidden gap-6 max-w-lg mx-auto mt-4 w-full md:flex'>
                                        <p className='text-sm text-gray-400'><span className='font-semibold text-white'>{User?.posts ? User?.posts?.length : 0}</span> Posts</p>
                                        <p className='text-sm text-gray-400'><span className='font-semibold text-white'>{User?.followers ? User?.followers.length : 0}</span> Followers</p>
                                        <p className='text-sm text-gray-400'><span className='font-semibold text-white'>{User?.followings ? User?.followings.length : 0}</span> Following</p>
                                    </div>
                                </div>

                            </div>
                            <div>
                                {/* <h1 className='font-semibold text-sm text-white tracking-widest mt-4'>{userData ? userData.user_metadata.full_name : 'Account not Found'}</h1> username */}
                                {/* <p className='text-sm text-white mt-2'>Home of risk takers, late brakers and history makers 💫 <br /> NEXT UP: MONACO 🇲🇨 24-26 MAY</p> */}
                                {/* <p className='text-xs text-gray-400 mt-2'>Followed by <span className='font-bold'>maxverstappen1</span>, + 1 more</p> */}
                            </div>
                            <div className='pt-4 pb-4 border-b border-gray-600 md:hidden'>
                                <div className='max-w-lg mx-auto w-full grid grid-cols-3'>
                                    <p className='text-sm text-gray-400 text-center'><span className='font-semibold text-white'>{User?.posts ? User.posts.length : 0}</span><br />Posts</p>
                                    <p className='text-sm text-gray-400 text-center'><span className='font-semibold text-white'>{User?.follower ? User?.follower.length : 0}</span><br />Followers</p>
                                    <p className='text-sm text-gray-400 text-center'><span className='font-semibold text-white'>{User?.followed ? User?.followed.length : 0}</span><br />Following</p>
                                </div>
                            </div>
                            <div className='pt-4 pb-4'>
                                <div className='max-w-lg mx-auto w-full grid grid-cols-3'>
                                    <div className='flex justify-center items-center gap-1'>
                                        <img src="/icons/Posts.svg" alt="" className='md:w-4' />
                                        <p className='hidden font-semibold text-sm text-white md:block'>POSTS</p>
                                    </div>
                                    <div className='flex justify-center items-center gap-1'>
                                        <img src="/icons/Reels.svg" alt="" className='md:w-4' />
                                        <p className='hidden font-semibold text-sm text-white md:block'>REELS</p>
                                    </div>
                                    <div className='flex justify-center items-center gap-1'>
                                        <img src="/icons/Tagged.svg" alt="" className='md:w-4' />
                                        <p className='hidden font-semibold text-sm text-white md:block'>TAGGED</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* End Header */}

                        {/* Posts */}
                        <div className="w-full">
                            <div className="grid grid-cols-3 gap-2 p-2">
                                {User?.posts && User.posts.map((item, index) => {
                                    return (<Link to={`/post/${item.user_id}/${item.id}`} key={index} className="relative aspect-w-1 aspect-h-1 group">
                                        <img src={`${import.meta.env.VITE_REACT_API_URL}${item.imageUrl}`} alt="" className='object-cover md:group-hover:opacity-50 transition-opacity duration-100' />
                                        <div className='hidden md:flex absolute items-center justify-center gap-x-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                                            <div className='flex gap-x-1'>
                                                <img src="/icons/Notifications.svg" alt="" className='white-icon' />
                                                <p className='font-semibold'>200</p>
                                            </div>
                                            <div className='flex gap-x-1'>
                                                <img src="/icons/Comment.svg" alt="" className='white-icon' />
                                                <p className='font-semibold'>100</p>
                                            </div>
                                        </div>
                                    </Link>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <Footer user={user} id={id} />
        </>
    )
}

export default Profile