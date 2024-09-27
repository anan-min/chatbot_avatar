import React from "react";
import Link from "next/link";
import { ModeToggle } from "@/components/ModeToggle";

const Navbar = () => {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-white shadow dark:bg-gray-950">
      <div className="flex h-14 items-center p-4">
        <Link
          href="#"
          className="mr-auto flex items-center gap-2 text-lg font-semibold"
          prefetch={false}
        >
          <span>SCG CHAT</span>
        </Link>

        <ModeToggle className="ml-auto flex items-center gap-2 text-md" />
      </div>
    </nav>
  );
};

export default Navbar;
