'use client'
import React from 'react';
import { useState ,useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MyBookings from '../bookings/page';
import Profile from '../profile/page';
import axios from 'axios';

interface UserInfo {
    _id:string;
    username: string;
    email: string;
    role: string;
    photo:string
    // Add other properties as needed
  }
  
const ClientAccount = () => {
    const [tab,setTab]=useState('bookings');
    const router = useRouter();
    const [userInfo, setUserInfo] = React.useState<UserInfo | null>(null);
    useEffect(() => {
      const token = localStorage.getItem('token');
      console.log('token is', token);
      if (!token) {
        // Redirect to login if token is not available
        router.push('/pages/login');
        return;
      }
  
      const fetchUserInfo = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/user/profile', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUserInfo(response.data);
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      };
  
      fetchUserInfo();
    }, [router]);
    const handleLogout = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/logout');
        if (response.status === 200) {
          // Clear local storage and redirect to login page
          localStorage.removeItem('token');
          router.push('/pages/login');
        }
      } catch (error) {
        console.error('Error logging out:', error);
      }
    };
  
    if (!userInfo) {
      return <p>Loading user information...</p>;
    }
 
    return (
        
        <div className='max-w-[1170px] px-5 mx-auto mt-9'>
            <div className='grid md:grid-cols-3 gap-10'>
<div className='pb-[50px] px-[30px] rounded-[50px] shadow-2xl mb-4'>
<div className='flex items-center justify-center' >
<figure className='w-[100px] h-[100px] rounded-full border-2 border-solid border-green-600 mt-3'>
    <img 
    src={userInfo.photo}
    alt=""
    className='w-full h-full rounded-full'
    />
</figure>
</div>
<div className='text-center mt-4'>
<h3 className='text-[18px] leading-[30px] text-black font-bold '>{userInfo.username}</h3>
<p className='text-black text-[15px] leading-6 font-medium'>{userInfo.email} </p>
<p className='text-black text-[15px] leading-6 font-medium'>{userInfo.role} </p>
</div>

<div className='mt-[50px] md:mt-[100px]'>
<button onClick={handleLogout} className='w-full bg-green-700 p-3 text-[16px] leading-7 rounded-md'>Lougout</button>
<button className='mt-3 w-full bg-green-700 p-3 text-[16px] leading-7 rounded-md'>Detelete account</button>
</div>
</div>
<div className='md:col-span-2 md:px-[30px]'>
<div>
    <button onClick={()=> setTab('bookings')} className={`${tab=='bookings'&& 'bg-green-600 font-normal'} p-2 mr-5 px-5 rounded-md text-black font-semibold text-[16px] leading-7 border border-solid border-green-600`}>My bookings</button>
    <button onClick={()=> setTab('Settings')} className={`${tab=='Settings'&& 'bg-green-600 font-normal'} py-2  px-5 rounded-md text-black font-semibold text-[16px] leading-7 border border-solid border-green-600`}>Profile Settings</button>
</div>
{tab=='bookings'&& <MyBookings/>}
{tab=='Settings'&& <Profile/>}
</div>


            </div> 
        </div>
    );
};

export default ClientAccount;
