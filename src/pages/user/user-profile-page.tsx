import { UserProfile } from "@/components";
import { useParams } from "react-router-dom";

export function UserProfilePage() {
  const { id } = useParams();

  return <UserProfile id={id ?? ""} />;
}
