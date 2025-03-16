import { Home, Users, LucideIcon, Upload } from "lucide-react";

export type Route = {
    url: string;
    title: string;
    icon: LucideIcon;
}

export type RouteGroup = {
    title: string;
    initialRoute: Route;
    routes: Route[];
}

export const mainRoutes: Route[] = [
    {
        url: "/dashboard/contacts",
        title: "Contacts",
        icon: Users,
    },
    {
        url: "/dashboard/contacts/import",
        title: "Import",
        icon: Upload,
    }
]

export const routeGroups: RouteGroup[] = [
    {
        title: "Platform",
        initialRoute: mainRoutes[0],
        routes: mainRoutes,
    }
]
