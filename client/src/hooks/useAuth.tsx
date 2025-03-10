import { ApiResponse } from "@/lib/apiTypes";
import { useMutation } from "@tanstack/react-query";
import { type NavigateFn } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export type AuthResponse = {
  status: boolean;
  data: AuthUser;
  message?: string;
};

export type AuthUser = {
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export const useAuth = (navigate?: NavigateFn) => {
  const { t } = useTranslation();
  const [user, setUser] = useState<AuthUser | null>(null);

  const initials = user ? user.firstName[0] + user.lastName[0] : "";

  const loginMutation = useMutation<
    AuthResponse,
    AuthResponse,
    LoginCredentials
  >({
    mutationFn: async (val) => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(val),
        credentials: "include",
      });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.status) {
        console.log("Setting user to -->", data.data);
        setUser(data.data);
        localStorage.setItem("user", JSON.stringify(data.data));
        if (navigate) {
          console.log("There is navigate !!");
          navigate({ to: "/admin" });
        }
      } else {
        toast.error(data.message ?? t("genericError"));
      }
    },
    onError: () => {
      toast.error(t("genericError"));
    },
  });

  const logoutMutation = useMutation<ApiResponse, ApiResponse, unknown>({
    mutationFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
        method: "POST",
      });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.status) {
        setUser(null);
        localStorage.removeItem("user");
        if (navigate) {
          navigate({ to: "/" });
        }
      }
    },
    onError: () => {
      toast.error(t("genericError"));
    },
  });

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setUser(JSON.parse(user));
    }
  }, []);

  const signIn = (credentials: LoginCredentials) => {
    loginMutation.mutate(credentials);
  };

  const signOut = () => {
    logoutMutation.mutate(null);
  };

  const isLogged = !!user;

  return { signIn, signOut, isLogged, user, initials };
};

export type AuthContext = ReturnType<typeof useAuth>;
