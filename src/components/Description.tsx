import Markdown from "react-markdown";

export default function Description({ content }: { content: string }) {
  return <div className="border p-3 mb-4">{content && <Markdown>{content}</Markdown>}</div>;
}
