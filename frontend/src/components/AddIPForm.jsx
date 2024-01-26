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

export function AddIPForm({ isOpen, onClose, onAddIP }) {
  const [formData, setFormData] = useState({
    name: "",
    ip_address: "",
    host_name: "",
    note: "",
  });

  const handleToggle = () => onClose();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    const newIP = {
      ip: formData.ip_address,
      hostname: formData.host_name,
      lastPinged: new Date(),
      status: "Unknown",
    };

    onAddIP(newIP);
  };

  // Handle click on form fields to prevent modal from closing
  const handleClickField = (e) => {
    e.stopPropagation();
  };

  return (
    <Dialog
      size="xs"
      open={isOpen}
      handler={onClose}
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
            onClick={handleClickField}
          />
          <Input
            label="IP Address"
            size="lg"
            name="ip_address"
            value={formData.ip_address}
            onChange={handleChange}
            onClick={handleClickField}
          />
          <Input
            label="Host Name"
            size="lg"
            name="host_name"
            value={formData.host_name}
            onChange={handleChange}
            onClick={handleClickField}
          />
        </CardBody>
        <CardFooter className="pt-0">
          <Button variant="gradient" onClick={handleSubmit} fullWidth>
            Add IP
          </Button>
        </CardFooter>
      </Card>
    </Dialog>
  );
}
