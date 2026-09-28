export const displayName = (value: string) => {
  const trimmedValue = value.trim();
  const name = trimmedValue.includes("@")
    ? (trimmedValue.split("@")[0] ?? "")
    : trimmedValue;

  return name ? `${name.charAt(0).toUpperCase()}${name.slice(1)}` : "";
};
