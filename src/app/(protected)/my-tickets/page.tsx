import { Suspense } from "react";

import MyTickets from "@/components/pages/my-tickets";

export default function MyTicketsPage() {
  return (
    <Suspense fallback={<p>Loading your tickets...</p>}>
      <MyTickets />
    </Suspense>
  );
}
