"use client";

import { useMemo, useState } from "react";

import { Check, Copy, Mail, MessageCircle, Share2 } from "lucide-react";
import { FaInstagram, FaTelegram, FaWhatsapp } from "react-icons/fa";
import { toast } from "sonner";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const MENTOR_APP_URL = "https://mentor.leadlly.in";

const getShareMessage = (instituteName: string, instituteCode: string) => {
  const name = instituteName.trim() || "our institute";

  return `Dear Teacher,

You have been invited to join ${name} on Leadlly as a faculty member.

Please sign up or sign in at ${MENTOR_APP_URL} and enter the institute code below to join:

Institute Code: ${instituteCode}

If you already have a Leadlly teacher account, simply sign in and use the same code.

Kindly complete this at your earliest convenience so we can assign your classes.

Best regards,
Admin, ${name}`;
};

interface ShareInstituteCodeProps {
  instituteName: string;
  instituteCode: string;
}

const ShareInstituteCode = ({
  instituteName,
  instituteCode,
}: ShareInstituteCodeProps) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const message = useMemo(
    () => getShareMessage(instituteName, instituteCode),
    [instituteName, instituteCode]
  );
  const encodedMessage = encodeURIComponent(message);
  const encodedUrl = encodeURIComponent(MENTOR_APP_URL);
  const emailSubject = encodeURIComponent(
    `Invitation to join ${instituteName || "our institute"} on Leadlly`
  );

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      toast.success("Message copied");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy message");
    }
  };

  const shareNative = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `${instituteName || "Institute"} — Teacher invitation`,
          text: message,
          url: MENTOR_APP_URL,
        });
        return;
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
      }
    }
    await copyMessage();
  };

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodedMessage}`, "_blank", "noopener,noreferrer");
  };

  const shareTelegram = () => {
    window.open(
      `https://t.me/share/url?url=${encodedUrl}&text=${encodedMessage}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const shareEmail = () => {
    window.open(
      `mailto:?subject=${emailSubject}&body=${encodedMessage}`,
      "_self"
    );
  };

  const shareInstagram = async () => {
    await copyMessage();
    toast.message("Paste this invitation in Instagram", {
      description: "The message is already copied to your clipboard.",
    });
    window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
  };

  const shareOptions = [
    {
      label: "WhatsApp",
      onClick: shareWhatsApp,
      className: "bg-[#25D366] text-white",
      icon: <FaWhatsapp className="size-5" />,
    },
    {
      label: "Instagram",
      onClick: () => void shareInstagram(),
      className:
        "bg-linear-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white",
      icon: <FaInstagram className="size-5" />,
    },
    {
      label: "Telegram",
      onClick: shareTelegram,
      className: "bg-[#229ED9] text-white",
      icon: <FaTelegram className="size-5" />,
    },
    {
      label: "Email",
      onClick: shareEmail,
      className: "bg-primary text-primary-foreground",
      icon: <Mail className="size-5" />,
    },
    {
      label: copied ? "Copied" : "Copy",
      onClick: () => void copyMessage(),
      className: "bg-muted text-foreground",
      icon: copied ? <Check className="size-5" /> : <Copy className="size-5" />,
    },
    {
      label: "More",
      onClick: () => void shareNative(),
      className: "bg-foreground text-background",
      icon: <Share2 className="size-5" />,
    },
  ];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={!instituteCode}
        className="rounded-md p-0.5 hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors opacity-70 hover:opacity-100 disabled:opacity-40 disabled:pointer-events-none"
        aria-label="Share institute code with teachers"
        title="Share with teachers"
      >
        <Share2 className="w-4 h-4" aria-hidden />
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="bottom"
          className="rounded-t-2xl max-w-lg mx-auto inset-x-0"
        >
          <SheetHeader className="text-left pr-6">
            <SheetTitle>Share with teachers</SheetTitle>
            <SheetDescription>
              Send your institute code so teachers can join on Leadlly.
            </SheetDescription>
          </SheetHeader>

          <div className="mt-4 rounded-xl border bg-muted/40 p-3">
            <p className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
              <MessageCircle className="size-3.5" />
              Invitation message
            </p>
            <p className="text-sm whitespace-pre-wrap leading-relaxed text-foreground">
              {message}
            </p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mt-5">
            {shareOptions.map((option) => (
              <button
                key={option.label}
                type="button"
                onClick={option.onClick}
                className="flex flex-col items-center gap-2 rounded-lg p-1.5 hover:bg-muted/70 transition-colors"
              >
                <span
                  className={`size-12 rounded-full grid place-items-center shadow-xs ${option.className}`}
                >
                  {option.icon}
                </span>
                <span className="text-xs font-medium text-muted-foreground">
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default ShareInstituteCode;
