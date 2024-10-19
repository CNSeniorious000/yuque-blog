import { apiBaseurl, headers } from "$lib/serverConstants.js";
import { namespace } from "$lib/utils";

interface User {
  id: number;
  type: string;
  login: string;
  name: string;
  avatar_url: string;
  books_count: number;
  public_books_count: number;
  followers_count: number;
  following_count: number;
  public: number;
  description: string;
  created_at: string;
  updated_at: string;
  work_id: string;
  _serializer: string;
}

interface Book {
  id: number;
  type: string;
  slug: string;
  name: string;
  user_id: number;
  description: string;
  creator_id: number;
  public: number;
  items_count: number;
  likes_count: number;
  watches_count: number;
  content_updated_at: string;
  created_at: string;
  updated_at: string;
  user: User;
  namespace: string;
  _serializer: string;
}

interface Document {
  id: number;
  type: string;
  slug: string;
  title: string;
  description: string;
  cover: string;
  user_id: number;
  book_id: number;
  last_editor_id: number;
  format: string;
  body_draft: string;
  body: string;
  body_html: string;
  body_lake: string;
  public: number;
  status: number;
  likes_count: number;
  read_count: number;
  hits: number;
  comments_count: number;
  word_count: number;
  created_at: string;
  updated_at: string;
  content_updated_at: string;
  published_at: string;
  first_published_at: string;
  book: Book;
  user: User;
  tags: string[];
  latest_version_id: number;
  creator: User;
  _serializer: string;
}

export async function getPost(slug: string) {
  const res = await fetch(`${apiBaseurl}/repos/${namespace}/docs/${slug}`, { headers });
  const { data } = await res.json();
  return data as Document;
}
