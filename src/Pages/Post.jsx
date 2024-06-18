import React, { act, useEffect, useRef, useState } from 'react'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Loading from '../Components/Loading';
import timeAgo from '../Utils/timeAgo';

const Post = (props) => {
    const [post, setPost] = useState();
    const [comment, setComment] = useState();
    const [isLoading, setIsLoading] = useState();
    const { id, idpost, user } = props;
    const Navigate = useNavigate();
    const dialogRef = useRef(null);
    useEffect(() => {
        setIsLoading(true);
        axios.post(`${import.meta.env.VITE_REACT_API_URL}/api/post/find`, { post_id: idpost, user_id: id, my_id: user.id }).then(({ data }) => {
            setPost(data);
        }).catch((e) => {
            console.log(e)
        }).finally(() => {
            setIsLoading(false);
        })
    }, []);

    useEffect(() => {
        const handleClose = () => {
            Navigate('/');
        };
        const handleResize = () => {
            if (dialogRef.current && window.innerWidth >= 1024) {
                if (dialogRef.current) {
                    dialogRef.current.showModal();
                    dialogRef.current.addEventListener('close', handleClose);
                }
            } else if (dialogRef.current) dialogRef.current.close();
        }
        window.addEventListener('resize', handleResize);
        handleResize();
    }, [post]);

    const postComment = () => {
        axios.post(`${import.meta.env.VITE_REACT_API_URL}/api/comment/new`, { user_id: user.id, post_id: idpost, comment: comment }).then(({ data }) => {
            const prevPost = { ...post };

            prevPost.comments.push({
                post_id: idpost,
                user_id: user.id,
                body: comment,
                created_at: new Date(),
                users: {
                    ...user
                }
            });
            setPost(prevPost);
            setComment('');
        }).catch((e) => {
            console.log(error)
        })
    }

    const like = () => {
        const tempost = {...post};
        axios.post(`${import.meta.env.VITE_REACT_API_URL}/api/like`, {user_id: user.id, post_id: idpost, action: tempost.isLiked ? 'unlike' : 'like'}).then(({data}) => {
            tempost.isLiked ? tempost.isLiked = false : tempost.isLiked = true
            setPost(tempost);
        }).catch((e) => {
            console.log(e);
        })
    }

    if (isLoading || post == undefined) return <Loading />
    const { users: { user_metadata: User } } = post;
    return (
        <>
            <main>
                <nav className='fixed bg-dark w-full border-b border-gray-600 md:hidden z-10'>
                    <div className="w-full p-2">
                        <div className="flex items-center">
                            <img onClick={() => Navigate('/')} src="/icons/arrow.svg" alt="" className="-rotate-90 w-6 mr-2 z-10 cursor-pointer" />
                            <div className="absolute left-0 w-full flex-grow text-center">
                                <h1 className="text-md text-white ">Postingan {User?.full_name}</h1>
                            </div>
                        </div>
                    </div>
                </nav>
                <div className='justify-center pt-14 pb-8 w-full md:hidden md:fixed md:max-w-5xl bg-dark md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2'>
                    {/* <div className='flex w-full justify-center max-w-5xl '> */}
                    {/* Head Post */}
                    <div className='flex flex-col md:w-1/2'>
                        <div className='container flex justify-between pt-2 pb-2 md:hidden'>
                            <div className='flex gap-x-2 items-center'>
                                <img src={User?.avatar_url} alt="" className='w-8 h-fit rounded-full' />
                                <div className='flex flex-col my-auto gap-y-0'>
                                    <h3 className='font-semibold text-sm text-white flex gap-2'>{User?.full_name}<img src="/icons/Verified.svg" alt="" /></h3>
                                    {/* <p className='text-xs text-white'>Jawa Barat, Indonesia</p> */}
                                </div>
                            </div>
                            <img src="/icons/more.svg" alt="" />
                        </div>
                        {/* Media Post */}
                        <div className='flex mx-auto border border-gray-600'>
                            <img src={`${import.meta.env.VITE_REACT_API_URL}${post.imageUrl}`} alt="" loading='lazy' className='md:h-[585px] mx-auto object-cover md:w-1/2' />
                        </div>
                    </div>
                    {/* Detail Post */}
                    <div className='container mx-auto md:w-1/2'>
                        <div className='flex justify-between py-2'>
                            <div className='inline-flex gap-x-4'>
                                <img onClick={() => like()} src={`${post.isLiked ? '/icons/liked.svg' : '/icons/Notifications.svg'}`} alt="" />
                                <img src="/icons/Comment.svg" alt="" />
                                <img src="/icons/Share.svg" alt="" />
                            </div>
                            <img src="/icons/Save.svg" alt="" />
                        </div>

                        <h3 className='font-semibold text-sm text-white'>{post?.likes.length} likes</h3>
                        <p className='text-white text-sm mb-2'><span className='font-semibold'>{User?.full_name}</span> {post.caption}</p>
                        <p className='text-xs text-gray-400'>{timeAgo(post?.created_at)}</p>
                        {post.comments && <p className='font-semibold text-white text-xs mx-auto text-center mt-10'>Komentar</p>}
                        <div className='relative flex flex-col gap-4 mt-4 pb-10'>
                            <hr className='mt-2 mb-4 border-separate border-gray-600' />
                            {post.comments.map((item, index) => {
                                const { users: { user_metadata: userComment } } = item;
                                return (
                                    <div key={index} className='flex items-start gap-2 pb-4 border-b border-gray-600'>
                                        <img src={userComment?.avatar_url} alt="" className='w-8 rounded-full' />
                                        <div className='w-full flex flex-col items-start gap-2'>
                                            <div className='flex w-full justify-between gap-2'>
                                                <p className='font-semibold text-xs text-white'>{userComment?.full_name}</p>
                                                <p className='text-xs text-gray-400'>{timeAgo(item?.created_at)}</p>
                                            </div>
                                            <div>
                                                <p className='text-xs font-light text-white'>{item.body}</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                            <div className='bg-[#1b2129] fixed bottom-0 left-0 w-full flex gap-x-2 items-center border-b border-gray-600 px-4 py-2 mt-2 rounded-full'>
                                <input type="text" onChange={(e) => setComment(e.target.value)} value={comment} className='w-full text-sm text-white p-2 rounded-full' placeholder='Add a Comment' />
                                <button onClick={() => postComment()} className='text-sm'>Post</button>
                            </div>
                        </div>
                        {/* <p className='text-xs text-gray-400 mb-2'>View all 100 comments</p>
                <input type="text" name="newcomment" id="newcomment" placeholder='Add a comment...' className='bg-transparent w-full text-sm text-white' /> */}
                    </div>
                    {/* </div> */}
                </div>
                <footer>

                </footer>
                {/* <Footer user={user} me={me} /> */}
            </main>
            {/* You can open the modal using document.getElementById('ID').showModal() method */}
            {/* <button className="btn" onClick={() => document.getElementById('my_modal_3').showModal()}>open modal</button> */}
            <dialog id="my_modal_3" className="hidden lg:flex mx-auto modal" ref={dialogRef}>
                <div className="modal-box w-full max-w-5xl bg-dark mx-auto overflow-hidden">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <div className='mx-auto justify-center pt-10 pb-8 w-full gap-x-2 md:flex md:max-w-5xl bg-dark'>
                        <div className='flex flex-col md:w-1/2'>
                            <div className='container flex justify-between pt-2 pb-2 md:hidden'>
                                <div className='flex gap-x-2 items-center'>
                                    <img src={User?.avatar_url} alt="" className='w-8 h-fit rounded-full' />
                                    <div className='flex flex-col my-auto gap-y-0'>
                                        <img src={User?.avatar_url} alt="" className='w-8 rounded-full' />
                                        <h3 className='font-semibold text-sm text-white flex gap-2'>{User?.full_name}<img src="/icons/Verified.svg" alt="" /></h3>
                                    </div>
                                </div>
                                <img src="/icons/more.svg" alt="" />
                            </div>
                            {/* Media Post */}
                            <div className='flex mx-auto rounded-xl border border-gray-600 md:h-[585px]'>
                                <img src={`${import.meta.env.VITE_REACT_API_URL}${post?.imageUrl}`} alt="" loading='lazy' className='m-auto h-fit object-fill' />
                            </div>
                        </div>

                        {/* Detail Post */}
                        <div className='relative container mx-auto md:w-1/2 overflow-hidden'>
                            <div className='flex items-start gap-2'>
                                <img src={User?.avatar_url} alt="" className='w-8 rounded-full' />
                                <p className='text-white text-sm mb-2'><span className='font-semibold'>{User?.full_name}</span> <br />{post.caption}</p>
                            </div>
                            <div className='flex w-full mx-auto flex-col gap-4 mt-4 overflow-y-scroll hide-scrollbar pb-20 h-80'>
                                <hr className='mt-2 mb-4 border-separate border-gray-600' />
                                {post.comments.map((item, index) => {
                                    const { users: { user_metadata: userComment } } = item;
                                    return (
                                        <div key={index} className='flex items-start gap-2 pb-4'>
                                            <img src={userComment?.avatar_url} alt="" className='w-8 rounded-full' />
                                            <div className='w-full flex flex-col items-start gap-1'>
                                                <div className='flex w-full justify-between gap-2'>
                                                    <p className='font-semibold text-xs text-white'>{userComment?.full_name}</p>
                                                    <p className='text-xs text-gray-400'>{timeAgo(item.created_at)}</p>
                                                </div>
                                                <div>
                                                    <p className='text-xs font-light text-white'>{item.body}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            <div className='bg-dark absolute flex flex-col justify-center gap-2 w-full max-w-lg bottom-0 p-2'>
                                <div className='flex w-full justify-between'>
                                    <div className='inline-flex gap-x-4'>
                                        <img id="like" onClick={() => like()} src={`${post.isLiked ? '/icons/liked.svg' : '/icons/Notifications.svg'}`} alt="" />
                                        <img src="/icons/Comment.svg" alt="" />
                                        <img src="/icons/Share.svg" alt="" />
                                    </div>
                                    <img src="/icons/Save.svg" alt="" />
                                </div>
                                <h3 className='font-semibold text-sm text-white'>{post.likes.length} likes</h3>
                                <span className='text-xs'>{timeAgo(post.created_at)}</span>
                                <div className='flex gap-x-2 items-center border-b border-gray-600 pb-2 mt-2'>
                                    <input type="text" onChange={(e) => setComment(e.target.value)} className='w-full text-sm text-white' placeholder='Add a Comment' />
                                    <button onClick={() => postComment()} className='text-sm'>Post</button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </dialog>
        </>
    )
}

export default Post