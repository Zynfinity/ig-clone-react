import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom';
import Alert from './Alert';

const NewPost = (props) => {
    const [posts, setPosts] = useState([]);
    const [postId, setPostId] = useState('');
    const [caption, setCaption] = useState('');
    // useEffect(() => {
    //     const fetchAllPost = async () => {
    //         try {
    //             const { data } = await axios.get(`${import.meta.env.VITE_REACT_API_URL}/api/post/all`);
    //             setPosts(data);
    //         } catch (e) {
    //             console.log(e)
    //         }
    //     };
    //     fetchAllPost();
    // }, [])
    const generatedIds = posts.length > 0 ? posts.map(rs => rs.id) : [];

    const generatePostId = () => {
        let postId;
        do {
            const randomPart = Math.random().toString(36).substr(2, 9);
            const datePart = Date.now().toString(36);
            postId = `${datePart}-${randomPart}`;
        } while (generatedIds.includes(postId));
        return postId;
    }

    // Contoh penggunaan:



    const submitPost = async () => {
        const newPostId = generatePostId();
        setPostId(newPostId);
        const formData = new FormData();
        formData.append('image', props.image);
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_REACT_API_URL}/api/uploader?filename=${newPostId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            try {
                const { data: addPost } = await axios.post(`${import.meta.env.VITE_REACT_API_URL}/api/post/new`, { id: newPostId, user_id: props.user.id, imageUrl: data.filePath, caption: caption });
                <Alert pesan={'Post sudah dikirim!'} />
                props.setPostOff();
            } catch (e) {

            }
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };
    return (
        <div className='fixed flex flex-col w-full top-0 h-full bg-dark px-2 z-10'>
            <div className='flex justify-between items-center gap-x-4 py-2 px-2'>
                <div className='flex gap-x-6 items-center'>
                    <img onClick={() => props.setPostOff()} src="/icons/cancel.svg" alt="" className='w-8 cursor-pointer' />
                    <h2 className='font-semibold text-white'>Postingan Baru</h2>
                </div>
                <h2 onClick={() => submitPost()} className='font-semibold text-sm text-blue-400'>Posting</h2>
            </div>
            <div className='w-full mt-10 pb-6 max-w-lg border-b border-gray-600 mx-auto'>
                <img src={props.preview} alt="" className='w-60 lg:w-full rounded-md mx-auto' />
                <input onChange={(e) => setCaption(e.target.value)} type="text" name="" id="" className='font-semibold text-white text-xs w-full mt-4 p-2' placeholder='Tulis Keterangan' />
            </div>
        </div>
    )
}

export default NewPost