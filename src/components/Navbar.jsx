import React from "react";
import Link from "next/link";
import { ModeToggle } from "@/components/ModeToggle";

const Navbar = () => {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-white shadow dark:bg-zinc-950 dark:border-b dark:border-white/10 p-2">
      <div className="flex h-14 items-center">
        <Link
          href="#"
          className="mr-auto flex items-center gap-2 text-2xl  font-bold"
          prefetch={false}
        >
          <span className="text-teal-600">SCG</span>
          <span> CHAT</span>
        </Link>

        <ModeToggle className="ml-auto flex items-center gap-2 text-md" />
      </div>
    </nav>
  );
};

export default Navbar;
