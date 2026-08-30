"use client";

const displayNameGenerator = (email: string) => {
  if (!email || !email.includes("@")) return "";
  return email.split("@")[0];
};

export default displayNameGenerator