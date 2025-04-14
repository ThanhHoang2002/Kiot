import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";


import GlobalLoading from "../loading/GlobalLoading";

import { getCurrentUser } from "@/features/auth/apis/getCurrentUser";
import useAuthStore from "@/store/authStore";

interface Props {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: Props) {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const {setCurrentUser} = useAuthStore()

  const { data, error } = useQuery({
    queryKey: ["info"],
    queryFn: () => getCurrentUser(),
    enabled: !!token,
  });
  useEffect(() => {
    if (!token || error) {
      navigate("/login");
    }
  }, [token, error, navigate]);

  // set to store
  useEffect(() => {
    if (data) {
      setCurrentUser(data);
    }
  }, [data, setCurrentUser]);

  if (data) {
    return children;
  }

  return <GlobalLoading />;
}
