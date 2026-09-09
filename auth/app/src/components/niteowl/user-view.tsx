import {
	type UsernameAuthClient,
	useAuth,
	useSession,
} from "@better-auth-ui/react";
import type { User } from "better-auth";

import { NiteOwlUserAvatar } from "@/components/niteowl/user-avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type ViewUser = Partial<User> & {
	username?: string | null;
	displayUsername?: string | null;
};

export type NiteOwlUserViewProps = {
	className?: string;
	isPending?: boolean;
	hideSubtitle?: boolean;
	user?: ViewUser;
};

export function NiteOwlUserView({
	className,
	isPending,
	hideSubtitle = false,
	user,
}: NiteOwlUserViewProps) {
	const { authClient } = useAuth();
	const { data: session, isPending: sessionPending } = useSession(
		authClient as UsernameAuthClient,
		{ enabled: !user && !isPending },
	);

	const resolvedUser = user ?? session?.user;

	if ((isPending || sessionPending) && !user) {
		return (
			<div className={cn("flex min-w-0 items-center gap-2", className)}>
				<NiteOwlUserAvatar isPending />

				<div className="grid flex-1 gap-1 text-left text-sm">
					<Skeleton className="h-4 w-24" />

					{!hideSubtitle && <Skeleton className="h-3 w-32" />}
				</div>
			</div>
		);
	}

	return (
		<div className={cn("flex min-w-0 items-center gap-2", className)}>
			<NiteOwlUserAvatar user={resolvedUser} />

			<div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
				<span className="truncate font-medium text-foreground">
					{resolvedUser?.displayUsername ||
						resolvedUser?.name ||
						resolvedUser?.email}
				</span>

				{!hideSubtitle &&
					(resolvedUser?.displayUsername || resolvedUser?.name) && (
						<span className="truncate text-xs text-muted-foreground">
							{resolvedUser?.email}
						</span>
					)}
			</div>
		</div>
	);
}
