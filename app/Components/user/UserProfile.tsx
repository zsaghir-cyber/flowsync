"use client";

import React, { useState } from "react";
import { auth, provider } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { signInWithPopup, signOut } from "firebase/auth";
import { Button, Popup } from "pixel-retroui";
import Image from "next/image"; // 1. Import the Image component

const UserProfile = () => {
  const { user } = useAuth();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  const handleLogout = async () => {
    await signOut(auth);
    closePopup();
  };

  return (
    <div className="flex justify-center mt-6">
      {!user ? (
        <Button
          bg="#D6DAC8"
          textColor="black"
          borderColor="black"
          onClick={() => signInWithPopup(auth, provider)}
        >
          Sign in with Google
        </Button>
      ) : (
        <>
          <button
            onClick={openPopup}
            className="flex items-center gap-2 cursor-pointer"
          >
            {/* 2. Replace <img> with <Image /> */}
            <Image
              src={user.photoURL || ""}
              alt={user.displayName || "User"}
              width={40} // Specify width
              height={40} // Specify height
              className="w-10 h-10 rounded-full border border-black"
              unoptimized // Recommended for external profile pics to avoid domain config errors
            />
          </button>

          <Popup isOpen={isPopupOpen} onClose={closePopup}>
            <div className="p-4 flex flex-col items-center">
              <p className="mb-4 text-black">Do you want to log out?</p>
              <div className="flex gap-3">
                <Button
                  bg="white"
                  textColor="black"
                  borderColor="black"
                  onClick={handleLogout}
                >
                  Yes
                </Button>
                <Button
                  bg="white"
                  textColor="black"
                  borderColor="black"
                  onClick={closePopup}
                >
                  No
                </Button>
              </div>
            </div>
          </Popup>
        </>
      )}
    </div>
  );
};

export default UserProfile;
