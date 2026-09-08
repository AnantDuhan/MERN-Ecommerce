import { Redirect } from "expo-router";

// Entry → editorial splash → onboarding → login.
// (Was redirecting straight to /login during early dev.)
export default function Index() {
  return <Redirect href="/splash" />;
}
