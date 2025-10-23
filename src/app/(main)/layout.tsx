"use client";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Protect } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname(); // e.g. "/dashboard/users/123/edit"
  const segments = pathname.split("/").filter(Boolean); // ["dashboard", "users", "123", "edit"]

  return (
    <Protect fallback={<div>Loading...</div>}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <Breadcrumb className="sticky top-0">
                <BreadcrumbList>
                  {segments.map((segment, i) => (
                    <>
                      <BreadcrumbItem className="hidden md:block capitalize">
                        {i === segments.length - 1 ? (
                          <BreadcrumbPage>
                            {segment.replace("-", " ")}
                          </BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink
                            key={segment}
                            href={`/${segments.slice(0, i + 1).join("/")}`}
                          >
                            {segment.replace("-", " ")}
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {i !== segments.length - 1 && (
                        <BreadcrumbSeparator className="hidden md:block" />
                      )}
                    </>
                  ))}
                  {/* <BreadcrumbItem>
                    <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                  </BreadcrumbItem> */}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="grid grid-cols-12 gap-4 w-full p-4 bg-neutral-200 min-h-screen content-start">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </Protect>
  );
}
