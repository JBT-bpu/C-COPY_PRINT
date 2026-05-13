import Image from "next/image";

/**
 * Brand icon — wraps next/image for the sliced 3D-style icons
 * from icons.png. All icons are decorative (aria-hidden).
 *
 * Usage: <BrandIcon name="digital-printer" className="size-6" />
 *
 * Available names (see public/icons/):
 *   digital-printer, wide-format-printer, design-tools, signage-board,
 *   document-page, notebook, quality-shield, technology-gear,
 *   partnership-handshake, pricing-dollar, fast-service, team-customers,
 *   delivery-truck, upload-file, testimonial-quote, approved-check,
 *   phone-contact, email-envelope, location-pin, facebook, instagram,
 *   whatsapp, play-video, storefront, quotation-marks
 */

type BrandIconProps = {
    name: string;
    className?: string;
};

export function BrandIcon({ name, className = "size-6" }: BrandIconProps) {
    return (
        <Image
            src={`/icons/${name}.png`}
            alt=""
            width={48}
            height={48}
            className={className}
            aria-hidden
            unoptimized
        />
    );
}
