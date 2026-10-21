"use client";

import { useQuery } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	getAdminGlauthUsers,
	getAdminGlauthGroups,
	type AdminGlauthSource,
} from "@/lib/admin/plugins";

export function GlauthDirectory({ source }: { source: AdminGlauthSource }) {
	const [open, setOpen] = useState(false);
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" size="sm">
					View Directory
				</Button>
			</DialogTrigger>
			<DialogContent className="max-h-[85dvh] overflow-y-auto sm:max-w-3xl">
				<DialogHeader>
					<DialogTitle className="break-words pr-6">
						{source.name} Directory
					</DialogTitle>
					<DialogDescription>
						Read-only reconciled users and groups. Refresh reads the latest
						saved records.
					</DialogDescription>
				</DialogHeader>
				{open && <DirectoryContents sourceId={source.id} />}
			</DialogContent>
		</Dialog>
	);
}

function DirectoryContents({ sourceId }: { sourceId: string }) {
	const users = useQuery({
		queryKey: ["glauth-directory-users", sourceId],
		queryFn: () => getAdminGlauthUsers({ data: { sourceId } }),
		staleTime: 0,
		gcTime: 0,
		retry: false,
	});
	const groups = useQuery({
		queryKey: ["glauth-directory-groups", sourceId],
		queryFn: () => getAdminGlauthGroups({ data: { sourceId } }),
		staleTime: 0,
		gcTime: 0,
		retry: false,
	});
	const refreshing = users.isFetching || groups.isFetching;
	return (
		<Tabs defaultValue="users" className="min-w-0">
			<div className="flex flex-wrap items-center justify-between gap-2">
				<TabsList aria-label="Directory records">
					<TabsTrigger value="users">Users</TabsTrigger>
					<TabsTrigger value="groups">Groups</TabsTrigger>
				</TabsList>
				<Button
					variant="outline"
					size="sm"
					disabled={refreshing}
					onClick={() => {
						void users.refetch();
						void groups.refetch();
					}}
				>
					<RefreshCw
						className={refreshing ? "animate-spin" : ""}
						aria-hidden="true"
					/>
					{refreshing ? "Refreshing…" : "Refresh"}
				</Button>
			</div>
			<TabsContent value="users">
				{users.isPending ? (
					<p role="status">Loading users…</p>
				) : users.isError ? (
					<p role="alert">Unable to load users. Use Refresh to try again.</p>
				) : !users.data.users?.length ? (
					<p role="status">No reconciled users for this source.</p>
				) : (
					<div className="overflow-x-auto rounded-md border">
						<table className="w-full text-left text-sm">
							<caption className="sr-only">
								Reconciled users for this source
							</caption>
							<thead>
								<tr>
									{[
										"Username",
										"Name",
										"Email",
										"UID",
										"Primary GID",
										"Status",
									].map((label) => (
										<th
											key={label}
											scope="col"
											className="whitespace-nowrap p-3"
										>
											{label}
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{users.data.users.map((user) => (
									<tr key={user.uidNumber} className="border-t">
										<td className="p-3 break-words">{user.name}</td>
										<td className="p-3">
											{[user.givenName, user.sn].filter(Boolean).join(" ") ||
												"—"}
										</td>
										<td className="p-3 break-all">{user.mail}</td>
										<td className="p-3">{user.uidNumber}</td>
										<td className="p-3">{user.primaryGroup}</td>
										<td className="p-3">
											{user.disabled ? "Disabled" : "Active"}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</TabsContent>
			<TabsContent value="groups">
				{groups.isPending ? (
					<p role="status">Loading groups…</p>
				) : groups.isError ? (
					<p role="alert">Unable to load groups. Use Refresh to try again.</p>
				) : !groups.data.groups?.length ? (
					<p role="status">No reconciled groups for this source.</p>
				) : (
					<div className="overflow-x-auto rounded-md border">
						<table className="w-full text-left text-sm">
							<caption className="sr-only">
								Reconciled groups for this source
							</caption>
							<thead>
								<tr>
									<th scope="col" className="p-3">
										Group
									</th>
									<th scope="col" className="p-3">
										GID
									</th>
								</tr>
							</thead>
							<tbody>
								{groups.data.groups.map((group) => (
									<tr key={group.gidNumber} className="border-t">
										<td className="p-3 break-all">{group.name}</td>
										<td className="p-3">{group.gidNumber}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</TabsContent>
		</Tabs>
	);
}
