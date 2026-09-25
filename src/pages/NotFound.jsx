import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import PageHeader from "../components/ui/PageHeader";
import EmptyState from "../components/ui/EmptyState";

export default function NotFound() {
  return (
    <>
      <PageHeader title="Page not found" description="This route is not part of Web Starzz." />
      <EmptyState
        icon={Search}
        title="No page matches this address"
        description="Check the URL or return to the Overview."
        action={<Link to="/">Go to Overview</Link>}
      />
    </>
  );
}
