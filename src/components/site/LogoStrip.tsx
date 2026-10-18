import Image from "next/image";
import { cn } from "@/lib/utils";

/** Official DoB + ICGI + BIESF logos on a white rounded strip (like the posters). */
export function LogoStrip({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <div className={cn("rounded-[28px] bg-white px-5 py-4 shadow-card ring-1 ring-line sm:px-8", className)}>
      <div className="flex items-center justify-around gap-3 sm:gap-6">
        <Image src="/brand/dob.webp" alt="Dreams of Bangladesh" width={1305} height={459} className={cn("w-auto", compact ? "h-9 sm:h-12" : "h-11 sm:h-16 lg:h-20")} />
        <span className="h-10 w-px bg-line sm:h-14" />
        <Image src="/brand/icgi.webp" alt="ICGI: Indonesian Centre for Giftedness Innovation" width={208} height={94} className={cn("w-auto", compact ? "h-8 sm:h-11" : "h-10 sm:h-14 lg:h-16")} />
        <span className="h-10 w-px bg-line sm:h-14" />
        <Image src="/brand/biesf.webp" alt="BIESF: Bali International Engineering Science Fair" width={236} height={144} className={cn("w-auto rounded-md", compact ? "h-9 sm:h-12" : "h-11 sm:h-16 lg:h-20")} />
      </div>
    </div>
  );
}
