import { BookData } from "@/types";
import style from "./page.module.css";
import { notFound } from "next/navigation";

// 명시된 param 경로는 빌드 시점에 캐싱해 두고,
// 명시되지 않은 param 경로는 첫 요청에서 서버 사이드 생성 후 사용자에게 응답하고 캐싱한다.
export function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }];
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string | string[] }>;
}) {
  const { id } = await params;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/book/${id}`
  );

  if (!response.ok) {
    if (response.status === 404) {
      notFound();
    }

    return <div>오류가 발생했습니다 ...</div>;
  }

  const books: BookData = await response.json();

  const { title, subTitle, description, author, publisher, coverImgUrl } =
    books;

  return (
    <div className={style.container}>
      <div
        className={style.cover_img_container}
        style={{ backgroundImage: `url('${coverImgUrl}')` }}
      >
        <img src={coverImgUrl} />
      </div>
      <div className={style.title}>{title}</div>
      <div className={style.subTitle}>{subTitle}</div>
      <div className={style.author}>
        {author} | {publisher}
      </div>
      <div className={style.description}>{description}</div>
    </div>
  );
}
