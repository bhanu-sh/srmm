import Link from "next/link";
import React from "react";

export default function ExpenseCard({
  title,
  amount,
  link,
}: {
  title: string;
  amount: number | string;
  link: string;
}) {
  return (
    <div className="w-80 p-4 bg-green-100 rounded-lg shadow-md my-5">
      <div className="p-4 text-center">
        <h2 className="text-xl  font-semibold">{title}</h2>
        <h1 className="text-4xl">{String(amount)}</h1>
        <div className="flex justify-between items-center mt-4">
          <Link href={link} className="mx-auto">
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-green-400">
              View
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
