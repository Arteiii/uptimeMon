"use client";

import { Typography } from "@material-tailwind/react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white p-8">
      <hr className="my-8 border-blue-gray-50" />
      <div className="flex justify-center items-center space-x-4">
        <Typography
          as="a"
          href="https://github.com/Arteiii/uptimeMon"
          color="blue-gray"
          className="font-normal transition-colors hover:text-blue-500 focus:text-blue-500"
        >
          Contribute
        </Typography>
        <Typography
          as="a"
          href="https://github.com/Arteiii/uptimeMon?tab=Apache-2.0-1-ov-file#readme"
          color="blue-gray"
          className="font-normal transition-colors hover:text-blue-500 focus:text-blue-500"
        >
          License
        </Typography>
      </div>
      <Typography color="blue-gray" className="text-center font-normal">
        &copy; {currentYear} Arteii. All rights reserved.
      </Typography>
    </footer>
  );
}
