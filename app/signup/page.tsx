"use client";
import React, { useState } from "react";
import {
  Button,
  PasswordInput,
  TextInput,
  Notification,
  LoadingOverlay,
  Box,
} from "@mantine/core";
import { hasLength, isEmail, useForm } from "@mantine/form";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import { registerAdmin } from "@/lib/database/actions/admin/auth/register";

// AdminRegistrationForm Component
const AdminRegistrationForm = ({ onSuccess, onFailure }: any) => {
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: isEmail("Invalid Email."),
      password: hasLength(
        { min: 10 },
        "Password must be at least 10 characters long."
      ),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      const res = await registerAdmin(values.email, values.password);
      if (res?.success) {
        onSuccess();
      } else {
        onFailure(res?.message);
      }
    } catch (error) {
      onFailure((error as Error).toString());
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} className="w-[500px]">
      <TextInput
        {...form.getInputProps("email")}
        mt={"md"}
        label="Email"
        placeholder="Email"
        required
      />
      <PasswordInput
        {...form.getInputProps("password")}
        label="Password"
        placeholder="Password"
        required
      />
      <Button type="submit" mt={"md"}>
        Register
      </Button>
    </form>
  );
};

// SignUpPage Component
const SignUpPage = () => {
  const [successMessage, setSuccessMessage] = useState(false);
  const [failureMessage, setFailureMessage] = useState<{
    visible: boolean;
    message: string | undefined;
  }>({
    visible: false,
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSuccess = () => {
    setSuccessMessage(true);
    setFailureMessage({ visible: false, message: "" });
    setTimeout(() => {
      router.push("/admin/dashboard");
    }, 3000);
  };

  const handleFailure = (message: string) => {
    setSuccessMessage(false);
    setFailureMessage({ visible: true, message });
  };

  return (
    <div>
      <Navbar />
      <div className="flex justify-center">
        <div className="">
          <h1 className="text-3xl font-bold">Admin Registration</h1>
          {failureMessage.visible && (
            <Notification color="red" title="Error!" mt={"md"}>
              {failureMessage.message}
            </Notification>
          )}
          {successMessage && (
            <Notification
              color="teal"
              title="Registration Successful"
              mt={"md"}
            >
              You&apos;re being redirected to the dashboard
            </Notification>
          )}
          <Box pos={"relative"}>
            {loading && (
              <LoadingOverlay
                visible={loading}
                zIndex={1000}
                overlayProps={{ radius: "sm", blur: 2 }}
              />
            )}
            <AdminRegistrationForm
              onSuccess={handleSuccess}
              onFailure={handleFailure}
            />
          </Box>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
