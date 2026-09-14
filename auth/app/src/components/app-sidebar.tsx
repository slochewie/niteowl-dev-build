"use client";

import {
	Blocks,
	Building2,
	LayoutDashboard,
	ShieldCheck,
	UserCircle,
	Users,
} from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
	appDefinitionsById,
	buildNavigation,
	getDefaultAppUrls,
	getDeploymentBrand,
} from "@niteowl/app-config";
import {
	AppSidebarIdentity,
	NiteOwlNavigationIcon,
	useCurrentHostname,
} from "@niteowl/ui";

import { useAdminAccess } from "@/components/auth/admin/admin-access-context";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	SidebarRail,
	SidebarSeparator,
	useSidebar,
} from "@/components/ui/sidebar";

const CONSOLE_APP = appDefinitionsById.console;

export function AppSidebar() {
	const { canView, readOnly } = useAdminAccess();
	const { isMobile, setOpenMobile, toggleSidebar } = useSidebar();
	const hostname = useCurrentHostname();

	const pathname = useRouterState({
		select: (state) => state.location.pathname,
	});

	const appLinks = hostname ? getDefaultAppUrls(hostname) : null;
	const brand = hostname ? getDeploymentBrand(hostname) : null;

	const currentHref = appLinks
		? `${appLinks.console.replace(/\/$/, "")}${pathname}`
		: null;

	const navigation = appLinks
		? buildNavigation({
				currentApp: "console",
				currentPath: pathname,
				urls: appLinks,
			})
		: null;

	const organizationMatch =
		/^\/organization\/([^/]+)\/(settings|people|teams)(?:\/|$)/.exec(
			pathname,
		);

	const activeOrganizationSlug = organizationMatch?.[1] ?? null;

	const settingsNavigation = [
		{
			title: "Account",
			to: "/settings/account",
			icon: UserCircle,
		},
		{
			title: "Security",
			to: "/settings/security",
			icon: ShieldCheck,
		},
		{
			title: "Organizations",
			to: "/settings/organizations",
			icon: Building2,
		},
	];

	const adminNavigation = [
		{
			title: "Users",
			to: "/users",
			icon: Users,
		},
		{
			title: "Organizations",
			to: "/organizations",
			icon: Building2,
		},
		{
			title: "Plugins & APIs",
			to: "/plugins",
			icon: Blocks,
		},
	];

	function closeMobileSidebar() {
		if (isMobile) {
			setOpenMobile(false);
		}
	}

	function navigationItem(item: {
		title: string;
		to: string;
		icon: typeof LayoutDashboard;
	}) {
		const isActive =
			item.to === "/"
				? pathname === "/"
				: item.to === "/settings/organizations"
					? pathname.startsWith("/settings/organizations") ||
						pathname.startsWith("/organization/")
					: pathname.startsWith(item.to);

		return (
			<SidebarMenuItem key={item.to}>
				<SidebarMenuButton
					asChild
					isActive={isActive}
					tooltip={item.title}
				>
					<Link to={item.to} onClick={closeMobileSidebar}>
						<item.icon />
						<span>{item.title}</span>
					</Link>
				</SidebarMenuButton>
			</SidebarMenuItem>
		);
	}

	return (
		<Sidebar collapsible="icon">
			<SidebarHeader>
				{currentHref && brand ? (
					<AppSidebarIdentity
						href={currentHref}
						brand={brand}
						appName={CONSOLE_APP.label}
						onToggle={toggleSidebar}
					/>
				) : (
					<div className="h-12" aria-hidden="true" />
				)}
			</SidebarHeader>

			<SidebarSeparator />

			<SidebarContent>
				{navigation
					? [...navigation.primary, ...navigation.apps].map((group) => (
							<SidebarGroup key={group.id}>
								{group.label ? (
									<SidebarGroupLabel>{group.label}</SidebarGroupLabel>
								) : null}

								<SidebarGroupContent>
									<SidebarMenu>
										{group.items.map((item) => (
											<SidebarMenuItem key={item.id}>
												<SidebarMenuButton
													asChild
													isActive={item.active}
													tooltip={item.label}
												>
													{item.external ? (
														<a href={item.href} onClick={closeMobileSidebar}>
															<NiteOwlNavigationIcon icon={item.icon} />
															<span>{item.label}</span>
														</a>
													) : (
														<Link to={item.href} onClick={closeMobileSidebar}>
															<NiteOwlNavigationIcon icon={item.icon} />
															<span>{item.label}</span>
														</Link>
													)}
												</SidebarMenuButton>
											</SidebarMenuItem>
										))}
									</SidebarMenu>
								</SidebarGroupContent>
							</SidebarGroup>
						))
					: null}

				<SidebarSeparator />

				<SidebarGroup>
					<SidebarGroupLabel className="text-sm">Settings</SidebarGroupLabel>

					<SidebarGroupContent>
						<SidebarMenu>
							{settingsNavigation.map((item) => {
								if (item.to !== "/settings/organizations") {
									return navigationItem(item);
								}

								const isActive =
									pathname.startsWith("/settings/organizations") ||
									pathname.startsWith("/organization/");

								return (
									<SidebarMenuItem key={item.to}>
										<SidebarMenuButton
											asChild
											isActive={isActive}
											tooltip={item.title}
										>
											<Link to={item.to} onClick={closeMobileSidebar}>
												<item.icon />
												<span>{item.title}</span>
											</Link>
										</SidebarMenuButton>

										{activeOrganizationSlug && (
											<SidebarMenuSub>
												<SidebarMenuSubItem>
													<SidebarMenuSubButton
														asChild
														isActive={
															pathname ===
															`/organization/${activeOrganizationSlug}/settings`
														}
													>
														<Link
															to="/organization/$slug/$path"
															params={{
																slug: activeOrganizationSlug,
																path: "settings",
															}}
															onClick={closeMobileSidebar}
														>
															Settings
														</Link>
													</SidebarMenuSubButton>
												</SidebarMenuSubItem>

												<SidebarMenuSubItem>
													<SidebarMenuSubButton
														asChild
														isActive={
															pathname ===
															`/organization/${activeOrganizationSlug}/people`
														}
													>
														<Link
															to="/organization/$slug/$path"
															params={{
																slug: activeOrganizationSlug,
																path: "people",
															}}
															onClick={closeMobileSidebar}
														>
															People
														</Link>
													</SidebarMenuSubButton>
												</SidebarMenuSubItem>

												<SidebarMenuSubItem>
													<SidebarMenuSubButton
														asChild
														isActive={
															pathname ===
															`/organization/${activeOrganizationSlug}/teams`
														}
													>
														<Link
															to="/organization/$slug/$path"
															params={{
																slug: activeOrganizationSlug,
																path: "teams",
															}}
															onClick={closeMobileSidebar}
														>
															Teams
														</Link>
													</SidebarMenuSubButton>
												</SidebarMenuSubItem>
											</SidebarMenuSub>
										)}
									</SidebarMenuItem>
								);
							})}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				{canView && (
					<>
						<SidebarSeparator />

						<SidebarGroup>
							<SidebarGroupLabel className="text-sm">
								{readOnly ? "Admin · Read only" : "Admin"}
							</SidebarGroupLabel>

							<SidebarGroupContent>
								<SidebarMenu>
									{adminNavigation.map(navigationItem)}
								</SidebarMenu>
							</SidebarGroupContent>
						</SidebarGroup>
					</>
				)}
			</SidebarContent>

			<SidebarRail />
		</Sidebar>
	);
}
