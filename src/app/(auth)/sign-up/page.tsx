import React from 'react'
import SignUp from './Signup'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Signup",
};

export default function SignupPage() {
  return (
    <div>
      <SignUp />
    </div>
  )
}
