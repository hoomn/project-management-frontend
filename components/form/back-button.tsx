import Link from "next/link";

import Icon from "@/components/ui/icon";

type BackButtonProps = {
  href: string;
};

export default function BackButton({ href }: BackButtonProps) {
  return (
    <Link href={href} className="btn btn-outline-danger mx-1">
      <Icon icon="arrow-left" />
      back
    </Link>
  );
}
