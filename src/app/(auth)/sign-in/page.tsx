import React from 'react'
import { Metadata } from 'next';
import SignIn from './Signin';

export const metadata: Metadata = {
  title: "Sign in - SRMM",
};

export default function SigninPage() {
  return (
    <div>
      <SignIn />
    </div>
  )
}
