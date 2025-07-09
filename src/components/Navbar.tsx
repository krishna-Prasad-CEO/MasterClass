import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  UserButton,
} from "@clerk/nextjs";
import {
  BookOpenIcon,
  CreditCardIcon,
  GraduationCap,
  LogOutIcon,
  ZapIcon,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

const Navbar = () => {
  return (
    <div className="flex justify-between items-center border-b py-4 px-6 bg-background">
      <Link
        href="/"
        className="text-xl font-extrabold text-primary flex items-center gap-2"
      >
        MasterClass <GraduationCap className="size-6" />
      </Link>
      <div className="flex items-center space-x-1 sm:space-x-4">
        <Link
          href={"/courses"}
          className="flex items-center gap-1 px-3 py-2 rounded-md text-muted-foreground hover:text-primary hover:bg-secondary transition-colors"
        >
          <BookOpenIcon className="size-4" />
          <span className="hidden sm:inline">Courses</span>
        </Link>
        <Link
          href={"/courses"}
          className="flex items-center gap-1 px-3 py-2 rounded-md text-muted-foreground hover:text-primary hover:bg-secondary transition-colors"
        >
          <ZapIcon className="size-4" />
          <span className="hidden sm:inline">Pro</span>
        </Link>
        <SignedIn>
          <Link href={"/billing"}>
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex items-center gap-2"
            >
              <CreditCardIcon className="size-4" />
              <span className="hidden sm:inline">Billing</span>
            </Button>
          </Link>
        </SignedIn>
        <UserButton />
        <SignedIn>
          <SignOutButton>
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex items-center gap-2"
            >
              <LogOutIcon className="size-4" />
              <span className="hidden sm:inline">Log Out</span>
            </Button>
          </SignOutButton>
        </SignedIn>

        <SignedOut>
          <SignInButton mode="modal">
            <Button className="outline" size="sm">
              Log In
            </Button>
          </SignInButton>
        </SignedOut>

        <SignedOut>
          <SignInButton mode="modal">
            <Button className="outline" size="sm">
              Sign Up
            </Button>
          </SignInButton>
        </SignedOut>
      </div>
    </div>
  );
};

export default Navbar;
