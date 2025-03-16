import { Home, Users, LucideIcon } from "lucide-react";

type Route = {
    url: string;
    title: string;
    icon: LucideIcon;
}

type RouteGroup = {
    title: string;
    initialRoute: Route;
    routes: Route[];
}

export const mainRoutes: Route[] = [
    {
        url: "/",
        title: "Home",
        icon: Home,
    },
    {
        url: "/contacts",
        title: "Contacts",
        icon: Users,
    }
]

export const routeGroups: RouteGroup[] = [
    {
        title: "Platform",
        initialRoute: mainRoutes[0],
        routes: mainRoutes,
    }
]
