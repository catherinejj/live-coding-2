import { PostDto } from './post.dto';

export interface PostsResponseDto {
  readonly posts: PostDto[];
  readonly total: number;
  readonly skip: number;
  readonly limit: number;
}
