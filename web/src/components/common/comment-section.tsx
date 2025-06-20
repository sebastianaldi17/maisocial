"use client";

import { Comment, CommentParentTypeEnum } from "@/classes/comment";
import { useSession } from "@/contexts/sessionContext";
import { BackendApi } from "@/services/api";
import Image from "next/image";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

interface CommentSectionProps {
  parentId: string;
  parentType: CommentParentTypeEnum;
}

export default function CommentSection({
  parentId,
  parentType,
}: CommentSectionProps) {
  const [commentText, setCommentText] = useState<string>("");
  const [lastId, setLastId] = useState<string>("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [isSubmittingComment, setIsSubmittingComment] =
    useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [fetching, setFetching] = useState<boolean>(false);

  const { session } = useSession();

  useEffect(() => {
    fetchComments(parentId, "", true);
  }, [parentId]);

  const fetchComments = async (
    songId: string,
    lastId: string,
    replace: boolean,
  ) => {
    if (fetching) {
      return;
    }
    setFetching(true);
    try {
      const response = await BackendApi.fetchComments(songId, lastId);

      if (replace) {
        setComments(response.comments);
      } else {
        setComments((prev) => [...prev, ...response.comments]);
      }
      setLastId(response.lastId);
      setHasMore(response.lastId !== "");
    } catch (error) {
      alert("Failed to fetch comment data");
      console.error(error);
    } finally {
      setFetching(false);
    }
  };

  const fetchMoreComments = async () => {
    fetchComments(parentId, lastId, false);
  };

  const handleSubmitComment = async () => {
    if (!session || !commentText.trim()) return;
    setIsSubmittingComment(true);
    try {
      const response = await BackendApi.submitComment(
        parentId,
        parentType,
        commentText,
        session.access_token,
      );

      if (response.ok) {
        setCommentText("");
        setLastId("");
        fetchComments(parentId, "", true);
      } else if (response.status === 429) {
        alert(
          "You are posting too many comments, please wait a few seconds before trying again.",
        );
      } else {
        alert("Error posting comment, please try again");
      }
    } catch (error) {
      alert("Error posting comment, please try again");
      console.error("Error posting comment:", error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!session) return;
    if (!confirm("Are you sure you want to delete your comment?")) return;
    try {
      const response = await BackendApi.deleteComment(
        commentId,
        session.access_token,
      );
      if (response.ok) {
        setLastId("");
        fetchComments(parentId, "", true);
      } else {
        alert("Error deleting comment, please try again");
      }
    } catch (error) {
      alert("Error deleting comment, please try again");
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold py-2">Comments</h1>

      {session ? (
        <div className="flex gap-4 mb-2">
          <Image
            src={session?.user?.user_metadata?.avatar_url}
            alt="Profile"
            className="w-10 h-10 rounded-full"
            width={40}
            height={40}
          />
          <div className="flex-1">
            <textarea
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Write a comment..."
              rows={3}
              maxLength={255}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <div className="flex justify-between items-center mt-1">
              <span className="text-sm text-gray-500">
                {commentText.length}/255
              </span>
              <button
                className="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600 disabled:opacity-50"
                disabled={!commentText.trim() || isSubmittingComment}
                onClick={handleSubmitComment}
              >
                Comment
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-gray-500">You must be logged in to comment.</p>{" "}
        </div>
      )}

      <div className="space-y-4 py-6">
        <InfiniteScroll
          dataLength={comments.length}
          next={fetchMoreComments}
          hasMore={hasMore}
          loader={<p className="text-center mt-4">Loading more...</p>}
        >
          {comments.map((comment) => (
            <div key={`${comment._id}`} className="flex gap-4 mb-4">
              <Image
                src={comment.profileImage}
                alt="Profile"
                className="w-10 h-10 rounded-full"
                width={40}
                height={40}
              />
              <div className="flex-1">
                <div className="bg-gray-200 p-3 rounded-lg">
                  <p className="font-semibold">{comment.nickname}</p>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
                <span className="text-sm text-gray-500 ml-2">
                  {new Date(comment.createdAt).toLocaleString()}
                  {comment.userId === session?.user.id && (
                    <button
                      className="text-red-500 hover:text-red-700 ml-2"
                      onClick={() => {
                        handleDeleteComment(comment._id);
                      }}
                    >
                      Delete
                    </button>
                  )}
                </span>
              </div>
            </div>
          ))}
        </InfiniteScroll>
      </div>
    </>
  );
}
