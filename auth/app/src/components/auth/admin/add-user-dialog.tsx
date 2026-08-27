"use client";

import {
  useState
} from "react";
import {
  useRouter
} from "@tanstack/react-router";
import {
  UserPlus
} from "lucide-react";
import {
  toast
} from "sonner";

import {
  authClient
} from "@/lib/auth-client";
import {
  Button
} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldLabel
} from "@/components/ui/field";
import {
  Input
} from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type AssignableRole =
  | "user"
  | "admin-viewer"
  | "admin";

type AddUserDialogProps = {
  disabled?: boolean;
};

export function AddUserDialog({
  disabled = false,
}: AddUserDialogProps) {
  const router =
    useRouter();

  const [
    open,
    setOpen
  ] =
    useState(false);

  const [
    pending,
    setPending
  ] =
    useState(false);

  const [
    role,
    setRole
  ] =
    useState<AssignableRole>(
      "user"
    );

  async function createUser(
    formData: FormData
  ) {
    setPending(true);

    try {
      const name =
        String(
          formData.get(
            "name"
          ) ?? ""
        ).trim();

      const email =
        String(
          formData.get(
            "email"
          ) ?? ""
        )
          .trim()
          .toLowerCase();

      const password =
        String(
          formData.get(
            "password"
          ) ?? ""
        );

      if (!name) {
        throw new Error(
          "Name is required"
        );
      }

      if (!email) {
        throw new Error(
          "Email is required"
        );
      }

      if (
        password.length < 8
      ) {
        throw new Error(
          "Password must be at least 8 characters"
        );
      }

      const {
        error
      } =
        await authClient
          .admin
          .createUser({
            name,
            email,
            password,
            role,
          });

      if (error) {
        throw new Error(
          error.message ??
            "Unable to create user"
        );
      }

      toast.success(
        "User created"
      );

      setOpen(false);
      setRole("user");

      await router.invalidate();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to create user"
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <Button
        disabled={disabled}
        onClick={() =>
          setOpen(true)
        }
      >
        <UserPlus />
        Add User
      </Button>

      <Dialog
        open={open}
        onOpenChange={
          setOpen
        }
      >
        <DialogContent>
          <form
            action={(
              formData
            ) =>
              void createUser(
                formData
              )
            }
          >
            <DialogHeader>
              <DialogTitle>
                Add User
              </DialogTitle>

              <DialogDescription>
                Create a user and
                assign their initial
                access role.
              </DialogDescription>
            </DialogHeader>

            <div
              className=
                "grid gap-4 py-6"
            >
              <Field>
                <FieldLabel
                  htmlFor=
                    "add-user-name"
                >
                  Name
                </FieldLabel>

                <Input
                  id=
                    "add-user-name"
                  name="name"
                  autoComplete=
                    "name"
                  autoFocus
                  disabled={
                    pending
                  }
                  required
                />
              </Field>

              <Field>
                <FieldLabel
                  htmlFor=
                    "add-user-email"
                >
                  Email
                </FieldLabel>

                <Input
                  id=
                    "add-user-email"
                  name="email"
                  type="email"
                  autoComplete=
                    "email"
                  disabled={
                    pending
                  }
                  required
                />
              </Field>

              <Field>
                <FieldLabel
                  htmlFor=
                    "add-user-password"
                >
                  Temporary Password
                </FieldLabel>

                <Input
                  id=
                    "add-user-password"
                  name="password"
                  type="password"
                  autoComplete=
                    "new-password"
                  minLength={8}
                  disabled={
                    pending
                  }
                  required
                />
              </Field>

              <Field>
                <FieldLabel>
                  Access Role
                </FieldLabel>

                <Select
                  value={role}
                  onValueChange={(
                    value
                  ) =>
                    setRole(
                      value as
                        AssignableRole
                    )
                  }
                  disabled={
                    pending
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem
                      value="user"
                    >
                      User
                    </SelectItem>

                    <SelectItem
                      value=
                        "admin-viewer"
                    >
                      Admin Viewer ·
                      Read only
                    </SelectItem>

                    <SelectItem
                      value="admin"
                    >
                      Admin · Full
                      access
                    </SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={
                  pending
                }
                onClick={() =>
                  setOpen(false)
                }
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={
                  pending
                }
              >
                {pending
                  ? "Creating…"
                  : "Create User"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
