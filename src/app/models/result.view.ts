import { PostDto } from './post.dto';

export interface ResultView {
  readonly loaded: boolean;
  readonly posts?: PostDto[];
}
