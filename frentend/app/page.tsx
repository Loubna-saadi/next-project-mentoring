// pages/index.tsx
'use client'
import React from 'react';
import Head from 'next/head';
import ChatbotScript from './_components/Chatbot';
import Guide from './_components/Guide';
import Hero from './_components/Hero';

const Home = () => {
  return (
    <>
      <Head>
        <title>Your Website Title</title>
      </Head>
      <Hero />
      <Guide />
      <ChatbotScript />
    </>
  );
};

export default Home;
