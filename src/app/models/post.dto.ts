export interface PostDto {
  readonly id: number;
  readonly title: string;
  readonly body: string;
  readonly tags: string[];
  readonly reactions: {
    readonly likes: number;
    readonly dislikes: number;
  };
  readonly views: number;
  readonly userId: number;
}
