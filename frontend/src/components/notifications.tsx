import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Icons } from "@/components/ui/icons";
import { useEffect, useState } from "react";
import { fetchFeedbackForUser } from "@/lib/api/api";
import { useAuthStore } from "@/stores/authStore";

export function NotificatonsDropDown() {
  const { userId, userType } = useAuthStore();
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId || userType !== "sectorCoordinator") return;
    setLoading(true);
    fetchFeedbackForUser(Number(userId))
      .then(setFeedbacks)
      .finally(() => setLoading(false));
  }, [userId, userType]);

  return (
    <ScrollArea className="h-60 w-[324px] rounded-md">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">Feedback Notifications</h4>
        {loading ? (
          <div className="text-xs text-gray-400">Loading...</div>
        ) : feedbacks.length === 0 ? (
          <div className="text-xs text-gray-400">No feedback notifications.</div>
        ) : (
          feedbacks.map((fb) => (
            <div key={fb.id}>
              <div className="flex items-center text-sm">
                <Icons.SettingsIcon className="mr-2 w-[16px] h-[16px]" />
                <span className="font-semibold mr-1">{fb.section}</span>
                <span className="mr-1">#{fb.itemId}</span>
                <span className="truncate">{fb.message.slice(0, 40)}{fb.message.length > 40 ? '...' : ''}</span>
              </div>
              <Separator className="my-2" />
            </div>
          ))
        )}
      </div>
    </ScrollArea>
  );
}
