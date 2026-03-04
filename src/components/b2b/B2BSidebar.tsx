import {
  LayoutDashboard,
  Package,
  FileText,
  Settings,
  Car,
  Users,
  BarChart3,
  Wrench,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Dashboard", url: "/workshop", icon: LayoutDashboard },
  { title: "Parts", url: "/workshop/parts", icon: Package },
  { title: "Services", url: "/workshop/services", icon: Wrench },
  { title: "Invoices", url: "/workshop/invoices", icon: FileText },
];

const secondaryItems = [
  { title: "Customers", url: "/workshop/customers", icon: Users },
  { title: "Reports", url: "/workshop/reports", icon: BarChart3 },
  { title: "Settings", url: "/workshop/settings", icon: Settings },
];

export function B2BSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) =>
    path === "/workshop"
      ? currentPath === "/workshop"
      : currentPath.startsWith(path);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className={collapsed ? "p-2" : "p-4"}>
        <div className={`flex items-center overflow-hidden ${collapsed ? "justify-center" : "gap-3"}`}>
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent shadow-soft shrink-0">
            <Car className="w-4 h-4 text-accent-foreground" strokeWidth={1.5} />
          </div>
          <div className={`flex flex-col min-w-0 overflow-hidden whitespace-nowrap transition-opacity duration-200 ${collapsed ? "opacity-0 w-0" : "opacity-100"}`}>
            <span className="text-sm font-bold text-sidebar-foreground tracking-tight">
              Mobilis
            </span>
            <span className="text-[11px] text-muted-foreground leading-tight">
              Workshop Manager
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                  >
                    <NavLink
                      to={item.url}
                      end={item.url === "/workshop"}
                      className="hover:bg-sidebar-accent/50"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span className="overflow-hidden whitespace-nowrap">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Manage</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                  >
                    <NavLink
                      to={item.url}
                      className="hover:bg-sidebar-accent/50"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span className="overflow-hidden whitespace-nowrap">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 overflow-hidden">
        <div className="rounded-lg border border-border/50 bg-secondary/30 p-3 overflow-hidden whitespace-nowrap">
          <p className="text-xs font-medium text-foreground">Free Plan</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Upgrade for full features
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
