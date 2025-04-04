"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function SignIn() {
  const { data: session } = useSession();
  const router = useRouter();

  const [user, setUser] = useState({
    phone: "",
    password: "",
  });

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    //use the signIn function to sign in the user
    const res = await signIn("credentials", {
      phone: user.phone,
      password: user.password,
      redirect: false,
    });
    if (res && !res.error) {
      console.log("Signed in successfully");
      toast.success("Signed in successfully");
      router.push("/");
    } else if (res) {
      console.log(res.error);
      toast.error(res.error);
    } else {
      console.log("An error occurred during sign in.");
      toast.error("An error occurred during sign in.");
    }
  };

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [router, session]);

  return (
    <div>
      {session ? (
        <div className="flex min-h-full flex-col justify-center items-center px-6 py-12 lg:px-8">
          <p className="text-2xl">You are already signed in</p>
          <button
            className="bg-orange-600 my-4 text-white px-3 py-1.5 rounded-md"
            onClick={() => signOut()}
          >
            Sign out
          </button>
        </div>
      ) : (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Welcome to
            </h2>
            <h2 className="text-center text-2xl font-bold tracking-tight text-blue-600">
              SHRI RAJROOP
            </h2>
            <h2 className="text-center text-2xl font-bold tracking-tight text-blue-600">
              MEMORIAL MAHAVIDYALAYA
            </h2>
            <h2 className="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Sign in to your account
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Phone
                </label>
                <div className="mt-2">
                  <input
                    id="tel"
                    name="tel"
                    type="tel"
                    required
                    autoComplete="tel"
                    onChange={(e) =>
                      setUser({ ...user, phone: e.target.value })
                    }
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Password
                  </label>
                  <div className="text-sm">
                    <a
                      href="#"
                      className="font-semibold text-indigo-600 hover:text-indigo-500"
                    >
                      Forgot password?
                    </a>
                  </div>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    onChange={(e) =>
                      setUser({ ...user, password: e.target.value })
                    }
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
