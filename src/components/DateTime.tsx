type DateTimeProps = {
  dateString: string | null | undefined;
};

export default function DateTime({ dateString }: DateTimeProps) {
  const formatDate = (dateString: string | null | undefined): string => {
    if (dateString == null || dateString == undefined || dateString == "") return "___ __, ____";

    const formattedDate = new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      year: "numeric",
      month: "short",
      timeZone: "UTC",
    }).format(new Date(dateString));

    return formattedDate;
  };

  return <small className="text-muted m-0 ">{formatDate(dateString)}</small>;
}
