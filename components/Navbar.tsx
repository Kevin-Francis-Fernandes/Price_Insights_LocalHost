"use client"
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

const navIcons = [
  { src: '/assets/icons/user.svg', alt: 'user' },
];

const Navbar = () => {

  const { data: session } = useSession();

  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  if (!session) {
    return null; // If there's no session, don't render anything
  }

  return (
    <header className="w-full">
      <nav className="nav flex justify-between items-center">
        <Link href="/dashboard" className="flex items-center gap-1">
          <Image
            src="/assets/icons/logo.svg"
            width={27}
            height={27}
            alt="logo"
          />

          <p className="nav-logo">
            Price<span className='text-primary'>Insights</span>
          </p>
        </Link>

        <div className="flex items-center gap-5">
          <p className="text-lg semi-bold text-secondary">{session?.user?.name}</p>
          <div className="profile-icon" onClick={toggleDropdown}>
            <img src="/assets/icons/user.svg" alt="user" />
          </div>
          {showDropdown && 
            <div className="dropdown">
              <div className="grid place-items-center w-full">
                <button onClick={() => signOut() } className="px-3 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-sm text-gray-700">
                  Log Out
                </button>
              </div>
            </div>
          }
        </div>
      </nav>
    </header>
  )
}

export default Navbar;
