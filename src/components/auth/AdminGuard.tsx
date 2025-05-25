import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import GlobalLoading from "../loading/GlobalLoading";

import { getCurrentUser } from "@/features/auth/apis/getCurrentUser";
import useAuthStore from "@/store/authStore";

interface Props {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: Props) {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const { setCurrentUser, currentUser } = useAuthStore();

  const { data, error, isLoading } = useQuery({
    queryKey: ["info"],
    queryFn: () => getCurrentUser(),
    enabled: !!token,
    // Không gọi API nếu đã có dữ liệu trong localStorage
    staleTime: 5 * 60 * 1000, // 5 phút
  });

  useEffect(() => {
    if (!token || error) {
      navigate("/login");
    }
    if (data?.role?.name !== "admin") {
      navigate("/products");
    }
  }, [token, error, navigate, data]);

  // Set dữ liệu vào store
  useEffect(() => {
    if (data) {
      setCurrentUser(data);
    }
  }, [data, setCurrentUser]);

  // Nếu đã có dữ liệu trong store (từ localStorage) và đang không tải dữ liệu mới
  if (currentUser && !isLoading) {
    return children;
  }

  // Nếu có dữ liệu từ API
  if (data) {
    return children;
  }

  return <GlobalLoading />;
}
