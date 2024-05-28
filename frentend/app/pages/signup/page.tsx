"use client";
import { useRouter } from 'next/navigation';
import { useState, ChangeEvent, FormEvent } from 'react';
import uploadImageToCloudinary from '../../../utils/UploadCloudinary'

 // Import the registerUser function
import Link from 'next/link';
import axios from 'axios';

const SignupPage = () => {
    const [selectedFile, setSelectedFile]=useState(null);
    const [previewURL, setPreviewURL]=useState("");
    const [formData, setFormData] = useState({
    email: '',
    phone: '',
    username: '',
    password: '',
    role: 'client' as "client" | "mentor", 
    // photo: selectedFile,
  });

  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/register', formData);
      console.log(response.data); // Log the response from the backend
      // Redirect to home page after successful registration
      router.push('/');
    } catch (error) {
      console.error('Error:', error);
      // Handle error (e.g., show error message)
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  // Define the handleFileChange function

//   const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0]; // Get the first file selected by the user
//     if (!file) return;
//     try {
//       const data = await uploadImageToCloudinary(file);
//       console.log(data);
//       setPreviewURL(data.url)
//       setSelectedFile(data.url)
//       setFormData({ ...formData, photo: data.url }); // Set the photoUrl in your component state or use it as needed
//     } catch (error) {
//       console.error('Error uploading photo to Cloudinary in handelfilechane:', error);
//       // Handle any error that occurs during file upload
//     }
//   };
  return (
    <section className="bg-white">
    <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="relative flex items-end px-4 pb-10 pt-60 sm:pb-16 md:justify-center lg:pb-24 bg-gray-50 sm:px-6 lg:px-8">
        <div className="absolute inset-0">
                <img className="object-cover object-top w-full h-full" src="/girl-thinking.jpg" alt="" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
            <div className="relative">
                <div className="w-full max-w-xl xl:w-full xl:mx-auto xl:pr-24 xl:max-w-xl">
                </div>
            </div>
        </div>
{/* form */}
        <div className="flex items-center justify-center px-4 py-10 bg-white sm:px-6 lg:px-8 sm:py-16 lg:py-24">
            <div className="xl:w-full xl:max-w-sm 2xl:max-w-md xl:mx-auto">
                <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl">Sign Up to find your path</h2>
                <p className="mt-2 text-base text-gray-600">Already hahe an account?
                <Link href="/pages/login" className="font-medium text-blue-600 transition-all duration-200 hover:text-blue-700 focus:text-blue-700 hover:underline">Create a free account</Link></p>

                <form onSubmit={handleSubmit} method="POST" className="mt-8" encType="multipart/form-data">
                    <div className="space-y-5">
                        <div>
                            <label  className="text-base font-medium text-gray-900"> Email address </label>
                            <div className="mt-2.5 relative text-gray-400 focus-within:text-gray-600">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                    </svg>
                                </div>

                                <input
                                    type="text"
                                    name="email"
                                    id=""
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter email to get started"
                                    className="block w-full py-4 pl-10 pr-4 text-black placeholder-gray-500 transition-all duration-200 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:border-blue-600 focus:bg-white caret-blue-600"
                                />
                            </div>
                        </div>

                        
                        <div>
                            <div className="flex items-center justify-between">
                                <label className="text-base font-medium text-gray-900"> Phone number</label>
                            </div>
                            <div className="mt-2.5 relative text-gray-400 focus-within:text-gray-600">
                                <input
                                    type="text"
                                    name="phone"
                                    id=""
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Enter your phone number"
                                    className="block w-full py-4 pl-10 pr-4 text-black placeholder-gray-500 transition-all duration-200 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:border-blue-600 focus:bg-white caret-blue-600"
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between">
                                <label className="text-base font-medium text-gray-900"> name</label>
                            </div>
                            <div className="mt-2.5 relative text-gray-400 focus-within:text-gray-600">
                                <input
                                    type="text"
                                    name="username"
                                    id=""
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="Enter your name"
                                    className="block w-full py-4 pl-10 pr-4 text-black placeholder-gray-500 transition-all duration-200 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:border-blue-600 focus:bg-white caret-blue-600"
                                />
                            </div>
                        </div>
                    
                        <div>
                            <div className="flex items-center justify-between">
                                <label className="text-base font-medium text-gray-900"> Password </label>
                            </div>
                            <div className="mt-2.5 relative text-gray-400 focus-within:text-gray-600">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
                                        />
                                    </svg>
                                </div>

                                <input
                                    type="text"
                                    name="password"
                                    id=""
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    className="block w-full py-4 pl-10 pr-4 text-black placeholder-gray-500 transition-all duration-200 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:border-blue-600 focus:bg-white caret-blue-600"
                                />
                            </div>
                        </div>
      
                        <div>
                            <div className="flex items-center justify-between">
                                <label className="text-base font-medium text-gray-900"> Role</label>
                            </div>
                            <div className="mt-2.5 relative text-gray-400 focus-within:text-gray-600">
                           
                                <select className='mt-2.5 relative text-gray-400 focus-within:text-gray-600'
                                    id="role"
                                    name="role"
                                    value={formData.role} // Set the value to the state value
                                    onChange={handleChange} // Handle onChange event
                                    required
                                >
                                    <option value="mentor">Mentor</option>
                                    <option value="client">Client</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="inline-flex items-center justify-center w-full px-4 py-4 text-base font-semibold text-white transition-all duration-200 border border-transparent rounded-md bg-gradient-to-r from-blue-600 to-green-600 focus:outline-none hover:opacity-80 focus:opacity-80"
                            >
                                sign Up
                            </button>
                        </div>
                    </div>
                </form>

              

  
            </div>
        </div>
    </div>
</section>
  )
}

export default SignupPage
