export interface Post {
    id: string;
    authorId: string;
    authorName: string;
    authorPhoto: string;
    content: string;
    imageUrl: string;
    timestamp: any;
    likes: number;
    commentCount: number;
    likedBy: string[];
    savedBy: string[];
    repostedBy: string[];
    isRepost: boolean;
    originalPostId: string;
    originalPost?: Post;
    type: 'post' | 'repost' | 'comment';
    hobbies: string[];
  }
