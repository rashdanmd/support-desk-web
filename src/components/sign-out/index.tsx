"use client";

type SignOutProps = {
  onClick: () => void;
};

export default function SignOut({ onClick }: SignOutProps) {
  return (
    <button type="button" role="menuitem" onClick={onClick}>
      Sign out
    </button>
  );
}
