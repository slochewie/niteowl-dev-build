import { d as getLocalizedError } from "./chunk-KS7QMNEN-DP7ssmzE.js";
import { useContext, useRef, useSyncExternalStore, useCallback, useState, useEffect, createContext, useMemo } from "react";
import { toast } from "sonner";
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from "@wojtekmaj/react-recaptcha-v3";
import { jsxs, jsx } from "react/jsx-runtime";
import { l as usePluginOverrides, m as accountViewPaths, p as organizationViewPaths, o as authViewPaths } from "./router-DU5jczZR.js";
var ADMIN_ERROR_CODES = {
  FAILED_TO_CREATE_USER: "Failed to create user",
  USER_ALREADY_EXISTS: "User already exists",
  YOU_CANNOT_BAN_YOURSELF: "You cannot ban yourself",
  YOU_ARE_NOT_ALLOWED_TO_CHANGE_USERS_ROLE: "You are not allowed to change users role",
  YOU_ARE_NOT_ALLOWED_TO_CREATE_USERS: "You are not allowed to create users",
  YOU_ARE_NOT_ALLOWED_TO_LIST_USERS: "You are not allowed to list users",
  YOU_ARE_NOT_ALLOWED_TO_LIST_USERS_SESSIONS: "You are not allowed to list users sessions",
  YOU_ARE_NOT_ALLOWED_TO_BAN_USERS: "You are not allowed to ban users",
  YOU_ARE_NOT_ALLOWED_TO_IMPERSONATE_USERS: "You are not allowed to impersonate users",
  YOU_ARE_NOT_ALLOWED_TO_REVOKE_USERS_SESSIONS: "You are not allowed to revoke users sessions",
  YOU_ARE_NOT_ALLOWED_TO_DELETE_USERS: "You are not allowed to delete users",
  YOU_ARE_NOT_ALLOWED_TO_SET_USERS_PASSWORD: "You are not allowed to set users password",
  BANNED_USER: "You have been banned from this application"
};
var ANONYMOUS_ERROR_CODES = {
  FAILED_TO_CREATE_USER: "Failed to create user",
  COULD_NOT_CREATE_SESSION: "Could not create session",
  ANONYMOUS_USERS_CANNOT_SIGN_IN_AGAIN_ANONYMOUSLY: "Anonymous users cannot sign in again anonymously"
};
var API_KEY_ERROR_CODES = {
  INVALID_METADATA_TYPE: "metadata must be an object or undefined",
  REFILL_AMOUNT_AND_INTERVAL_REQUIRED: "refillAmount is required when refillInterval is provided",
  REFILL_INTERVAL_AND_AMOUNT_REQUIRED: "refillInterval is required when refillAmount is provided",
  USER_BANNED: "User is banned",
  UNAUTHORIZED_SESSION: "Unauthorized or invalid session",
  KEY_NOT_FOUND: "API Key not found",
  KEY_DISABLED: "API Key is disabled",
  KEY_EXPIRED: "API Key has expired",
  USAGE_EXCEEDED: "API Key has reached its usage limit",
  KEY_NOT_RECOVERABLE: "API Key is not recoverable",
  EXPIRES_IN_IS_TOO_SMALL: "The expiresIn is smaller than the predefined minimum value.",
  EXPIRES_IN_IS_TOO_LARGE: "The expiresIn is larger than the predefined maximum value.",
  INVALID_REMAINING: "The remaining count is either too large or too small.",
  INVALID_PREFIX_LENGTH: "The prefix length is either too large or too small.",
  INVALID_NAME_LENGTH: "The name length is either too large or too small.",
  METADATA_DISABLED: "Metadata is disabled.",
  RATE_LIMIT_EXCEEDED: "Rate limit exceeded.",
  NO_VALUES_TO_UPDATE: "No values to update.",
  KEY_DISABLED_EXPIRATION: "Custom key expiration values are disabled.",
  INVALID_API_KEY: "Invalid API key.",
  INVALID_USER_ID_FROM_API_KEY: "The user id from the API key is invalid.",
  INVALID_API_KEY_GETTER_RETURN_TYPE: "API Key getter returned an invalid key type. Expected string.",
  SERVER_ONLY_PROPERTY: "The property you're trying to set can only be set from the server auth instance only."
};
var BASE_ERROR_CODES = {
  USER_NOT_FOUND: "User not found",
  FAILED_TO_CREATE_USER: "Failed to create user",
  FAILED_TO_CREATE_SESSION: "Failed to create session",
  FAILED_TO_UPDATE_USER: "Failed to update user",
  FAILED_TO_GET_SESSION: "Failed to get session",
  INVALID_PASSWORD: "Invalid password",
  INVALID_EMAIL: "Invalid email",
  INVALID_EMAIL_OR_PASSWORD: "Invalid email or password",
  SOCIAL_ACCOUNT_ALREADY_LINKED: "Social account already linked",
  PROVIDER_NOT_FOUND: "Provider not found",
  INVALID_TOKEN: "Invalid token",
  ID_TOKEN_NOT_SUPPORTED: "id_token not supported",
  FAILED_TO_GET_USER_INFO: "Failed to get user info",
  USER_EMAIL_NOT_FOUND: "User email not found",
  EMAIL_NOT_VERIFIED: "Email not verified",
  PASSWORD_TOO_SHORT: "Password too short",
  PASSWORD_TOO_LONG: "Password too long",
  USER_ALREADY_EXISTS: "User already exists",
  EMAIL_CAN_NOT_BE_UPDATED: "Email can not be updated",
  CREDENTIAL_ACCOUNT_NOT_FOUND: "Credential account not found",
  SESSION_EXPIRED: "Session expired. Re-authenticate to perform this action.",
  FAILED_TO_UNLINK_LAST_ACCOUNT: "You can't unlink your last account",
  ACCOUNT_NOT_FOUND: "Account not found",
  USER_ALREADY_HAS_PASSWORD: "User already has a password. Provide that to delete the account."
};
var EXTERNAL_ERROR_CODES = {
  VERIFICATION_FAILED: "Captcha verification failed",
  MISSING_RESPONSE: "Missing CAPTCHA response",
  UNKNOWN_ERROR: "Something went wrong"
};
var INTERNAL_ERROR_CODES = {
  MISSING_SECRET_KEY: "Missing secret key",
  SERVICE_UNAVAILABLE: "CAPTCHA service unavailable"
};
var CAPTCHA_ERROR_CODES = {
  ...EXTERNAL_ERROR_CODES,
  ...INTERNAL_ERROR_CODES
};
var EMAIL_OTP_ERROR_CODES = {
  OTP_EXPIRED: "otp expired",
  INVALID_OTP: "Invalid OTP",
  INVALID_EMAIL: "Invalid email",
  USER_NOT_FOUND: "User not found",
  TOO_MANY_ATTEMPTS: "Too many attempts"
};
var GENERIC_OAUTH_ERROR_CODES = {
  INVALID_OAUTH_CONFIGURATION: "Invalid OAuth configuration"
};
var HAVEIBEENPWNED_ERROR_CODES = {
  PASSWORD_COMPROMISED: "The password you entered has been compromised. Please choose a different password."
};
var MULTI_SESSION_ERROR_CODES = {
  INVALID_SESSION_TOKEN: "Invalid session token"
};
var ORGANIZATION_ERROR_CODES = {
  YOU_ARE_NOT_ALLOWED_TO_CREATE_A_NEW_ORGANIZATION: "You are not allowed to create a new organization",
  YOU_HAVE_REACHED_THE_MAXIMUM_NUMBER_OF_ORGANIZATIONS: "You have reached the maximum number of organizations",
  ORGANIZATION_ALREADY_EXISTS: "Organization already exists",
  ORGANIZATION_NOT_FOUND: "Organization not found",
  USER_IS_NOT_A_MEMBER_OF_THE_ORGANIZATION: "User is not a member of the organization",
  YOU_ARE_NOT_ALLOWED_TO_UPDATE_THIS_ORGANIZATION: "You are not allowed to update this organization",
  YOU_ARE_NOT_ALLOWED_TO_DELETE_THIS_ORGANIZATION: "You are not allowed to delete this organization",
  NO_ACTIVE_ORGANIZATION: "No active organization",
  USER_IS_ALREADY_A_MEMBER_OF_THIS_ORGANIZATION: "User is already a member of this organization",
  MEMBER_NOT_FOUND: "Member not found",
  ROLE_NOT_FOUND: "Role not found",
  YOU_ARE_NOT_ALLOWED_TO_CREATE_A_NEW_TEAM: "You are not allowed to create a new team",
  TEAM_ALREADY_EXISTS: "Team already exists",
  TEAM_NOT_FOUND: "Team not found",
  YOU_CANNOT_LEAVE_THE_ORGANIZATION_AS_THE_ONLY_OWNER: "You cannot leave the organization as the only owner",
  YOU_ARE_NOT_ALLOWED_TO_DELETE_THIS_MEMBER: "You are not allowed to delete this member",
  YOU_ARE_NOT_ALLOWED_TO_INVITE_USERS_TO_THIS_ORGANIZATION: "You are not allowed to invite users to this organization",
  USER_IS_ALREADY_INVITED_TO_THIS_ORGANIZATION: "User is already invited to this organization",
  INVITATION_NOT_FOUND: "Invitation not found",
  YOU_ARE_NOT_THE_RECIPIENT_OF_THE_INVITATION: "You are not the recipient of the invitation",
  YOU_ARE_NOT_ALLOWED_TO_CANCEL_THIS_INVITATION: "You are not allowed to cancel this invitation",
  INVITER_IS_NO_LONGER_A_MEMBER_OF_THE_ORGANIZATION: "Inviter is no longer a member of the organization",
  YOU_ARE_NOT_ALLOWED_TO_INVITE_USER_WITH_THIS_ROLE: "you are not allowed to invite user with this role",
  FAILED_TO_RETRIEVE_INVITATION: "Failed to retrieve invitation",
  YOU_HAVE_REACHED_THE_MAXIMUM_NUMBER_OF_TEAMS: "You have reached the maximum number of teams",
  UNABLE_TO_REMOVE_LAST_TEAM: "Unable to remove last team",
  YOU_ARE_NOT_ALLOWED_TO_UPDATE_THIS_MEMBER: "You are not allowed to update this member",
  ORGANIZATION_MEMBERSHIP_LIMIT_REACHED: "Organization membership limit reached",
  YOU_ARE_NOT_ALLOWED_TO_CREATE_TEAMS_IN_THIS_ORGANIZATION: "You are not allowed to create teams in this organization",
  YOU_ARE_NOT_ALLOWED_TO_DELETE_TEAMS_IN_THIS_ORGANIZATION: "You are not allowed to delete teams in this organization",
  YOU_ARE_NOT_ALLOWED_TO_UPDATE_THIS_TEAM: "You are not allowed to update this team",
  YOU_ARE_NOT_ALLOWED_TO_DELETE_THIS_TEAM: "You are not allowed to delete this team",
  INVITATION_LIMIT_REACHED: "Invitation limit reached"
};
var PASSKEY_ERROR_CODES = {
  CHALLENGE_NOT_FOUND: "Challenge not found",
  YOU_ARE_NOT_ALLOWED_TO_REGISTER_THIS_PASSKEY: "You are not allowed to register this passkey",
  FAILED_TO_VERIFY_REGISTRATION: "Failed to verify registration",
  PASSKEY_NOT_FOUND: "Passkey not found",
  AUTHENTICATION_FAILED: "Authentication failed",
  UNABLE_TO_CREATE_SESSION: "Unable to create session",
  FAILED_TO_UPDATE_PASSKEY: "Failed to update passkey"
};
var PHONE_NUMBER_ERROR_CODES = {
  INVALID_PHONE_NUMBER: "Invalid phone number",
  PHONE_NUMBER_EXIST: "Phone number already exists",
  INVALID_PHONE_NUMBER_OR_PASSWORD: "Invalid phone number or password",
  UNEXPECTED_ERROR: "Unexpected error",
  OTP_NOT_FOUND: "OTP not found",
  OTP_EXPIRED: "OTP expired",
  INVALID_OTP: "Invalid OTP",
  PHONE_NUMBER_NOT_VERIFIED: "Phone number not verified"
};
var STRIPE_ERROR_CODES = {
  SUBSCRIPTION_NOT_FOUND: "Subscription not found",
  SUBSCRIPTION_PLAN_NOT_FOUND: "Subscription plan not found",
  ALREADY_SUBSCRIBED_PLAN: "You're already subscribed to this plan",
  UNABLE_TO_CREATE_CUSTOMER: "Unable to create customer",
  FAILED_TO_FETCH_PLANS: "Failed to fetch plans",
  EMAIL_VERIFICATION_REQUIRED: "Email verification is required before you can subscribe to a plan",
  SUBSCRIPTION_NOT_ACTIVE: "Subscription is not active",
  SUBSCRIPTION_NOT_SCHEDULED_FOR_CANCELLATION: "Subscription is not scheduled for cancellation"
};
var TEAM_ERROR_CODES = {
  TEAM_LIMIT_REACHED: "Team limit reached for this organization",
  TEAM_MEMBER_LIMIT_REACHED: "Team member limit reached for this team",
  TEAM_NOT_FOUND: "Team not found",
  TEAM_MEMBER_NOT_FOUND: "Team member not found",
  TEAM_NAME_TOO_LONG: "Team name is too long",
  CANNOT_REMOVE_LAST_TEAM: "Cannot remove the last team",
  NOT_ORGANIZATION_MEMBER: "User is not a member of the organization",
  ALREADY_TEAM_MEMBER: "User is already a member of this team",
  INSUFFICIENT_TEAM_PERMISSIONS: "Insufficient permissions to perform this action on team"
};
var TWO_FACTOR_ERROR_CODES = {
  OTP_NOT_ENABLED: "OTP not enabled",
  OTP_HAS_EXPIRED: "OTP has expired",
  TOTP_NOT_ENABLED: "TOTP not enabled",
  TWO_FACTOR_NOT_ENABLED: "Two factor isn't enabled",
  BACKUP_CODES_NOT_ENABLED: "Backup codes aren't enabled",
  INVALID_BACKUP_CODE: "Invalid backup code",
  INVALID_CODE: "Invalid code",
  TOO_MANY_ATTEMPTS_REQUEST_NEW_CODE: "Too many attempts. Please request a new code.",
  INVALID_TWO_FACTOR_COOKIE: "Invalid two factor cookie"
};
var USERNAME_ERROR_CODES = {
  INVALID_USERNAME_OR_PASSWORD: "invalid username or password",
  EMAIL_NOT_VERIFIED: "email not verified",
  UNEXPECTED_ERROR: "unexpected error",
  USERNAME_IS_ALREADY_TAKEN: "username is already taken. please try another.",
  USERNAME_TOO_SHORT: "username is too short",
  USERNAME_TOO_LONG: "username is too long",
  INVALID_USERNAME: "username is invalid"
};
var authLocalization = {
  /** @default "App" */
  APP: "App",
  /** @default "Account" */
  ACCOUNT: "Account",
  /** @default "Accounts" */
  ACCOUNTS: "Accounts",
  /** @default "Manage your currently signed in accounts." */
  ACCOUNTS_DESCRIPTION: "Switch between your currently signed in accounts.",
  /** @default "Sign in to an additional account." */
  ACCOUNTS_INSTRUCTIONS: "Sign in to an additional account.",
  /** @default "Add Account" */
  ADD_ACCOUNT: "Add Account",
  /** @default "Add Passkey" */
  ADD_PASSKEY: "Add Passkey",
  /** @default "Already have an account?" */
  ALREADY_HAVE_AN_ACCOUNT: "Already have an account?",
  /** @default "Avatar" */
  AVATAR: "Avatar",
  /** @default "Click on the avatar to upload a custom one from your files." */
  AVATAR_DESCRIPTION: "Click on the avatar to upload a custom one from your files.",
  /** @default "An avatar is optional but strongly recommended." */
  AVATAR_INSTRUCTIONS: "An avatar is optional but strongly recommended.",
  /** @default "Backup code is required" */
  BACKUP_CODE_REQUIRED: "Backup code is required",
  /** @default "Backup Codes" */
  BACKUP_CODES: "Backup Codes",
  /** @default "Save these backup codes in a secure place. You can use them to access your account if you lose your two-factor authentication method." */
  BACKUP_CODES_DESCRIPTION: "Save these backup codes in a secure place. You can use them to access your account if you lose your two-factor authentication method.",
  /** @default "Backup Code." */
  BACKUP_CODE_PLACEHOLDER: "Backup Code",
  /** @default "Backup Code" */
  BACKUP_CODE: "Backup Code",
  /** @default "Cancel" */
  CANCEL: "Cancel",
  /** @default "Change Password" */
  CHANGE_PASSWORD: "Change Password",
  /** @default "Enter your current password and a new password." */
  CHANGE_PASSWORD_DESCRIPTION: "Enter your current password and a new password.",
  /** @default "Please use 8 characters at minimum." */
  CHANGE_PASSWORD_INSTRUCTIONS: "Please use 8 characters at minimum.",
  /** @default "Your password has been changed." */
  CHANGE_PASSWORD_SUCCESS: "Your password has been changed.",
  /** @default "Confirm Password" */
  CONFIRM_PASSWORD: "Confirm Password",
  /** @default "Confirm Password" */
  CONFIRM_PASSWORD_PLACEHOLDER: "Confirm Password",
  /** @default "Confirm password is required" */
  CONFIRM_PASSWORD_REQUIRED: "Confirm password is required",
  /** @default "Continue with Authenticator" */
  CONTINUE_WITH_AUTHENTICATOR: "Continue with Authenticator",
  /** @default "Copied to clipboard" */
  COPIED_TO_CLIPBOARD: "Copied to clipboard",
  /** @default "Copy to clipboard" */
  COPY_TO_CLIPBOARD: "Copy to clipboard",
  /** @default "Copy all codes" */
  COPY_ALL_CODES: "Copy all codes",
  /** @default "Continue" */
  CONTINUE: "Continue",
  /** @default "Current Password" */
  CURRENT_PASSWORD: "Current Password",
  /** @default "Current Password" */
  CURRENT_PASSWORD_PLACEHOLDER: "Current Password",
  /** @default "Current Session" */
  CURRENT_SESSION: "Current Session",
  /** @default "Update" */
  UPDATE: "Update",
  /** @default "Delete" */
  DELETE: "Delete",
  /** @default "Delete Avatar" */
  DELETE_AVATAR: "Delete Avatar",
  /** @default "Delete Account" */
  DELETE_ACCOUNT: "Delete Account",
  /** @default "Permanently remove your account and all of its contents. This action is not reversible, so please continue with caution." */
  DELETE_ACCOUNT_DESCRIPTION: "Permanently remove your account and all of its contents. This action is not reversible, so please continue with caution.",
  /** @default "Please confirm the deletion of your account. This action is not reversible, so please continue with caution." */
  DELETE_ACCOUNT_INSTRUCTIONS: "Please confirm the deletion of your account. This action is not reversible, so please continue with caution.",
  /** @default "Please check your email to verify the deletion of your account." */
  DELETE_ACCOUNT_VERIFY: "Please check your email to verify the deletion of your account.",
  /** @default "Your account has been deleted." */
  DELETE_ACCOUNT_SUCCESS: "Your account has been deleted.",
  /** @default "Disable Two-Factor" */
  DISABLE_TWO_FACTOR: "Disable Two-Factor",
  /** @default "Choose a provider to login to your account" */
  DISABLED_CREDENTIALS_DESCRIPTION: "Choose a provider to login to your account",
  /** @default "Don't have an account?" */
  DONT_HAVE_AN_ACCOUNT: "Don't have an account?",
  /** @default "Done" */
  DONE: "Done",
  /** @default "Email" */
  EMAIL: "Email",
  /** @default "Enter the email address you want to use to log in." */
  EMAIL_DESCRIPTION: "Enter the email address you want to use to log in.",
  /** @default "Please enter a valid email address." */
  EMAIL_INSTRUCTIONS: "Please enter a valid email address.",
  /** @default "Email is the same" */
  EMAIL_IS_THE_SAME: "Email is the same",
  /** @default "m@example.com" */
  EMAIL_PLACEHOLDER: "m@example.com",
  /** @default "Email address is required" */
  EMAIL_REQUIRED: "Email address is required",
  /** @default "Please check your email to verify the change." */
  EMAIL_VERIFY_CHANGE: "Please check your email to verify the change.",
  /** @default "Email Verification" */
  EMAIL_VERIFICATION: "Email Verification",
  /** @default "Please check your email for the verification code to complete your registration." */
  EMAIL_VERIFICATION_DESCRIPTION: "Please check your email for the verification code to complete your registration.",
  /** @default "Email verification successful." */
  EMAIL_VERIFICATION_SUCCESS: "Email verification successful.",
  /** @default "Enable Two-Factor" */
  ENABLE_TWO_FACTOR: "Enable Two-Factor",
  /** @default "is invalid" */
  IS_INVALID: "is invalid",
  /** @default "is required" */
  IS_REQUIRED: "is required",
  /** @default "is the same" */
  IS_THE_SAME: "is the same",
  /** @default "Forgot authenticator?" */
  FORGOT_AUTHENTICATOR: "Forgot authenticator?",
  /** @default "Forgot Password" */
  FORGOT_PASSWORD: "Forgot Password",
  /** @default "Send reset link" */
  FORGOT_PASSWORD_ACTION: "Send reset link",
  /** @default "Enter your email to reset your password" */
  FORGOT_PASSWORD_DESCRIPTION: "Enter your email to reset your password",
  /** @default "Check your email for the password reset link." */
  FORGOT_PASSWORD_EMAIL: "Check your email for the password reset link.",
  /** @default "Forgot your password?" */
  FORGOT_PASSWORD_LINK: "Forgot your password?",
  /** @default "Link" */
  LINK: "Link",
  /** @default "Magic Link" */
  MAGIC_LINK: "Magic Link",
  /** @default "Send magic link" */
  MAGIC_LINK_ACTION: "Send magic link",
  /** @default "Enter your email to receive a magic link" */
  MAGIC_LINK_DESCRIPTION: "Enter your email to receive a magic link",
  /** @default "Check your email for the magic link" */
  MAGIC_LINK_EMAIL: "Check your email for the magic link",
  /** @default "Email Code" */
  EMAIL_OTP: "Email Code",
  /** @default "Send code" */
  EMAIL_OTP_SEND_ACTION: "Send code",
  /** @default "Verify code" */
  EMAIL_OTP_VERIFY_ACTION: "Verify code",
  /** @default "Enter your email to receive a code" */
  EMAIL_OTP_DESCRIPTION: "Enter your email to receive a code",
  /** @default "Please check your email for the verification code." */
  EMAIL_OTP_VERIFICATION_SENT: "Please check your email for the verification code.",
  /** @default "Name" */
  NAME: "Name",
  /** @default "Please enter your full name, or a display name." */
  NAME_DESCRIPTION: "Please enter your full name, or a display name.",
  /** @default "Please use 32 characters at maximum." */
  NAME_INSTRUCTIONS: "Please use 32 characters at maximum.",
  /** @default "Name" */
  NAME_PLACEHOLDER: "Name",
  /** @default "New Password" */
  NEW_PASSWORD: "New Password",
  /** @default "New Password" */
  NEW_PASSWORD_PLACEHOLDER: "New Password",
  /** @default "New password is required" */
  NEW_PASSWORD_REQUIRED: "New password is required",
  /** @default "One-Time Password" */
  ONE_TIME_PASSWORD: "One-Time Password",
  /** @default "Or continue with" */
  OR_CONTINUE_WITH: "Or continue with",
  /** @default "Passkey" */
  PASSKEY: "Passkey",
  /** @default "Passkeys" */
  PASSKEYS: "Passkeys",
  /** @default "Manage your passkeys for secure access." */
  PASSKEYS_DESCRIPTION: "Manage your passkeys for secure access.",
  /** @default "Securely access your account without a password." */
  PASSKEYS_INSTRUCTIONS: "Securely access your account without a password.",
  /** @default "Personal Account" */
  PERSONAL_ACCOUNT: "Personal Account",
  /** @default "API Keys" */
  API_KEYS: "API Keys",
  /** @default "Manage your API keys for secure access." */
  API_KEYS_DESCRIPTION: "Manage your API keys for secure access.",
  /** @default "Generate API keys to access your account programmatically." */
  API_KEYS_INSTRUCTIONS: "Generate API keys to access your account programmatically.",
  /** @default "Create API Key" */
  CREATE_API_KEY: "Create API Key",
  /** @default "Enter a unique name for your API key to differentiate it from other keys." */
  CREATE_API_KEY_DESCRIPTION: "Enter a unique name for your API key to differentiate it from other keys.",
  /** @default "New API Key" */
  API_KEY_NAME_PLACEHOLDER: "New API Key",
  /** @default "API Key Created" */
  API_KEY_CREATED: "API Key Created",
  /** @default "Please copy your API key and store it in a safe place. For security reasons we cannot show it again." */
  CREATE_API_KEY_SUCCESS: "Please copy your API key and store it in a safe place. For security reasons we cannot show it again.",
  /** @default "Never Expires" */
  NEVER_EXPIRES: "Never Expires",
  /** @default "Expires" */
  EXPIRES: "Expires",
  /** @default "No Expiration" */
  NO_EXPIRATION: "No Expiration",
  /** @default "Create Organization" */
  CREATE_ORGANIZATION: "Create Organization",
  /** @default "Organization" */
  ORGANIZATION: "Organization",
  /** @default "Name" */
  ORGANIZATION_NAME: "Name",
  /** @default "Acme Inc." */
  ORGANIZATION_NAME_PLACEHOLDER: "Acme Inc.",
  /** @default "This is your organization's visible name." */
  ORGANIZATION_NAME_DESCRIPTION: "This is your organization's visible name.",
  /** @default "Please use 32 characters at maximum." */
  ORGANIZATION_NAME_INSTRUCTIONS: "Please use 32 characters at maximum.",
  /** @default "Slug URL" */
  ORGANIZATION_SLUG: "Slug URL",
  /** @default "This is your organization's URL namespace." */
  ORGANIZATION_SLUG_DESCRIPTION: "This is your organization's URL namespace.",
  /** @default "Please use 48 characters at maximum." */
  ORGANIZATION_SLUG_INSTRUCTIONS: "Please use 48 characters at maximum.",
  /** @default "acme-inc" */
  ORGANIZATION_SLUG_PLACEHOLDER: "acme-inc",
  /** @default "Organization created successfully" */
  CREATE_ORGANIZATION_SUCCESS: "Organization created successfully",
  /** @default "Password" */
  PASSWORD: "Password",
  /** @default "Password" */
  PASSWORD_PLACEHOLDER: "Password",
  /** @default "Password is required" */
  PASSWORD_REQUIRED: "Password is required",
  /** @default "Passwords do not match" */
  PASSWORDS_DO_NOT_MATCH: "Passwords do not match",
  /** @default "Providers" */
  PROVIDERS: "Providers",
  /** @default "Connect your account with a third-party service." */
  PROVIDERS_DESCRIPTION: "Connect your account with a third-party service.",
  /** @default "Recover Account" */
  RECOVER_ACCOUNT: "Recover Account",
  /** @default "Recover account" */
  RECOVER_ACCOUNT_ACTION: "Recover account",
  /** @default "Please enter a backup code to access your account" */
  RECOVER_ACCOUNT_DESCRIPTION: "Please enter a backup code to access your account",
  /** @default "Remember me" */
  REMEMBER_ME: "Remember me",
  /** @default "Resend code" */
  RESEND_CODE: "Resend code",
  /** @default "Resend verification email" */
  RESEND_VERIFICATION_EMAIL: "Resend Verification Email",
  /** @default "Reset Password" */
  RESET_PASSWORD: "Reset Password",
  /** @default "Save new password" */
  RESET_PASSWORD_ACTION: "Save new password",
  /** @default "Enter your new password below" */
  RESET_PASSWORD_DESCRIPTION: "Enter your new password below",
  /** @default "Password reset successfully" */
  RESET_PASSWORD_SUCCESS: "Password reset successfully",
  /** @default "Request failed" */
  REQUEST_FAILED: "Request failed",
  /** @default "Revoke" */
  REVOKE: "Revoke",
  /** @default "Delete API Key" */
  DELETE_API_KEY: "Delete API Key",
  /** @default "Are you sure you want to delete this API key?" */
  DELETE_API_KEY_CONFIRM: "Are you sure you want to delete this API key?",
  /** @default "API Key" */
  API_KEY: "API Key",
  /** @default "Sign In" */
  SIGN_IN: "Sign In",
  /** @default "Login" */
  SIGN_IN_ACTION: "Login",
  /** @default "Enter your email below to login to your account" */
  SIGN_IN_DESCRIPTION: "Enter your email below to login to your account",
  /** @default "Enter your username or email below to login to your account" */
  SIGN_IN_USERNAME_DESCRIPTION: "Enter your username or email to login to your account",
  /** @default "Sign in with" */
  SIGN_IN_WITH: "Sign in with",
  /** @default "Sign Out" */
  SIGN_OUT: "Sign Out",
  /** @default "Sign Up" */
  SIGN_UP: "Sign Up",
  /** @default "Create an account" */
  SIGN_UP_ACTION: "Create an account",
  /** @default "Enter your information to create an account" */
  SIGN_UP_DESCRIPTION: "Enter your information to create an account",
  /** @default "Check your email for the verification link." */
  SIGN_UP_EMAIL: "Check your email for the verification link.",
  /** @default "Sessions" */
  SESSIONS: "Sessions",
  /** @default "Manage your active sessions and revoke access." */
  SESSIONS_DESCRIPTION: "Manage your active sessions and revoke access.",
  /** @default "Set Password" */
  SET_PASSWORD: "Set Password",
  /** @default "Click the button below to receive an email to set up a password for your account." */
  SET_PASSWORD_DESCRIPTION: "Click the button below to receive an email to set up a password for your account.",
  /** @default "Settings" */
  SETTINGS: "Settings",
  /** @default "Save" */
  SAVE: "Save",
  /** @default "Security" */
  SECURITY: "Security",
  /** @default "Switch Account" */
  SWITCH_ACCOUNT: "Switch Account",
  /** @default "Trust this device" */
  TRUST_DEVICE: "Trust this device",
  /** @default "Two-Factor" */
  TWO_FACTOR: "Two-Factor",
  /** @default "Verify code" */
  TWO_FACTOR_ACTION: "Verify code",
  /** @default "Please enter your one-time password to continue" */
  TWO_FACTOR_DESCRIPTION: "Please enter your one-time password to continue",
  /** @default "Add an extra layer of security to your account." */
  TWO_FACTOR_CARD_DESCRIPTION: "Add an extra layer of security to your account.",
  /** @default "Please enter your password to disable 2FA." */
  TWO_FACTOR_DISABLE_INSTRUCTIONS: "Please enter your password to disable 2FA.",
  /** @default "Please enter your password to enable 2FA" */
  TWO_FACTOR_ENABLE_INSTRUCTIONS: "Please enter your password to enable 2FA.",
  /** @default "Two-factor authentication has been enabled" */
  TWO_FACTOR_ENABLED: "Two-factor authentication has been enabled",
  /** @default "Two-Factor Authentication has been disabled" */
  TWO_FACTOR_DISABLED: "Two-Factor Authentication has been disabled",
  /** @default "Two-Factor Authentication" */
  TWO_FACTOR_PROMPT: "Two-Factor Authentication",
  /** @default "Scan the QR Code with your Authenticator" */
  TWO_FACTOR_TOTP_LABEL: "Scan the QR Code with your Authenticator",
  /** @default "Send verification code" */
  SEND_VERIFICATION_CODE: "Send verification code",
  /** @default "Unlink" */
  UNLINK: "Unlink",
  /** @default "Updated successfully" */
  UPDATED_SUCCESSFULLY: "updated successfully",
  /** @default "Username" */
  USERNAME: "Username",
  /** @default "Enter the username you want to use to log in." */
  USERNAME_DESCRIPTION: "Enter the username you want to use to log in.",
  /** @default "Please use 32 characters at maximum." */
  USERNAME_INSTRUCTIONS: "Please use 32 characters at maximum.",
  /** @default "Username" */
  USERNAME_PLACEHOLDER: "Username",
  /** @default "(Optional)" */
  OPTIONAL_BRACKETS: "(Optional)",
  /** @default "Username or email" */
  SIGN_IN_USERNAME_PLACEHOLDER: "Username or email",
  /** @default "Verify Your Email" */
  VERIFY_YOUR_EMAIL: "Verify Your Email",
  /** @default "Please verify your email address. Check your inbox for the verification email. If you haven't received the email, click the button below to resend." */
  VERIFY_YOUR_EMAIL_DESCRIPTION: "Please verify your email address. Check your inbox for the verification email. If you haven't received the email, click the button below to resend.",
  /** @default "Go back" */
  GO_BACK: "Go back",
  /** @default "Your session is not fresh. Please sign in again." */
  SESSION_NOT_FRESH: "Your session is not fresh. Please sign in again.",
  /** @default "Upload Avatar" */
  UPLOAD_AVATAR: "Upload Avatar",
  /** @default "Logo" */
  LOGO: "Logo",
  /** @default "Click on the logo to upload a custom one from your files." */
  LOGO_DESCRIPTION: "Click on the logo to upload a custom one from your files.",
  /** @default "A logo is optional but strongly recommended." */
  LOGO_INSTRUCTIONS: "A logo is optional but strongly recommended.",
  /** @default "Upload" */
  UPLOAD: "Upload",
  /** @default "Upload Logo" */
  UPLOAD_LOGO: "Upload Logo",
  /** @default "Delete Logo" */
  DELETE_LOGO: "Delete Logo",
  /** @default "Privacy Policy" */
  PRIVACY_POLICY: "Privacy Policy",
  /** @default "Terms of Service" */
  TERMS_OF_SERVICE: "Terms of Service",
  /** @default "This site is protected by reCAPTCHA." */
  PROTECTED_BY_RECAPTCHA: "This site is protected by reCAPTCHA.",
  /** @default "By continuing, you agree to the" */
  BY_CONTINUING_YOU_AGREE: "By continuing, you agree to the",
  /** @default "User" */
  USER: "User",
  /** @default "Organizations" */
  ORGANIZATIONS: "Organizations",
  /** @default "Manage your organizations and memberships." */
  ORGANIZATIONS_DESCRIPTION: "Manage your organizations and memberships.",
  /** @default "Create an organization to collaborate with other users." */
  ORGANIZATIONS_INSTRUCTIONS: "Create an organization to collaborate with other users.",
  /** @default "Leave Organization" */
  LEAVE_ORGANIZATION: "Leave Organization",
  /** @default "Are you sure you want to leave this organization?" */
  LEAVE_ORGANIZATION_CONFIRM: "Are you sure you want to leave this organization?",
  /** @default "You have successfully left the organization." */
  LEAVE_ORGANIZATION_SUCCESS: "You have successfully left the organization.",
  /** @default "Manage Organization" */
  MANAGE_ORGANIZATION: "Manage Organization",
  /** @default "Remove Member" */
  REMOVE_MEMBER: "Remove Member",
  /** @default "Are you sure you want to remove this member from the organization?" */
  REMOVE_MEMBER_CONFIRM: "Are you sure you want to remove this member from the organization?",
  /** @default "Member removed successfully" */
  REMOVE_MEMBER_SUCCESS: "Member removed successfully",
  /** @default "Invite Member" */
  INVITE_MEMBER: "Invite Member",
  /** @default "Members" */
  MEMBERS: "Members",
  /** @default "Add or remove members and manage their roles." */
  MEMBERS_DESCRIPTION: "Add or remove members and manage their roles.",
  /** @default "Invite new members to your organization." */
  MEMBERS_INSTRUCTIONS: "Invite new members to your organization.",
  /** @default "Send an invitation to add a new member to your organization." */
  INVITE_MEMBER_DESCRIPTION: "Send an invitation to add a new member to your organization.",
  /** @default "Role" */
  ROLE: "Role",
  /** @default "Select a role" */
  SELECT_ROLE: "Select a role",
  /** @default "Admin" */
  ADMIN: "Admin",
  /** @default "Member" */
  MEMBER: "Member",
  /** @default "Guest" */
  GUEST: "Guest",
  /** @default "Owner" */
  OWNER: "Owner",
  /** @default "Update the role for this member" */
  UPDATE_ROLE_DESCRIPTION: "Update the role for this member",
  /** @default "Update Role" */
  UPDATE_ROLE: "Update Role",
  /** @default "Member role updated successfully" */
  MEMBER_ROLE_UPDATED: "Member role updated successfully",
  /** @default "Send Invitation" */
  SEND_INVITATION: "Send Invitation",
  /** @default "Invitation sent successfully" */
  SEND_INVITATION_SUCCESS: "Invitation sent successfully",
  /** @default "Pending Invitations" */
  PENDING_INVITATIONS: "Pending Invitations",
  /** @default "Manage pending invitations to your organization." */
  PENDING_INVITATIONS_DESCRIPTION: "Manage pending invitations to your organization.",
  /** @default "Invitations you've received from organizations." */
  PENDING_USER_INVITATIONS_DESCRIPTION: "Invitations you've received from organizations.",
  /** @default "Cancel Invitation" */
  CANCEL_INVITATION: "Cancel Invitation",
  /** @default "Invitation cancelled successfully" */
  INVITATION_CANCELLED: "Invitation cancelled successfully",
  /** @default "Accept Invitation" */
  ACCEPT_INVITATION: "Accept Invitation",
  /** @default "You have been invited to join an organization." */
  ACCEPT_INVITATION_DESCRIPTION: "You have been invited to join an organization.",
  /** @default "Invitation accepted successfully" */
  INVITATION_ACCEPTED: "Invitation accepted successfully",
  /** @default "Invitation rejected successfully" */
  INVITATION_REJECTED: "Invitation rejected successfully",
  /** @default "Accept" */
  ACCEPT: "Accept",
  /** @default "Reject" */
  REJECT: "Reject",
  /** @default "This invitation has expired" */
  INVITATION_EXPIRED: "This invitation has expired",
  /** @default "Delete Organization" */
  DELETE_ORGANIZATION: "Delete Organization",
  /** @default "Permanently remove your organization and all of its contents. This action is not reversible — please continue with caution." */
  DELETE_ORGANIZATION_DESCRIPTION: "Permanently remove your organization and all of its contents. This action is not reversible — please continue with caution.",
  /** @default "Organization deleted successfully" */
  DELETE_ORGANIZATION_SUCCESS: "Organization deleted successfully",
  /** @default "Enter the organization slug to continue:" */
  DELETE_ORGANIZATION_INSTRUCTIONS: "Enter the organization slug to continue:",
  /** @default "Organization slug is required" */
  SLUG_REQUIRED: "Organization slug is required",
  /** @default "The slug does not match" */
  SLUG_DOES_NOT_MATCH: "The slug does not match",
  // Teams
  /** @default "Team" */
  TEAM: "Team",
  /** @default "Teams" */
  TEAMS: "Teams",
  /** @default "Active" */
  TEAM_ACTIVE: "Active",
  /** @default "Set Active" */
  TEAM_SET_ACTIVE: "Set Active",
  /** @default "Create Team" */
  CREATE_TEAM: "Create Team",
  /** @default "Team created successfully" */
  CREATE_TEAM_SUCCESS: "Team created successfully",
  /** @default "Update Team" */
  UPDATE_TEAM: "Update Team",
  /** @default "Update Teams" */
  UPDATE_TEAMS: "Update Teams",
  /** @default "Select teams" */
  SELECT_TEAMS: "Select teams",
  /** @default "Add" */
  ADD: "Add",
  /** @default "Remove" */
  REMOVE: "Remove",
  /** @default "Update the name for this team" */
  UPDATE_TEAM_DESCRIPTION: "Update the name for this team",
  /** @default "Add or remove teams for this member" */
  UPDATE_TEAMS_DESCRIPTION: "Add or remove teams for this member",
  /** @default "Are you sure you want to remove this team from the organization?" */
  REMOVE_TEAM_CONFIRM: "Are you sure you want to remove this team from the organization?",
  /** @default "Add new team to your organization." */
  CREATE_TEAM_INSTRUCTIONS: "Add new team to your organization.",
  /** @default "Team Name" */
  TEAM_NAME: "Team Name",
  /** @default "Engineering Team" */
  TEAM_NAME_PLACEHOLDER: "Engineering Team",
  /** @default "This is your team's visible name." */
  TEAM_NAME_DESCRIPTION: "This is your team's visible name.",
  /** @default "Please use 64 characters at maximum." */
  TEAM_NAME_INSTRUCTIONS: "Please use 64 characters at maximum.",
  /** @default "Manage your teams within your organization." */
  TEAMS_DESCRIPTION: "Manage your teams within your organization.",
  /** @default "You are a member of the following teams." */
  USER_TEAMS_DESCRIPTION: "You are a member of the following teams.",
  /** @default "Delete Team" */
  DELETE_TEAM: "Delete Team",
  /** @default "Permanently remove this team and all of its contents." */
  DELETE_TEAM_DESCRIPTION: "Permanently remove this team and all of its contents.",
  /** @default "Team deleted successfully" */
  DELETE_TEAM_SUCCESS: "Team deleted successfully",
  /** @default "Enter the team name to continue:" */
  DELETE_TEAM_INSTRUCTIONS: "Enter the team name to continue:",
  /** @default "Team name is required" */
  TEAM_NAME_REQUIRED: "Team name is required",
  /** @default "The team name does not match" */
  TEAM_NAME_DOES_NOT_MATCH: "The team name does not match",
  /** @default "Team Members" */
  TEAM_MEMBERS: "Team Members",
  /** @default "Manage your team members and their roles." */
  TEAM_MEMBERS_DESCRIPTION: "Manage your team members and their roles.",
  /** @default "Add Team Member" */
  ADD_TEAM_MEMBER: "Add Team Member",
  /** @default "Remove Team Member" */
  REMOVE_TEAM_MEMBER: "Remove Team Member",
  /** @default "Are you sure you want to remove this member from the team?" */
  REMOVE_TEAM_MEMBER_CONFIRM: "Are you sure you want to remove this member from the team?",
  /** @default "Team member removed successfully" */
  REMOVE_TEAM_MEMBER_SUCCESS: "Team member removed successfully",
  /** @default "Team member added successfully" */
  ADD_TEAM_MEMBER_SUCCESS: "Team member added successfully",
  /** @default "Team updated successfully" */
  UPDATE_TEAM_SUCCESS: "Team updated successfully",
  /** @default "Manage Team Members" */
  MANAGE_TEAM_MEMBERS: "Manage Team Members",
  /** @default "Search and add organization members to this team." */
  MANAGE_TEAM_MEMBERS_DESCRIPTION: "Search and add organization members to this team.",
  /** @default "No teams found" */
  NO_TEAMS_FOUND: "No teams found",
  /** @default "member" */
  MEMBER_SINGULAR: "member",
  /** @default "members" */
  MEMBER_PLURAL: "members",
  /** @default "Unknown" */
  UNKNOWN: "Unknown",
  ...BASE_ERROR_CODES,
  ...ADMIN_ERROR_CODES,
  ...ANONYMOUS_ERROR_CODES,
  ...API_KEY_ERROR_CODES,
  ...CAPTCHA_ERROR_CODES,
  ...EMAIL_OTP_ERROR_CODES,
  ...GENERIC_OAUTH_ERROR_CODES,
  ...HAVEIBEENPWNED_ERROR_CODES,
  ...MULTI_SESSION_ERROR_CODES,
  ...ORGANIZATION_ERROR_CODES,
  ...PASSKEY_ERROR_CODES,
  ...PHONE_NUMBER_ERROR_CODES,
  ...STRIPE_ERROR_CODES,
  ...TEAM_ERROR_CODES,
  ...TWO_FACTOR_ERROR_CODES,
  ...USERNAME_ERROR_CODES
};
var AuthDataCache = class {
  cache = /* @__PURE__ */ new Map();
  listeners = /* @__PURE__ */ new Map();
  inFlightRequests = /* @__PURE__ */ new Map();
  get(key) {
    return this.cache.get(key);
  }
  set(key, data) {
    const entry = {
      data,
      timestamp: Date.now(),
      isRefetching: false
    };
    this.cache.set(key, entry);
    this.notify(key);
  }
  setRefetching(key, isRefetching) {
    const entry = this.cache.get(key);
    if (entry) {
      entry.isRefetching = isRefetching;
      this.notify(key);
    }
  }
  clear(key) {
    if (key) {
      this.cache.delete(key);
      this.inFlightRequests.delete(key);
      this.notify(key);
    } else {
      this.cache.clear();
      this.inFlightRequests.clear();
      const keys = Array.from(this.listeners.keys());
      for (const key2 of keys) {
        this.notify(key2);
      }
    }
  }
  getInFlightRequest(key) {
    return this.inFlightRequests.get(key);
  }
  setInFlightRequest(key, promise) {
    this.inFlightRequests.set(key, promise);
  }
  removeInFlightRequest(key) {
    this.inFlightRequests.delete(key);
  }
  subscribe(key, callback) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, /* @__PURE__ */ new Set());
    }
    this.listeners.get(key).add(callback);
    return () => {
      const callbacks = this.listeners.get(key);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          this.listeners.delete(key);
        }
      }
    };
  }
  notify(key) {
    const callbacks = this.listeners.get(key);
    if (callbacks) {
      const callbackArray = Array.from(callbacks);
      for (const callback of callbackArray) {
        callback();
      }
    }
  }
};
var authDataCache = new AuthDataCache();
function subscribe() {
  return () => {
  };
}
function useIsHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}
function useLang() {
  const [lang, setLang] = useState();
  useEffect(() => {
    const checkLang = () => {
      const currentLang = document.documentElement.getAttribute("lang");
      setLang(currentLang ?? void 0);
    };
    checkLang();
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === "lang") {
          checkLang();
        }
      }
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => {
      observer.disconnect();
    };
  }, []);
  return { lang };
}
function useTheme() {
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    const checkTheme = () => {
      var _a;
      const isDark = document.documentElement.classList.contains("dark") || ((_a = document.documentElement.getAttribute("style")) == null ? void 0 : _a.includes("color-scheme: dark"));
      setTheme(isDark ? "dark" : "light");
    };
    checkTheme();
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === "style" || mutation.attributeName === "class") {
          checkTheme();
        }
      }
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => {
      observer.disconnect();
    };
  }, []);
  return { theme };
}
function RecaptchaV3({ children }) {
  const isHydrated = useIsHydrated();
  const { captcha } = useContext(AuthUIContext);
  if ((captcha == null ? void 0 : captcha.provider) !== "google-recaptcha-v3") return children;
  return /* @__PURE__ */ jsxs(
    GoogleReCaptchaProvider,
    {
      reCaptchaKey: captcha.siteKey,
      useEnterprise: captcha.enterprise,
      useRecaptchaNet: captcha.recaptchaNet,
      children: [
        isHydrated && /* @__PURE__ */ jsx("style", { children: `
                    .grecaptcha-badge {
                        visibility: hidden;
                        border-radius: var(--radius) !important;
                        --tw-shadow: 0 1px 2px 0 var(--tw-shadow-color, #0000000d);
                        box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow) !important;
                        border-style: var(--tw-border-style) !important;
                        border-width: 1px;
                    }

                    .dark .grecaptcha-badge {
                        border-color: var(--input) !important;
                    }
                ` }),
        /* @__PURE__ */ jsx(RecaptchaV3Style, {}),
        children
      ]
    }
  );
}
function RecaptchaV3Style() {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const { theme } = useTheme();
  const { lang } = useLang();
  useEffect(() => {
    if (!executeRecaptcha) return;
    const updateRecaptcha = async () => {
      const iframe = document.querySelector(
        "iframe[title='reCAPTCHA']"
      );
      if (iframe) {
        const iframeSrcUrl = new URL(iframe.src);
        iframeSrcUrl.searchParams.set("theme", theme);
        if (lang) iframeSrcUrl.searchParams.set("hl", lang);
        iframe.src = iframeSrcUrl.toString();
      }
    };
    updateRecaptcha();
  }, [executeRecaptcha, theme, lang]);
  return null;
}
function useCurrentOrganization({
  slug: slugProp
} = {}) {
  const {
    organization: organizationOptions,
    hooks: { useActiveOrganization, useListOrganizations }
  } = useContext(AuthUIContext);
  const { pathMode, slug: contextSlug } = organizationOptions || {};
  let data;
  let isPending;
  let isRefetching;
  let refetch;
  const {
    data: organizations,
    isPending: organizationsPending,
    isRefetching: organizationsRefetching
  } = useListOrganizations();
  if (pathMode === "slug") {
    const slug = slugProp || contextSlug;
    data = organizations == null ? void 0 : organizations.find((organization) => organization.slug === slug);
    isPending = organizationsPending;
    isRefetching = organizationsRefetching;
  } else {
    const {
      data: activeOrganization,
      isPending: organizationPending,
      isRefetching: organizationRefetching,
      refetch: refetchOrganization
    } = useActiveOrganization();
    refetch = refetchOrganization;
    data = activeOrganization;
    isPending = organizationPending;
    isRefetching = organizationRefetching;
  }
  return useMemo(
    () => ({
      data,
      isPending,
      isRefetching,
      refetch
    }),
    [data, isPending, isRefetching, refetch]
  );
}
var OrganizationRefetcher = () => {
  const {
    hooks: { useListOrganizations, useSession },
    organization: organizationOptions,
    navigate,
    redirectTo
  } = useContext(AuthUIContext);
  const { slug, pathMode, personalPath } = organizationOptions || {};
  const { data: sessionData } = useSession();
  const {
    data: organization,
    isPending: organizationPending,
    isRefetching: organizationRefetching,
    refetch: refetchOrganization
  } = useCurrentOrganization();
  const { refetch: refetchListOrganizations } = useListOrganizations();
  const { data: organizations } = useListOrganizations();
  useEffect(() => {
    if (!(sessionData == null ? void 0 : sessionData.user.id)) return;
    if (organization || organizations) {
      refetchOrganization == null ? void 0 : refetchOrganization();
      refetchListOrganizations == null ? void 0 : refetchListOrganizations();
    }
  }, [sessionData == null ? void 0 : sessionData.user.id]);
  useEffect(() => {
    if (organizationRefetching || organizationPending) return;
    if (slug && pathMode === "slug" && !organization) {
      navigate(personalPath || redirectTo);
    }
  }, [
    organization,
    organizationRefetching,
    organizationPending,
    slug,
    pathMode,
    personalPath,
    navigate,
    redirectTo
  ]);
  return null;
};
var AuthUIContext = createContext(
  {}
);
function useAuthData({
  queryFn,
  cacheKey,
  staleTime = 1e4
  // Default 10 seconds
}) {
  var _a;
  const {
    hooks: { useSession },
    toast: toast2,
    localization,
    localizeErrors
  } = useContext(AuthUIContext);
  const { data: sessionData, isPending: sessionPending } = useSession();
  const queryFnRef = useRef(queryFn);
  queryFnRef.current = queryFn;
  const stableCacheKey = cacheKey || queryFn.toString();
  const cacheEntry = useSyncExternalStore(
    useCallback(
      (callback) => authDataCache.subscribe(stableCacheKey, callback),
      [stableCacheKey]
    ),
    useCallback(
      () => authDataCache.get(stableCacheKey),
      [stableCacheKey]
    ),
    useCallback(
      () => authDataCache.get(stableCacheKey),
      [stableCacheKey]
    )
  );
  const initialized = useRef(false);
  const previousUserId = useRef(void 0);
  const [error, setError] = useState(null);
  const refetch = useCallback(async () => {
    const existingRequest = authDataCache.getInFlightRequest(stableCacheKey);
    if (existingRequest) {
      try {
        const result = await existingRequest;
        if (result.error) {
          setError(result.error);
        } else {
          setError(null);
        }
      } catch (err) {
        setError(err);
      }
      return;
    }
    if ((cacheEntry == null ? void 0 : cacheEntry.data) !== void 0) {
      authDataCache.setRefetching(stableCacheKey, true);
    }
    const fetchPromise = queryFnRef.current();
    authDataCache.setInFlightRequest(stableCacheKey, fetchPromise);
    try {
      const { data, error: error2 } = await fetchPromise;
      if (error2) {
        setError(error2);
        toast2({
          variant: "error",
          message: getLocalizedError({
            error: error2,
            localization,
            localizeErrors
          })
        });
      } else {
        setError(null);
      }
      authDataCache.set(stableCacheKey, data);
    } catch (err) {
      const error2 = err;
      setError(error2);
      toast2({
        variant: "error",
        message: getLocalizedError({
          error: error2,
          localization,
          localizeErrors
        })
      });
    } finally {
      authDataCache.setRefetching(stableCacheKey, false);
      authDataCache.removeInFlightRequest(stableCacheKey);
    }
  }, [stableCacheKey, toast2, localization, localizeErrors, cacheEntry]);
  useEffect(() => {
    var _a2;
    const currentUserId = (_a2 = sessionData == null ? void 0 : sessionData.user) == null ? void 0 : _a2.id;
    if (!sessionData) {
      authDataCache.setRefetching(stableCacheKey, false);
      authDataCache.clear(stableCacheKey);
      initialized.current = false;
      previousUserId.current = void 0;
      return;
    }
    const userIdChanged = previousUserId.current !== void 0 && previousUserId.current !== currentUserId;
    if (userIdChanged) {
      authDataCache.clear(stableCacheKey);
    }
    const hasCachedData = (cacheEntry == null ? void 0 : cacheEntry.data) !== void 0;
    const isStale = !cacheEntry || Date.now() - cacheEntry.timestamp > staleTime;
    if (!initialized.current || !hasCachedData || userIdChanged || hasCachedData && isStale) {
      if (!hasCachedData || isStale) {
        initialized.current = true;
        refetch();
      }
    }
    previousUserId.current = currentUserId;
  }, [
    sessionData,
    (_a = sessionData == null ? void 0 : sessionData.user) == null ? void 0 : _a.id,
    stableCacheKey,
    refetch,
    cacheEntry,
    staleTime
  ]);
  const isPending = sessionPending || (cacheEntry == null ? void 0 : cacheEntry.data) === void 0 && !error;
  return {
    data: (cacheEntry == null ? void 0 : cacheEntry.data) ?? null,
    isPending,
    isRefetching: (cacheEntry == null ? void 0 : cacheEntry.isRefetching) ?? false,
    error,
    refetch
  };
}
var DefaultLink = ({ href, className, children }) => /* @__PURE__ */ jsx("a", { className, href, children });
var defaultNavigate = (href) => {
  window.location.href = href;
};
var defaultReplace = (href) => {
  window.location.replace(href);
};
var defaultToast = ({ variant = "default", message }) => {
  if (variant === "default") {
    toast(message);
  } else {
    toast[variant](message);
  }
};
function BetterAuthPluginProvider({
  children
}) {
  var _a;
  const authOverrides = usePluginOverrides("auth", {
    localization: authLocalization,
    basePath: "/auth",
    redirectTo: "/",
    freshAge: 60 * 60 * 24,
    changeEmail: true,
    nameRequired: true,
    Link: DefaultLink,
    navigate: defaultNavigate,
    replace: defaultReplace,
    toast: defaultToast
  });
  const accountOverrides = usePluginOverrides("account", {});
  const organizationOverrides = usePluginOverrides("organization", {});
  const authClient = authOverrides.authClient;
  const avatar = useMemo(() => {
    if (!authOverrides.avatar) return;
    if (authOverrides.avatar === true) {
      return {
        extension: "png",
        size: 128
      };
    }
    return {
      upload: authOverrides.avatar.upload,
      delete: authOverrides.avatar.delete,
      extension: authOverrides.avatar.extension || "png",
      size: authOverrides.avatar.size || (authOverrides.avatar.upload ? 256 : 128),
      Image: authOverrides.avatar.Image
    };
  }, [authOverrides.avatar]);
  const account = useMemo(() => {
    const accountProp = accountOverrides == null ? void 0 : accountOverrides.account;
    if (!accountProp) return void 0;
    if (accountProp === true) {
      const basePathRaw2 = (accountOverrides == null ? void 0 : accountOverrides.basePath) ?? "/account";
      const basePath3 = basePathRaw2.endsWith("/") ? basePathRaw2.slice(0, -1) : basePathRaw2;
      return {
        basePath: basePath3,
        fields: ["image", "name"],
        viewPaths: accountViewPaths
      };
    }
    const basePathRaw = accountProp.basePath ?? (accountOverrides == null ? void 0 : accountOverrides.basePath) ?? "/account";
    const basePath2 = basePathRaw.endsWith("/") ? basePathRaw.slice(0, -1) : basePathRaw;
    return {
      basePath: basePath2,
      fields: accountProp.fields || ["image", "name"],
      viewPaths: { ...accountViewPaths, ...accountProp.viewPaths }
    };
  }, [accountOverrides == null ? void 0 : accountOverrides.account, accountOverrides == null ? void 0 : accountOverrides.basePath]);
  const deleteUser = useMemo(() => {
    if (!(accountOverrides == null ? void 0 : accountOverrides.deleteUser)) return;
    if (accountOverrides.deleteUser === true) {
      return {};
    }
    return accountOverrides.deleteUser;
  }, [accountOverrides == null ? void 0 : accountOverrides.deleteUser]);
  const social = useMemo(() => {
    return authOverrides.social;
  }, [authOverrides.social]);
  const genericOAuth = useMemo(() => {
    return authOverrides.genericOAuth;
  }, [authOverrides.genericOAuth]);
  const credentials = useMemo(() => {
    var _a2, _b;
    if (authOverrides.credentials === false) return;
    if (authOverrides.credentials === true) {
      return {
        forgotPassword: true,
        usernameRequired: true
      };
    }
    return {
      ...authOverrides.credentials,
      forgotPassword: ((_a2 = authOverrides.credentials) == null ? void 0 : _a2.forgotPassword) ?? true,
      usernameRequired: ((_b = authOverrides.credentials) == null ? void 0 : _b.usernameRequired) ?? true
    };
  }, [authOverrides.credentials]);
  const signUp = useMemo(() => {
    if (authOverrides.signUp === false) return;
    if (authOverrides.signUp === true || authOverrides.signUp === void 0) {
      return {
        fields: ["name"]
      };
    }
    return {
      fields: authOverrides.signUp.fields || ["name"]
    };
  }, [authOverrides.signUp]);
  const organization = useMemo(() => {
    const organizationProp = organizationOverrides == null ? void 0 : organizationOverrides.organization;
    if (!organizationProp) return void 0;
    if (organizationProp === true) {
      const basePathRaw2 = (organizationOverrides == null ? void 0 : organizationOverrides.basePath) ?? "/organization";
      const basePath3 = basePathRaw2.endsWith("/") ? basePathRaw2.slice(0, -1) : basePathRaw2;
      return {
        basePath: basePath3,
        viewPaths: organizationViewPaths,
        customRoles: []
      };
    }
    let logo;
    if (organizationProp.logo === true) {
      logo = {
        extension: "png",
        size: 128
      };
    } else if (organizationProp.logo) {
      logo = {
        upload: organizationProp.logo.upload,
        delete: organizationProp.logo.delete,
        extension: organizationProp.logo.extension || "png",
        size: organizationProp.logo.size || (organizationProp.logo.upload ? 256 : 128)
      };
    }
    const basePathRaw = organizationProp.basePath ?? (organizationOverrides == null ? void 0 : organizationOverrides.basePath) ?? "/organization";
    const basePath2 = basePathRaw.endsWith("/") ? basePathRaw.slice(0, -1) : basePathRaw;
    return {
      ...organizationProp,
      logo,
      basePath: basePath2,
      customRoles: organizationProp.customRoles || [],
      viewPaths: {
        ...organizationViewPaths,
        ...organizationProp.viewPaths
      }
    };
  }, [organizationOverrides == null ? void 0 : organizationOverrides.organization, organizationOverrides == null ? void 0 : organizationOverrides.basePath]);
  const teams = useMemo(() => {
    var _a2, _b;
    const teamsProp = (organizationOverrides == null ? void 0 : organizationOverrides.teams) ?? (accountOverrides == null ? void 0 : accountOverrides.teams);
    if (!teamsProp || !organization) return;
    if (teamsProp === true) {
      return {
        enabled: true,
        customRoles: [],
        colors: {
          count: 5,
          prefix: "team"
        }
      };
    }
    return {
      enabled: teamsProp.enabled ?? true,
      customRoles: teamsProp.customRoles || [],
      colors: {
        count: ((_a2 = teamsProp.colors) == null ? void 0 : _a2.count) ?? 5,
        prefix: ((_b = teamsProp.colors) == null ? void 0 : _b.prefix) ?? "team"
      }
    };
  }, [organizationOverrides == null ? void 0 : organizationOverrides.teams, accountOverrides == null ? void 0 : accountOverrides.teams, organization]);
  const defaultMutators = useMemo(() => {
    return {
      deleteApiKey: (params) => authClient.apiKey.delete({
        ...params,
        fetchOptions: { throw: true }
      }),
      deletePasskey: (params) => authClient.passkey.deletePasskey({
        ...params,
        fetchOptions: { throw: true }
      }),
      revokeDeviceSession: (params) => authClient.multiSession.revoke({
        ...params,
        fetchOptions: { throw: true }
      }),
      revokeSession: (params) => authClient.revokeSession({
        ...params,
        fetchOptions: { throw: true }
      }),
      setActiveSession: (params) => authClient.multiSession.setActive({
        ...params,
        fetchOptions: { throw: true }
      }),
      updateOrganization: (params) => authClient.organization.update({
        ...params,
        fetchOptions: { throw: true }
      }),
      updateTeam: (params) => authClient.$fetch("/organization/update-team", {
        method: "POST",
        body: params,
        throw: true
      }),
      updateUser: (params) => authClient.updateUser({
        ...params,
        fetchOptions: { throw: true }
      }),
      unlinkAccount: (params) => authClient.unlinkAccount({
        ...params,
        fetchOptions: { throw: true }
      })
    };
  }, [authClient]);
  const defaultHooks = useMemo(() => {
    return {
      useSession: authClient.useSession,
      useListAccounts: () => useAuthData({
        queryFn: authClient.listAccounts,
        cacheKey: "listAccounts"
      }),
      useAccountInfo: (params) => useAuthData({
        queryFn: () => authClient.accountInfo(params),
        cacheKey: `accountInfo:${JSON.stringify(params)}`
      }),
      useListDeviceSessions: () => useAuthData({
        queryFn: authClient.multiSession.listDeviceSessions,
        cacheKey: "listDeviceSessions"
      }),
      useListSessions: () => useAuthData({
        queryFn: authClient.listSessions,
        cacheKey: "listSessions"
      }),
      useListPasskeys: authClient.useListPasskeys,
      useListApiKeys: () => useAuthData({
        queryFn: authClient.apiKey.list,
        cacheKey: "listApiKeys"
      }),
      useActiveOrganization: authClient.useActiveOrganization,
      useListOrganizations: authClient.useListOrganizations,
      useHasPermission: (params) => useAuthData({
        queryFn: () => authClient.$fetch("/organization/has-permission", {
          method: "POST",
          body: params
        }),
        cacheKey: `hasPermission:${JSON.stringify(params)}`
      }),
      useInvitation: (params) => useAuthData({
        queryFn: () => authClient.organization.getInvitation(params),
        cacheKey: `invitation:${JSON.stringify(params)}`
      }),
      useListInvitations: (params) => useAuthData({
        queryFn: () => {
          var _a2;
          return authClient.$fetch(
            `/organization/list-invitations?organizationId=${((_a2 = params == null ? void 0 : params.query) == null ? void 0 : _a2.organizationId) || ""}`
          );
        },
        cacheKey: `listInvitations:${JSON.stringify(params)}`
      }),
      useListUserInvitations: () => useAuthData({
        queryFn: () => authClient.$fetch(
          "/organization/list-user-invitations"
        ),
        cacheKey: `listUserInvitations`
      }),
      useListMembers: (params) => useAuthData({
        queryFn: () => {
          var _a2;
          return authClient.$fetch(
            `/organization/list-members?organizationId=${((_a2 = params == null ? void 0 : params.query) == null ? void 0 : _a2.organizationId) || ""}`
          );
        },
        cacheKey: `listMembers:${JSON.stringify(params)}`
      }),
      useListTeams: (params) => useAuthData({
        queryFn: () => authClient.$fetch(
          `/organization/list-teams?organizationId=${(params == null ? void 0 : params.organizationId) || ""}`
        ),
        cacheKey: `listTeams:${JSON.stringify(params)}`
      }),
      useListTeamMembers: (params) => useAuthData({
        queryFn: () => authClient.$fetch("/organization/list-team-members", {
          method: "POST",
          body: (params == null ? void 0 : params.teamId) ? { query: { teamId: params.teamId } } : void 0
        }),
        cacheKey: `listTeamMembers:${JSON.stringify(params)}`
      }),
      useListUserTeams: () => useAuthData({
        queryFn: () => authClient.$fetch("/organization/list-user-teams"),
        cacheKey: "listUserTeams"
      })
    };
  }, [authClient]);
  const viewPaths = useMemo(() => {
    return { ...authViewPaths, ...authOverrides.viewPaths };
  }, [authOverrides.viewPaths]);
  const localization = useMemo(() => {
    return { ...authLocalization, ...authOverrides.localization };
  }, [authOverrides.localization]);
  const hooks = useMemo(() => {
    return { ...defaultHooks, ...authOverrides.hooks };
  }, [defaultHooks, authOverrides.hooks]);
  const mutators = useMemo(() => {
    return { ...defaultMutators, ...authOverrides.mutators };
  }, [defaultMutators, authOverrides.mutators]);
  const baseURL = authOverrides.baseURL ? authOverrides.baseURL.endsWith("/") ? authOverrides.baseURL.slice(0, -1) : authOverrides.baseURL : "";
  const basePath = authOverrides.basePath ? authOverrides.basePath.endsWith("/") ? authOverrides.basePath.slice(0, -1) : authOverrides.basePath : "/auth";
  const emailVerification = useMemo(() => {
    const ev = authOverrides.emailVerification;
    if (!ev) return void 0;
    if (ev === true) return { otp: false };
    return { otp: ev.otp ?? false };
  }, [authOverrides.emailVerification]);
  const { data: sessionData } = hooks.useSession();
  const contextValue = {
    authClient,
    avatar,
    basePath: basePath === "/" ? "" : basePath,
    baseURL,
    // Auth-specific feature flags — always read from authOverrides, never from the
    // merged blob, so account/org overrides can't silently overwrite them.
    captcha: authOverrides.captcha,
    redirectTo: authOverrides.redirectTo || "/",
    changeEmail: authOverrides.changeEmail ?? true,
    credentials,
    deleteUser,
    freshAge: authOverrides.freshAge ?? 60 * 60 * 24,
    genericOAuth,
    hooks,
    mutators,
    localization,
    nameRequired: authOverrides.nameRequired ?? true,
    organization,
    teams,
    account,
    signUp,
    social,
    // Shared navigation — account/org can legitimately override these via ...authConfig
    toast: authOverrides.toast || defaultToast,
    navigate: authOverrides.navigate || defaultNavigate,
    replace: authOverrides.replace || authOverrides.navigate || defaultReplace,
    viewPaths,
    Link: authOverrides.Link || DefaultLink,
    apiKey: authOverrides.apiKey,
    gravatar: authOverrides.gravatar,
    additionalFields: authOverrides.additionalFields,
    magicLink: authOverrides.magicLink,
    emailOTP: authOverrides.emailOTP,
    passkey: authOverrides.passkey,
    oneTap: authOverrides.oneTap,
    twoFactor: authOverrides.twoFactor,
    multiSession: authOverrides.multiSession,
    emailVerification,
    localizeErrors: authOverrides.localizeErrors ?? true,
    persistClient: authOverrides.persistClient,
    optimistic: authOverrides.optimistic,
    onSessionChange: authOverrides.onSessionChange
  };
  return /* @__PURE__ */ jsxs(AuthUIContext.Provider, { value: contextValue, children: [
    sessionData && organization && /* @__PURE__ */ jsx(OrganizationRefetcher, {}),
    ((_a = authOverrides.captcha) == null ? void 0 : _a.provider) === "google-recaptcha-v3" ? /* @__PURE__ */ jsx(RecaptchaV3, { children }) : children
  ] });
}
export {
  AuthUIContext as A,
  BetterAuthPluginProvider as B,
  useLang as a,
  useTheme as b,
  useCurrentOrganization as c,
  useIsHydrated as u
};
