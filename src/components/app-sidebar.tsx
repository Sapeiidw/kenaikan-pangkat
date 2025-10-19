"use client";

import * as React from "react";
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
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
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
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

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
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Dashboard",
          url: "/disdik",
        },
        {
          title: "Tambah Data",
          url: "/disdik/tambah-data",
        },
      ],
    },
    {
      title: "Dinkes",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Dashboard",
          url: "/dinkes",
        },
        {
          title: "Tambah Data",
          url: "/dinkes/tambah-data",
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
          title: "Tambah Data",
          url: "/rsud/tambah-data",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
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

  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

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
        <NavProjects projects={data.projects} />
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
