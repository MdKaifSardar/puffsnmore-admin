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
import { loginAdmin } from "@/lib/database/actions/admin/auth/login"; // Adjusted function name for clarity

const SignInPage = () => {
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

  const [successMessage, setSuccessMessage] = useState(false);
  const [failureMessage, setFailureMessage] = useState<{
    visible: boolean;
    message: string | undefined;
  }>({ visible: false, message: "" });
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (values: typeof form.values) => {
    try {
      setLoading(true);
      await loginAdmin(values.email, values.password) // Calling the admin-specific function
        .then((res) => {
          if (res?.success) {
            setSuccessMessage(true);
            setFailureMessage({ visible: false, message: "" });
            setTimeout(() => {
              router.push("/admin/dashboard");
            }, 3000);
          } else if (!res?.success) {
            setSuccessMessage(false);
            setFailureMessage({ visible: true, message: res?.message });
          }
        })
        .catch((err) => {
          setFailureMessage({ visible: true, message: err.toString() });
        });
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex justify-center items-center h-fit bg-gray-100">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">Admin Sign In</h1>
          {failureMessage.visible && (
            <Notification color="red" title="Error!" mt={"md"}>
              {failureMessage.message}
            </Notification>
          )}
          {successMessage && (
            <Notification color="teal" title="Successfully Logged In" mt={"md"}>
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
            <form
              onSubmit={form.onSubmit((values) => {
                handleSubmit(values);
              })}
              className="flex flex-col gap-4"
            >
              <TextInput
                {...form.getInputProps("email")}
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
              <Button type="submit" className="w-full">
                {loading ? "Loading..." : "Sign In"}
              </Button>
            </form>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
