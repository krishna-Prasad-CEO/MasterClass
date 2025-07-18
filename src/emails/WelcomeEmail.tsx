import { Button, Html } from "@react-email/components";
import * as React from "react";

export const WelcomeEmail = () => {
  return (
    <Html>
      <Button
        href="https://example.com"
        style={{ background: "#000", color: "#fff", padding: "12px 20px" }}
      >
        Welcome to our platform!
      </Button>
    </Html>
  );
};

export default WelcomeEmail;
