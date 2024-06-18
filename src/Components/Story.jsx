import React from 'react'
import { useUser } from './UserContext';

const Story = ({ me }) => {
    const {user:User} = useUser();
    return (
        <div className='pt-20 bg-dark py-2 md:pt-20'>
            <div className="">
                <div className="w-full overflow-x-scroll hide-scrollbar ">
                    <div className='inline-flex gap-x-6 items-center mx-4'>
                        <div className='flex flex-col items-center max-w-2xl w-full gap-y-2'>
                            <div className='p-0.5 rounded-full border border-blue-400'>
                                <img src={`${import.meta.env.VITE_REACT_API_URL}/proxy?url=${User.avatar_url}`} alt="" className='w-14 max-w-sm mx-auto rounded-full' />
                            </div>
                            <h3 className='text-xs text-white'>Your Story</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Story;