"use client";

import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
	Ban,
	KeyRound,
	Pencil,
	ShieldCheck,
	UserRoundCheck,
} from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { sendAdminSetupEmail } from "@/lib/admin/users";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

type AssignableAdminRole = "user" | "admin-viewer" | "admin";

type UserAdminActionsProps = {
	user: {
		id: string;
		name: string;
		email: string;
		username: string | null;
		displayUsername: string | null;
		role: string | null;
		banned: boolean;
	};
};

function getAssignableRole(role: string | null): AssignableAdminRole {
	switch (role) {
		case "admin":
		case "admin-viewer":
			return role;

		default:
			return "user";
	}
}

export function UserAdminActions({ user }: UserAdminActionsProps) {
	const navigate = useNavigate();

	const [editOpen, setEditOpen] = useState(false);

	const [passwordOpen, setPasswordOpen] = useState(false);

	const [banOpen, setBanOpen] = useState(false);

	const [roleOpen, setRoleOpen] = useState(false);

	const [selectedRole, setSelectedRole] = useState<AssignableAdminRole>(() =>
		getAssignableRole(user.role),
	);

	const [pending, setPending] = useState(false);

  async function sendSetupEmail() {
    setPending(true);

    try {
      await sendAdminSetupEmail({ data: { userId: user.id } });
      toast.success("Setup email requested for " + user.email);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to send setup email",
      );
    } finally {
      setPending(false);
    }
  }

	async function refreshUser() {
		await navigate({
			to: "/users/$userId",
			params: {
				userId: user.id,
			},
			replace: true,
		});
	}

	async function updateProfile(formData: FormData) {
		setPending(true);

		try {
			const name = String(formData.get("name") ?? "").trim();

			const username = String(formData.get("username") ?? "").trim();

			const displayUsername = String(
				formData.get("displayUsername") ?? "",
			).trim();

			const { error } = await authClient.admin.updateUser({
				userId: user.id,

				data: {
					name,

					username: username || null,

					displayUsername: displayUsername || null,
				},
			});

			if (error) {
				throw new Error(error.message ?? "Unable to update user");
			}

			toast.success("User profile updated");

			setEditOpen(false);

			await refreshUser();
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Unable to update user",
			);
		} finally {
			setPending(false);
		}
	}

	async function setPassword(formData: FormData) {
		setPending(true);

		try {
			const newPassword = String(formData.get("password") ?? "");

			if (newPassword.length < 8) {
				throw new Error("Password must be at least 8 characters");
			}

			const { error } = await authClient.admin.setUserPassword({
				userId: user.id,
				newPassword,
			});

			if (error) {
				throw new Error(error.message ?? "Unable to change password");
			}

			toast.success("Password updated");

			setPasswordOpen(false);
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Unable to change password",
			);
		} finally {
			setPending(false);
		}
	}

	async function impersonateUser() {
		setPending(true);

		try {
			const { error } = await authClient.admin.impersonateUser({
				userId: user.id,
			});

			if (error) {
				throw new Error(error.message ?? "Unable to impersonate user");
			}

			toast.success(`Now impersonating ${user.name}`);

			window.location.href = "/";
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Unable to impersonate user",
			);

			setPending(false);
		}
	}

	async function updateRole() {
		setPending(true);

		try {
			const { error } = await authClient.admin.setRole({
				userId: user.id,
				role: selectedRole,
			});

			if (error) {
				throw new Error(error.message ?? "Unable to update role");
			}

			toast.success("User role updated");

			setRoleOpen(false);

			await refreshUser();
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Unable to update role",
			);
		} finally {
			setPending(false);
		}
	}

	async function toggleBan(formData?: FormData) {
		setPending(true);

		try {
			if (user.banned) {
				const { error } = await authClient.admin.unbanUser({
					userId: user.id,
				});

				if (error) {
					throw new Error(error.message ?? "Unable to unban user");
				}

				toast.success("User unbanned");
			} else {
				const reason = String(formData?.get("reason") ?? "").trim();

				const { error } = await authClient.admin.banUser({
					userId: user.id,
					banReason: reason || undefined,
				});

				if (error) {
					throw new Error(error.message ?? "Unable to ban user");
				}

				toast.success("User banned");
			}

			setBanOpen(false);

			await refreshUser();
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: user.banned
						? "Unable to unban user"
						: "Unable to ban user",
			);
		} finally {
			setPending(false);
		}
	}

	return (
		<>
			<div className="space-y-2">
				<Button
					variant="outline"
					className="w-full justify-start"
					onClick={() => setEditOpen(true)}
				>
					<Pencil />
					Edit Profile
				</Button>

				<Button
					variant="outline"
					className="w-full justify-start"
					onClick={() => setPasswordOpen(true)}
				>
					<KeyRound />
					Change Password
				</Button>

        <Button
          type="button"
          variant="outline"
          className="w-full justify-start"
          disabled={pending || user.banned}
          onClick={() => void sendSetupEmail()}
        >
          <KeyRound data-icon="inline-start" />
          Send setup email
        </Button>

				<Button
					variant="outline"
					className="w-full justify-start"
					onClick={() => {
						setSelectedRole(getAssignableRole(user.role));
						setRoleOpen(true);
					}}
				>
					<ShieldCheck />
					Change Access Role
				</Button>

				<Button
					variant="outline"
					className="w-full justify-start"
					disabled={pending}
					onClick={() => void impersonateUser()}
				>
					<UserRoundCheck />
					Impersonate User
				</Button>
			</div>

			<div className="space-y-2">
				<div className="text-xs font-medium text-muted-foreground">
					Destructive Actions
				</div>

				<Button
					variant="destructive"
					className="w-full justify-start"
					disabled={pending}
					onClick={() => {
						if (user.banned) {
							void toggleBan();
						} else {
							setBanOpen(true);
						}
					}}
				>
					<Ban />

					{user.banned ? "Unban User" : "Ban User"}
				</Button>
			</div>

			<Dialog open={roleOpen} onOpenChange={setRoleOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Change Access Role</DialogTitle>

						<DialogDescription>
							Choose the global access level for {user.email}.
						</DialogDescription>
					</DialogHeader>

					<div className="grid gap-2 py-6">
						<Field>
							<FieldLabel>Access role</FieldLabel>

							<Select
								value={selectedRole}
								onValueChange={(value) =>
									setSelectedRole(value as AssignableAdminRole)
								}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>

								<SelectContent>
									<SelectItem value="user">User</SelectItem>

									<SelectItem value="admin-viewer">
										Admin Viewer · Read only
									</SelectItem>

									<SelectItem value="admin">Admin · Full access</SelectItem>
								</SelectContent>
							</Select>
						</Field>
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							disabled={pending}
							onClick={() => setRoleOpen(false)}
						>
							Cancel
						</Button>

						<Button
							type="button"
							disabled={
								pending || selectedRole === getAssignableRole(user.role)
							}
							onClick={() => void updateRole()}
						>
							Save Role
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Dialog open={editOpen} onOpenChange={setEditOpen}>
				<DialogContent>
					<form action={(formData) => void updateProfile(formData)}>
						<DialogHeader>
							<DialogTitle>Edit Profile</DialogTitle>

							<DialogDescription>
								Update this user's profile information.
							</DialogDescription>
						</DialogHeader>

						<div className="grid gap-4 py-6">
							<Field>
								<FieldLabel htmlFor="name">Name</FieldLabel>

								<Input
									id="name"
									name="name"
									defaultValue={user.name}
									required
								/>
							</Field>

							<Field>
								<FieldLabel htmlFor="username">Username</FieldLabel>

								<Input
									id="username"
									name="username"
									defaultValue={user.username ?? ""}
								/>
							</Field>

							<Field>
								<FieldLabel htmlFor="displayUsername">
									Display Username
								</FieldLabel>

								<Input
									id="displayUsername"
									name="displayUsername"
									defaultValue={user.displayUsername ?? ""}
								/>
							</Field>
						</div>

						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => setEditOpen(false)}
							>
								Cancel
							</Button>

							<Button type="submit" disabled={pending}>
								Save Changes
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			<Dialog open={passwordOpen} onOpenChange={setPasswordOpen}>
				<DialogContent>
					<form action={(formData) => void setPassword(formData)}>
						<DialogHeader>
							<DialogTitle>Change Password</DialogTitle>

							<DialogDescription>
								Set a new password for {user.email}.
							</DialogDescription>
						</DialogHeader>

						<div className="py-6">
							<Field>
								<FieldLabel htmlFor="password">New Password</FieldLabel>

								<Input
									id="password"
									name="password"
									type="password"
									minLength={8}
									autoComplete="new-password"
									required
								/>
							</Field>
						</div>

						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => setPasswordOpen(false)}
							>
								Cancel
							</Button>

							<Button type="submit" disabled={pending}>
								Change Password
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			<Dialog open={banOpen} onOpenChange={setBanOpen}>
				<DialogContent>
					<form action={(formData) => void toggleBan(formData)}>
						<DialogHeader>
							<DialogTitle>Ban User</DialogTitle>

							<DialogDescription>
								Banning this user prevents them from signing in and revokes
								their current sessions.
							</DialogDescription>
						</DialogHeader>

						<div className="py-6">
							<Field>
								<FieldLabel htmlFor="reason">Reason</FieldLabel>

								<Input
									id="reason"
									name="reason"
									placeholder="Optional ban reason"
								/>
							</Field>
						</div>

						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => setBanOpen(false)}
							>
								Cancel
							</Button>

							<Button type="submit" variant="destructive" disabled={pending}>
								Ban User
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</>
	);
}
