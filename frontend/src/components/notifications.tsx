import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Icons } from "@/components/ui/icons";

const tags = Array.from({ length: 50 }).map(
  (_, i, a) => `Notification.${a.length - i}`,
);

export function NotificatonsDropDown() {
  return (
    <ScrollArea className="h-60 w-[324px] rounded-md">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">Notifications</h4>
        {tags.map((tag) => (
          <>
            <div key={tag} className="flex items-center text-sm">
              <Icons.SettingsIcon className="mr-2 w-[16px] h-[16px]" />
              {tag}
            </div>
            <Separator className="my-2" />
          </>
        ))}
      </div>
    </ScrollArea>
  );
}
