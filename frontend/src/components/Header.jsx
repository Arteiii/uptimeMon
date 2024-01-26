"use client";

import React from "react";
import Image from "next/image";

import {
  Navbar,
  MobileNav,
  Typography,
  Button,
  IconButton,
} from "@material-tailwind/react";

import { FaGithub } from "react-icons/fa";

export function StickyNavbar() {
  const [openNav, setOpenNav] = React.useState(false);

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  });

  const navList = (
    <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-normal"
      >
        <a href="/" className="flex items-center">
          Ping
        </a>
      </Typography>
    </ul>
  );

  return (
    <Navbar className="sticky top-0 z-10 h-max max-w-full rounded-none px-4 py-2 lg:px-8 lg:py-4 bg-white backdrop-blur-md">
      <div className="flex items-center justify-between text-blue-gray-900">
        <Image src="/logo.svg" alt="logo" width={300} height={300} />
        <div className="flex items-center gap-4">
          <div className="mr-4 hidden lg:block">{navList}</div>
          <div className="flex items-center gap-x-1">
            <Button
              variant="gradient"
              size="sm"
              className="hidden lg:inline-block"
              onClick={() =>
                window.open("https://github.com/arteiii/uptimemon", "_blank")
              }
            >
              <span className="flex items-center">
                <FaGithub className="mr-1" />
                GitHub
              </span>
            </Button>
          </div>
        </div>
      </div>
      <MobileNav open={openNav}>
        {navList}
        <div className="flex items-center gap-x-1">
          <Button
            fullWidth
            variant="gradient"
            size="sm"
            className=""
            onClick={() =>
              window.open("https://github.com/arteiii/uptimeMon", "_blank")
            }
          >
            <span className="flex items-center">
              <FaGithub className="mr-1" />
              GitHub
            </span>
          </Button>
        </div>
      </MobileNav>
    </Navbar>
  );
}
