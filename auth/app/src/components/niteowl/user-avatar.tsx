"use client";

import {
	type UsernameAuthClient,
	useAuth,
	useSession,
} from "@better-auth-ui/react";
import type { User } from "better-auth";
import { User2 } from "lucide-react";
import type { ReactNode } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type AvatarUser = Partial<User> & {
	username?: string | null;
	displayUsername?: string | null;
};

export type NiteOwlUserAvatarProps = {
	className?: string;
	fallback?: ReactNode;
	isPending?: boolean;
	user?: AvatarUser;
};

export function getUserInitials(user?: AvatarUser | null) {
	const nameParts = user?.name?.trim().split(/\s+/).filter(Boolean);

	if (nameParts?.length) {
		const firstInitial = nameParts[0]?.[0] ?? "";
		const lastInitial =
			nameParts.length > 1 ? (nameParts[nameParts.length - 1]?.[0] ?? "") : "";

		return `${firstInitial}${lastInitial}`.toUpperCase();
	}

	const fallbackIdentity =
		user?.displayUsername?.trim() ||
		user?.username?.trim() ||
		user?.email?.split("@")[0]?.trim();

	return fallbackIdentity?.slice(0, 2).toUpperCase();
}

export function NiteOwlUserAvatar({
	className,
	user,
	isPending,
	fallback,
}: NiteOwlUserAvatarProps) {
	const { authClient } = useAuth();
	const { data: session, isPending: sessionPending } = useSession(
		authClient as UsernameAuthClient,
		{ enabled: !user && !isPending },
	);

	if ((isPending || sessionPending) && !user) {
		return <Skeleton className={cn("size-8 rounded-full", className)} />;
	}

	const resolvedUser = user ?? session?.user;
	const initials = getUserInitials(resolvedUser);

	return (
		<Avatar
			className={cn(
				"size-8 rounded-full bg-muted text-sm text-foreground",
				className,
			)}
		>
			<AvatarImage
				src={resolvedUser?.image?.trim() || undefined}
				alt={
					resolvedUser?.name ||
					resolvedUser?.displayUsername ||
					resolvedUser?.username ||
					resolvedUser?.email ||
					"User"
				}
			/>

			<AvatarFallback className="text-muted-foreground!">
				{fallback || initials || <User2 className="size-4" />}
			</AvatarFallback>
		</Avatar>
	);
}
