import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
const Aside = (props) => {
    const { user } = props;
    const {user_metadata: User} = user;
    const [suggested, setSuggested] = useState();
    useEffect(() => {
        const suggest = () => {
            axios.post(`${import.meta.env.VITE_REACT_API_URL}/api/user/all`, { user_id: user.id }).then(({ data }) => {
                setSuggested(data);
            }).catch = (e) => {
                console.log(e);
            }
        }
        suggest();
    }, [!suggested])
    return (
        <aside className='hidden mr-8 xl:block xl:fixed xl:top-0 xl:right-0 xl:pt-8 xl:w-full xl:max-w-xs '>
            <div className="left-0 p-4">
                <div className="flex items-center gap-2 mb-4">
                    <img src={`${import.meta.env.VITE_REACT_API_URL}/proxy?url=${User.avatar_url}`} alt="" className='w-12 rounded-full' />
                    <div>
                        <h3 className='font-semibold text-sm text-white'>{User.user_name}</h3>
                        <p className='text-sm text-white'>{User.full_name}</p>
                    </div>
                </div>
                <p className='text-sm text-white mb-4'>Suggested for you</p>
                <div>
                    {suggested && suggested.map((item, index) => {
                        if (!item?.user_metadata.isFollowing) {
                            return (
                                <Link to={`/profile/${item.id}`} key={index} className="flex items-center gap-2 mb-4 cursor-pointer">
                                    <img src={`${import.meta.env.VITE_REACT_API_URL}/proxy?url=${item?.user_metadata.avatar_url}`} alt="" className='w-12 rounded-full' />
                                    <div className='w-full flex justify-between'>
                                        <div>
                                            <h3 className='font-semibold text-sm text-white'>{item?.user_metadata.user_name}</h3>
                                            <p className='text-sm text-white'>{item?.user_metadata.full_name}</p>
                                        </div>
                                        {/* <button className='font-semibold text-sm text-blue-300'>Follow</button> */}
                                    </div>
                                </Link>
                            )
                        }
                    })}
                </div>
            </div>
        </aside>
    )
}

export default Aside