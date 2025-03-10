"use client";

import type * as React from "react";
import {
  Banknote,
  Building2,
  Home,
  LayoutDashboard,
  Smartphone,
} from "lucide-react";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { DashboardLogo } from "./dashboard-logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, initials } = useAuth();
  const { t } = useTranslation();
  const { navigate } = useRouter();

  const menuItems = [
    {
      name: t("Dashboard"),
      onClick: () => {
        navigate({ to: "/admin" });
      },
      icon: LayoutDashboard,
    },
    {
      name: t("Companies"),
      onClick: () => {
        navigate({ to: "/admin/companies" });
      },
      icon: Building2,
    },
    {
      name: t("Models"),
      onClick: () => {
        navigate({ to: "/admin/models" });
      },
      icon: Smartphone,
    },
    {
      name: t("Trade Offers"),
      onClick: () => {
        navigate({ to: "/admin/trade-offers" });
      },
      icon: Banknote,
    },
    {
      name: t("homePage"),
      onClick: () => {
        navigate({ to: "/" });
      },
      icon: Home,
    },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <DashboardLogo />
      </SidebarHeader>
      <SidebarContent>
        <NavMain menuItems={menuItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: user?.firstName ?? "",
            email: user?.email ?? "",
            initials,
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
