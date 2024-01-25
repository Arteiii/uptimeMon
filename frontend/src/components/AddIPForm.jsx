import React, { useState } from "react";
import {
  Button,
  Dialog,
  Card,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Textarea,
} from "@material-tailwind/react";

export function AddIPForm() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    ip_address: "",
    host_name: "",
    note: "",
  });

  const handleOpen = () => setOpen((cur) => !cur);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`http://192.168.178.58:8000/ips/`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("IP added successfully!");
      } else {
        console.error("Error adding IP:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred during the request:", error);
    }

    handleOpen();
  };
  return (
    <>
      <Button
        onClick={handleOpen}
        color="green"
        className="flex items-center gap-3"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
          />
        </svg>
        Add IP
      </Button>
      <Dialog
        size="xs"
        open={open}
        handler={handleOpen}
        className="bg-transparent shadow-none"
      >
        <Card className="mx-auto w-full max-w-[24rem]">
          <CardBody className="flex flex-col gap-4">
            <Typography variant="h4" color="blue-gray">
              Add IP
            </Typography>
            <Typography
              className="mb-3 font-normal"
              variant="paragraph"
              color="gray"
            >
              Enter IP information:
            </Typography>
            <Input
              label="Name"
              size="lg"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            <Input
              label="IP Address"
              size="lg"
              name="ipAddress"
              value={formData.ipAddress}
              onChange={handleChange}
            />
            <Input
              label="Host Name"
              size="lg"
              name="hostName"
              value={formData.hostName}
              onChange={handleChange}
            />
            <Textarea
              size="lg"
              name="note"
              label="Note"
              value={formData.note}
              onChange={handleChange}
            />
          </CardBody>
          <CardFooter className="pt-0">
            <Button variant="gradient" onClick={handleSubmit} fullWidth>
              Add IP
            </Button>
          </CardFooter>
        </Card>
      </Dialog>
    </>
  );
}
