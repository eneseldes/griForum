/**
 * Comment Features Index
 * 
 * Comment feature'larının merkezi export dosyası. Service, mapper ve hooks'u export eder.
 */

// Comment Service
export { CommentService } from "./CommentService";

// Comment Mappers
export { mapCommentFromApi, mapCommentsFromApi } from "./commentMapper";

// Comment Hooks
export { useCommentInteractions } from "./useCommentInteractions";
export { useCreateComment } from "./useCreateComment";

