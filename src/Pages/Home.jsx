import React, { useEffect, useState } from 'react';
import Navbar from '../Components/Navbar';
import Story from '../Components/Story';
import Footer from '../Components/Footer';
import Aside from '../Components/Aside';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import shuffleArray from '../Utils/Shuffle';
import timeAgo from '../Utils/timeAgo';
import Post from './Post';
import { supabase } from '../Utils/supabaseClient';
import { useUser } from '../Components/UserContext';
import Loading from '../Components/Loading';
const Home = (props) => {
    const [posts, setPosts] = useState();
    const [suggested, setSuggested] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useUser();
    const { id, idpost } = useParams();
    document.title = props.title;
    useEffect(() => {
        const fetchPost = () => {
            axios.post(`${import.meta.env.VITE_REACT_API_URL}/api/post/followed`, { user_id: user.id }).then(({ data }) => {
                if(data.length > 0) setPosts(shuffleArray(data));
                setIsLoading(false);
            }).catch = (e) => {
                console.log(e);
            }
        }
        const sugges = () => {
            axios.post(`${import.meta.env.VITE_REACT_API_URL}/api/user/all`, {user_id: user.id}).then(({ data }) => {
                setSuggested(data);
            }).catch = (e) => {
                console.log(e);
            }
        }
        fetchPost();
        sugges();
    },[!posts])
    // if(isLoading) return <Loading/>
    return (
        <>
            {idpost && <Post id={id} idpost={idpost} user={user}/>}
            <main className={`${idpost ? 'hidden md:block' : ''} mx-auto md:max-w-[630px] md:px-5 bg-dark pb-16 animate__animated animate__fadeIn`}>
                <Navbar user={user}/>
                <Story/>
                <div className="mx-auto max-w-xl">
                    {/* <Search /> */}
                    <div className="w-full">
                        {posts && posts.map((item, index) => {
                            const {users:{user_metadata: User}} = item;
                            return (
                                <div key={index} className='relative pb-8 border-b border-gray-600'>
                                    {/* Head Post */}
                                    <div className='container flex justify-between pt-2 pb-2'>
                                        <Link to={`/profile/${User.id}`} className='flex gap-x-2 items-center'>
                                            <img src={User.avatar_url} alt="" className='w-8 h-fit rounded-full' />
                                            <div className='flex flex-col my-auto gap-y-0'>
                                                <h3 className='font-semibold text-sm text-white flex gap-2'>{User ? User.full_name : User.user_name} <img src="/icons/Verified.svg" alt="" /></h3>
                                                {/* <p className='text-xs text-white'>Jawa Barat, Indonesia</p> */}
                                            </div>
                                        </Link>
                                        <img src="/icons/more.svg" alt="" />
                                    </div>
                                    {/* Media Post */}
                                    <div className='max-h-fit h-fit md:max-h-fit border border-gray-600'>
                                        <img src={`${import.meta.env.VITE_REACT_API_URL}${item.imageUrl}`} alt="" loading='lazy' className='h-fit mx-auto object-cover' />
                                    </div>
                                    {/* Detail Post */}
                                    <div className='container'>
                                        <div className='flex justify-between py-2'>
                                            <div className='inline-flex gap-x-4'>
                                                <img src={`${item.isLiked ? '/icons/liked.svg' : '/icons/Notifications.svg'}`} alt="" />
                                                <Link to={`/post/${User.id}/${item.id}`}><img src="/icons/Comment.svg" alt="" /></Link>
                                                <img src="/icons/Share.svg" alt="" />
                                            </div>
                                            <img src="/icons/Save.svg" alt="" />
                                        </div>
                                        <h3 className='font-semibold text-sm text-white'>{item?.likes.length} likes</h3>
                                        <p className='text-white text-sm mb-2'><span className='font-semibold'>{User ? User.full_name : User.user_name}</span> {item.caption}</p>
                                        <p className='text-xs text-gray-400 mb-2'>View all {item.comments.length} comments</p>
                                        <input type="text" name="newcomment" id="newcomment" placeholder='Add a comment...' className='bg-transparent w-full text-sm text-white' />
                                        <p className='text-xs text-gray-400 mt-2'>{timeAgo(item.created_at)}</p>
                                    </div>
                                </div>
                            )
                        })}
                        <div className='px-4 mt-4 md:hidden'>
                            {(!posts && suggested) && <p className='text-sm text-white mb-4'>Orang yang mungkin anda kenal</p>}
                            {(!posts && suggested) && suggested.map(({user_metadata:item}, index) => {
                                if (!item.isFollowing) {
                                    return (
                                        <Link to={`/profile/${item.id}`} key={index} className="flex items-center gap-2 mb-4 cursor-pointer">
                                            <img src={item.avatar_url} alt="" className='w-12 rounded-full' />
                                            <div className='w-full flex justify-between'>
                                                <div>
                                                    <h3 className='font-semibold text-sm text-white'>{item.user_name}</h3>
                                                    <p className='text-sm text-white'>{item.full_name}</p>
                                                </div>
                                                {/* <button className='font-semibold text-sm text-blue-300'>Follow</button> */}
                                            </div>
                                        </Link>
                                    )
                                }
                            })}
                        </div>
                    </div>
                </div>
            </main>
            <Aside user={user} />
            <Footer user={user} id={id} idpost={idpost}/>
        </>
    )
}

export default Home