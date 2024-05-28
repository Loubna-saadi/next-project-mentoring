// components/Navbar.js
"use client";
import React, { useState,useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { NAV_LINKS } from '@/constants';
import Button from './Button';
// Import the fetchUserInfo function
const Navbar = () => {
  interface UserInfo {
    username: string;
    role:string;
    // Add other properties as needed
  }
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [path, setPath] = useState("");
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/getUserInfo', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserInfo(response.data);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, []);
  useEffect(() => {
    if (userInfo?.role === "client") {
      setPath("/pages/accounts/Clientaccount");
    } else if (userInfo?.role === "mentor") {
      setPath("/pages/accounts/MentorAccount");
    }
  }, [userInfo]);
  return (
    <nav className=' flexBetween max-container padding-container relative z-30 -m-12 '>
      <Link href='/'>
        <Image src="/Digital.png" alt="logo" width={174} height={29} className='md: w-30 h-30 ' />
      </Link>
      <ul className="hidden h-full gap-12 lg:flex">
        {NAV_LINKS.map((link) => (
          <Link href={link.href} key={link.key} className='regular-16 text-gray-50 flexCenter cursor-pointer pb-1.5 transition-all hover:font-bold'>{link.label}</Link>
        ))}
      </ul>
      {userInfo ? (
        <Link href={path} passHref>
          <div className="lg:flexCenter hidden">
            <Button
              type="button"
              title={userInfo.username}
              icon="/user.svg"
              variant="btn_dark_green"
            />
          </div>
        </Link>
        
      ):(
        <Link href="/pages/login">
        <div className="lg:flexCenter hidden">
          <Button
            type="button"
            title="login"
            icon="/user.svg"
            variant="btn_dark_green"
          />
        </div>
      </Link>
      )}
        
    
      <Image
        src="menu.svg"
        alt=""
        width={32}
        height={32}
        className='inline-block cursor-pointer lg:hidden '
      />
    </nav>
  );
};

export default Navbar;
