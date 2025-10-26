"use client";

import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  User,
} from "lucide-react";
import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { NavSetting } from "./nav-setting";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Disdik",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Dashboard",
          url: "/disdik",
        },
        {
          title: "Kenaikan Pangkat",
          url: "/disdik/kenaikan-pangkat",
        },
        {
          title: "Status Dokumen Wajib",
          url: "/disdik/status-dokumen-wajib",
        },
        {
          title: "Golongan Pegawai",
          url: "/disdik/golongan-pegawai",
        },
        {
          title: "Status SK Kenpa",
          url: "/disdik/status-sk-kenaikan-pangkat",
        },
        {
          title: "Status Kenaikan Pangkat",
          url: "/disdik/status-kenaikan-pangkat",
        },
        {
          title: "Status Pegawai",
          url: "/disdik/status-pegawai",
        },
      ],
    },
    {
      title: "Dinkes",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Dashboard",
          url: "/dinkes",
        },
        {
          title: "Kenaikan Pangkat",
          url: "/dinkes/kenaikan-pangkat",
        },
        {
          title: "Status Dokumen Wajib",
          url: "/dinkes/status-dokumen-wajib",
        },
        {
          title: "Golongan Pegawai",
          url: "/dinkes/golongan-pegawai",
        },
        {
          title: "Status SK Kenpa",
          url: "/dinkes/status-sk-kenaikan-pangkat",
        },
        {
          title: "Status Kenaikan Pangkat",
          url: "/dinkes/status-kenaikan-pangkat",
        },
        {
          title: "Status Pegawai",
          url: "/dinkes/status-pegawai",
        },
      ],
    },
    {
      title: "Rsud",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Dashboard",
          url: "/rsud",
        },
        {
          title: "Kenaikan Pangkat",
          url: "/rsud/kenaikan-pangkat",
        },
        {
          title: "Status Dokumen Wajib",
          url: "/rsud/status-dokumen-wajib",
        },
        {
          title: "Golongan Pegawai",
          url: "/rsud/golongan-pegawai",
        },
        {
          title: "Status SK Kenpa",
          url: "/rsud/status-sk-kenaikan-pangkat",
        },
        {
          title: "Status Kenaikan Pangkat",
          url: "/rsud/status-kenaikan-pangkat",
        },
        {
          title: "Status Pegawai",
          url: "/rsud/status-pegawai",
        },
      ],
    },
  ],
  setting: [
    {
      name: "User",
      url: "/user",
      icon: User,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  // 🧠 Compute active state dynamically
  const navWithActive = React.useMemo(() => {
    return data.navMain.map((section) => {
      const updatedItems = section.items.map((item) => ({
        ...item,
        isActive: item.url.includes(pathname) || pathname === item.url, // highlight if exact match
      }));

      const isSectionActive = updatedItems.some((i) => i.isActive);

      return {
        ...section,
        items: updatedItems,
        isActive: isSectionActive,
      };
    });
  }, [pathname]);

  const { state } = useSidebar();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <AudioWaveform className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Kenaikan Pangkat</span>
                <span className="truncate text-xs">Enterprise</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navWithActive} />
        <NavSetting data={data.setting} />
      </SidebarContent>
      <SidebarFooter>
        {/* <SidebarMenu>
          <SidebarMenuItem> */}
        <UserButton
          showName={state === "expanded"}
          appearance={{
            elements: {
              rootBox: "!w-full",
              userButtonTrigger: "!w-full",
              userButtonBox: cn(
                state === "expanded"
                  ? "py-2 px-4 bg-neutral-800"
                  : "p-0 bg-transparent",
                "!w-full flex !justify-between items-center  rounded-md text-white"
              ),
            },
          }}
        />

        {/* <NavUser user={data.user} /> */}
        {/* </SidebarMenuItem> */}
        {/* </SidebarMenu> */}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
