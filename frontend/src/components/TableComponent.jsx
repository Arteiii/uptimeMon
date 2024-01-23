"use client";

import { useState, useEffect } from "react";

import {
  XCircleIcon,
  ArrowPathIcon,
  ArrowDownTrayIcon,
  ArrowDownOnSquareStackIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  ClockIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  Avatar,
  IconButton,
  Tooltip,
  Input,
} from "@material-tailwind/react";

const TABLE_HEAD = ["IP Address", "Hostname", "Last Pinged", "Status", ""];

const TABLE_ROWS = [
  {
    ip: "192.168.1.1",
    hostname: "router",
    lastPinged: new Date("2023-01-23T12:45:00"),
    threshold: 500,
  },
];

export function TableComponent() {
  const [pingStatus, setPingStatus] = useState(TABLE_ROWS);
  const [loading, setLoading] = useState(true);

  const updatePingStatus = () => {
    setLoading(true);

    const intervalId = setInterval(() => {
      const currentTime = new Date();

      const updatedStatus = pingStatus.map((ping) => {
        const responseTime = Math.floor(Math.random() * 1000);

        let status;
        if (responseTime < ping.threshold) {
          status = "Online";
        } else if (responseTime >= ping.threshold) {
          status = "Exceeded Threshold";
        } else {
          status = "Offline";
        }

        setLoading(false);
        return {
          ...ping,
          lastPinged: currentTime,
          status,
        };
      });

      setPingStatus(updatedStatus);
      clearInterval(intervalId);
    }, 2000);
  };

  const handleClickStatus = () => {
    updatePingStatus();
  };

  useEffect(() => {
    updatePingStatus();
  }, []);

  return (
    <Card className="h-full w-full overflow-hidden">
      {" "}
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div className="flex w-full shrink-0 gap-2 md:w-max">
            <Button className="flex items-center gap-3" size="sm" color="green">
              <PlusIcon strokeWidth={2} className="h-4 w-4" /> Add
            </Button>
            <Button className="flex items-center gap-3" size="sm" color="blue">
              <ArrowDownOnSquareStackIcon strokeWidth={2} className="h-4 w-4" />{" "}
              Import
            </Button>
            <Button className="flex items-center gap-3" size="sm">
              <ArrowDownTrayIcon strokeWidth={2} className="h-4 w-4" /> Download
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardBody className="overflow-scroll px-0">
        <div className="overflow-x-hidden overflow-y-auto">
          <table className="w-full table-auto text-left">
            <colgroup>
              <col className="w-1/4" /> {/* IP Address */}
              <col className="w-1/4" /> {/* Hostname */}
              <col className="w-1/4" /> {/* Last Pinged */}
              <col className="w-1/4" /> {/* Status */}
              <col className="w-1/4" /> {/* Edit Ping */}
            </colgroup>
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th
                    key={head}
                    className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pingStatus.map(({ ip, hostname, lastPinged, status }, index) => {
                const isLast = index === pingStatus.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";

                return (
                  <tr key={ip}>
                    <td className={`${classes} max-w-xs whitespace-nowrap`}>
                      {/* Add max-w-xs and whitespace-nowrap */}
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {ip}
                      </Typography>
                    </td>
                    <td className={`${classes} max-w-xs whitespace-nowrap`}>
                      {/* Add max-w-xs and whitespace-nowrap */}
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {hostname}
                      </Typography>
                    </td>
                    <td className={`${classes} max-w-xs whitespace-nowrap`}>
                      {/* Add max-w-xs and whitespace-nowrap */}
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {lastPinged.toLocaleTimeString()}
                      </Typography>
                    </td>
                    <td className={`${classes} max-w-xs whitespace-nowrap`}>
                      {/* Add max-w-xs and whitespace-nowrap */}
                      <div className="flex items-center space-x-2">
                        <div className="w-max relative">
                          <Chip
                            size="sm"
                            variant="filled"
                            value={status || "Unknown"}
                            color={
                              status === "Online"
                                ? "green"
                                : status === "Exceeded Threshold"
                                ? "yellow"
                                : status === "Unknown"
                                ? "gray"
                                : "red"
                            }
                            className={`${loading ? "animate-pulse" : ""} ${
                              status === "Unknown" ? "cursor-pointer" : ""
                            }`}
                            onClick={() => handleClickStatus()}
                            icon={
                              status === "Online" ? (
                                <CheckCircleIcon className="h-4 w-4" />
                              ) : status === "Exceeded Threshold" ? (
                                <ClockIcon className="h-4 w-4" />
                              ) : status === "Unknown" ? (
                                loading ? (
                                  <div className="h-4 w-4 border-t-2 border-blue-gray-500 border-solid rounded-full"></div>
                                ) : (
                                  <div className="animate-pulse">
                                    {lastActiveStatus === "Online" ? (
                                      <CheckCircleIcon className="h-4 w-4" />
                                    ) : lastActiveStatus ===
                                      "Exceeded Threshold" ? (
                                      <ClockIcon className="h-4 w-4" />
                                    ) : (
                                      <XCircleIcon className="h-4 w-4" />
                                    )}
                                  </div>
                                )
                              ) : (
                                <XCircleIcon className="h-4 w-4" />
                              )
                            }
                          />
                        </div>
                      </div>
                    </td>
                    <td className={`${classes} max-w-xs whitespace-nowrap`}>
                      {/* Add max-w-xs and whitespace-nowrap */}
                      <Tooltip content="Edit Ping">
                        <IconButton variant="text">
                          <AdjustmentsHorizontalIcon />
                        </IconButton>
                      </Tooltip>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardBody>
      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
        <Button variant="outlined" size="sm">
          Previous
        </Button>
        <div className="flex items-center gap-2">
          <IconButton variant="outlined" size="sm">
            1
          </IconButton>
          <IconButton variant="text" size="sm">
            2
          </IconButton>
          <IconButton variant="text" size="sm">
            3
          </IconButton>
          <IconButton variant="text" size="sm">
            ...
          </IconButton>
          <IconButton variant="text" size="sm">
            8
          </IconButton>
          <IconButton variant="text" size="sm">
            9
          </IconButton>
          <IconButton variant="text" size="sm">
            10
          </IconButton>
        </div>
        <Button variant="outlined" size="sm">
          Next
        </Button>
      </CardFooter>
    </Card>
  );
}
