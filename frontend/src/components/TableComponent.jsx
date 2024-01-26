"use client";

import { useState, useEffect } from "react";
import { AddIPForm } from "./AddIPForm";

import {
  XCircleIcon,
  ArrowPathIcon,
  TrashIcon,
  ArrowDownOnSquareStackIcon,
  PlusIcon,
  ClockIcon,
  CheckCircleIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";

import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  Chip,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";

const TABLE_HEAD = ["IP Address", "Hostname", "Last Pinged", "Status", ""];

const TABLE_ROWS = [
  {
    ip: "192.168.178.58",
    hostname: "test1",
    lastPinged: new Date("2023-01-23T12:45:00"),
    threshold: 500,
  },
  {
    ip: "192.168.178.255",
    hostname: "test2",
    lastPinged: new Date("2023-01-23T12:45:00"),
    threshold: 500,
  },
];

export function TableComponent() {
  const [pingStatus, setPingStatus] = useState(TABLE_ROWS);
  const [loading, setLoading] = useState(true);
  const [addIPFormOpen, setAddIPFormOpen] = useState(false);
  const [lastActiveStatus, setLastActiveStatus] = useState("Unknown");
  const [loadingStates, setLoadingStates] = useState(
    TABLE_ROWS.map(() => true)
  );

  const apiUrl = process.env.API_URL || "http://localhost:8000/env_not_found";

  console.log(apiUrl);

  const handleClickStatus = async () => {
    console.log(apiUrl);
    setLoading(true);

    try {
      const updatedPingStatus = await Promise.all(
        pingStatus.map(async (row) => {
          const response = await fetch(`${apiUrl}/ping/${row.ip}`);
          const data = await response.json();
          console.log(data);

          return {
            ...row,
            lastPinged: new Date(data.timestamp),
            status: data.status,
          };
        })
      );

      setPingStatus(updatedPingStatus);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const handleAddIPClick = () => {
    setAddIPFormOpen(true);
  };

  const handleAddIPFormClose = () => {
    setAddIPFormOpen(false);
  };

  const handleAddIP = (newIP) => {
    const isDuplicate = pingStatus.some((item) => item.ip === newIP.ip);

    if (isDuplicate) {
      console.error(`Duplicate IP: ${newIP.ip}`);
    } else {
      setPingStatus((prevPingStatus) => [...prevPingStatus, newIP]);
    }

    handleAddIPFormClose();
  };
  const handleDeleteEntry = (ipToDelete) => {
    const updatedPingStatus = pingStatus.filter(
      (item) => item.ip !== ipToDelete
    );
    setPingStatus(updatedPingStatus);
  };

  useEffect(() => {
    handleClickStatus();
  });

  return (
    <Card className="h-full w-full overflow-hidden">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div className="flex w-full shrink-0 gap-2 md:w-max">
            <AddIPForm
              isOpen={addIPFormOpen}
              onClose={handleAddIPFormClose}
              onAddIP={handleAddIP}
            />
            <Button
              className="flex items-center gap-3"
              size="sm"
              color="green"
              onClick={handleAddIPClick}
            >
              <PlusIcon strokeWidth={2} className="h-4 w-4" /> Add
            </Button>
            <Button className="flex items-center gap-3" size="sm" color="blue">
              <ArrowDownOnSquareStackIcon strokeWidth={2} className="h-4 w-4" />{" "}
              Import
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardBody className="overflow-scroll px-0">
        <div className="overflow-x-hidden overflow-y-auto">
          <table className="w-full table-auto text-left">
            <colgroup>
              <col className="w-1/4" />
              <col className="w-1/4" />
              <col className="w-1/4" />
              <col className="w-1/4" />
              <col className="w-1/4" />
            </colgroup>
            <thead>
              <tr>
                {TABLE_HEAD.map((head, index) => (
                  <th
                    key={head}
                    className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                    onClick={index === 3 ? handleClickStatus : undefined} // Update status when clicking on the "Status" heading
                    style={index === 3 ? { cursor: "pointer" } : undefined}
                  >
                    <div className="flex items-center">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal leading-none opacity-70"
                      >
                        {head}
                      </Typography>
                      {index === 3 && (
                        <div className="ml-3">
                          <ArrowPathIcon
                            className={`h-4 w-4 transition-transform ${
                              loading ? "animate-spin" : ""
                            }`}
                          />
                        </div>
                      )}
                    </div>
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
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {ip}
                      </Typography>
                    </td>
                    <td className={`${classes} max-w-xs whitespace-nowrap`}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {hostname}
                      </Typography>
                    </td>
                    <td className={`${classes} max-w-xs whitespace-nowrap`}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {lastPinged.toLocaleTimeString()}
                      </Typography>
                    </td>
                    <td className={`${classes} max-w-xs whitespace-nowrap`}>
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
                            icon={
                              status === "Online" ? (
                                <CheckCircleIcon className="h-4 w-4" />
                              ) : status === "Exceeded Threshold" ? (
                                <ClockIcon className="h-4 w-4" />
                              ) : status === "Unknown" ? (
                                loading ? (
                                  <div className="h-4 w-4 border-solid rounded-full">
                                    <QuestionMarkCircleIcon className="h-4 w-4" />
                                  </div>
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
                      <Tooltip content="Delete Entry">
                        <IconButton
                          variant="text"
                          onClick={() => handleDeleteEntry(ip)}
                        >
                          <TrashIcon className="h-5 w-5 text-red-500" />
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
    </Card>
  );
}
