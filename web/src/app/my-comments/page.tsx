"use client";

import { useSession } from "@/contexts/sessionContext";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BackendApi } from "@/services/api";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  CommentParentTypeEnum,
  UserCommentWithPlaylist,
  UserCommentWithSong,
} from "@/classes/comment";

export default function MyCommentsPage() {
  const [comments, setComments] = useState<
    (UserCommentWithSong | UserCommentWithPlaylist)[]
  >([]);
  const [fetching, setFetching] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [lastId, setLastId] = useState<string>("");

  const { session, loading } = useSession();

  useEffect(() => {
    if (session) {
      fetchComments("", true);
    }
    if (!loading && !session) {
      window.location.href = "/";
    }
  }, [session, loading]);

  const fetchComments = async (nextId: string, replace: boolean) => {
    if (session) {
      setFetching(true);
      try {
        const comments = await BackendApi.fetchUserComments(
          nextId,
          session.access_token,
        );
        if (replace) {
          setComments(comments.comments);
        } else {
          setComments((prev) => [...prev, ...comments.comments]);
        }
        setLastId(comments.lastId);
        setHasMore(comments.lastId !== "");
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      } finally {
        setFetching(false);
      }
    }
  };

  const fetchMoreComments = async () => {
    fetchComments(lastId, false);
  };

  const handleDeleteComment = async (commentId: string, title: string) => {
    if (
      session &&
      confirm(`Are you sure you want to delete your comment on "${title}"?`)
    ) {
      try {
        const response = await BackendApi.deleteComment(
          commentId,
          session.access_token,
        );
        if (response.ok) {
          fetchComments("", true);
        } else if (response.status === 429) {
          alert("You are being rate limited. Please try again later.");
        }
      } catch (error) {
        console.error("Failed to delete comment:", error);
        alert("Failed to delete comment");
      }
    }
  };
  return (
    <div className="max-w-3xl px-2 mx-auto">
      {comments.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          {loading || fetching
            ? "Loading..."
            : "No comments found. Start commenting on songs!"}
        </div>
      ) : (
        <InfiniteScroll
          dataLength={comments.length}
          next={fetchMoreComments}
          hasMore={hasMore}
          loader={<p className="text-center mt-4">Loading more...</p>}
        >
          {comments.map((comment) => {
            if (comment.parentType === CommentParentTypeEnum.SONG) {
              const songComment = comment as UserCommentWithSong;
              return (
                <div
                  className="flex p-4 my-4 border border-gray-300 rounded-lg shadow-md"
                  key={`${comment.commentId}`}
                >
                  <Link
                    href={`/song/${songComment.parentId}`}
                    className="mr-4 block flex-shrink-0"
                  >
                    <Image
                      src={songComment.songCover}
                      alt={songComment.title}
                      width={96}
                      height={96}
                      className="object-cover cursor-pointer hover:opacity-80 transition-opacity"
                    />
                  </Link>
                  <div className="flex flex-col my-auto min-w-0">
                    <Link
                      className="font-bold truncate text-ellipsis"
                      href={`/song/${songComment.parentId}`}
                    >
                      {songComment.title}
                    </Link>
                    <p className="text-gray-500 truncate text-ellipsis">
                      {songComment.artist}
                    </p>
                    <p className="text-gray-500 truncate text-ellipsis">
                      {`Your comment: ${songComment.comment}`}
                    </p>
                    <span className="text-sm text-gray-500">
                      {new Date(songComment.commentTime).toLocaleString()}
                      <button
                        className="text-red-500 hover:text-red-700 ml-2"
                        onClick={() =>
                          handleDeleteComment(
                            songComment.commentId,
                            songComment.title,
                          )
                        }
                      >
                        Delete
                      </button>
                    </span>
                  </div>
                </div>
              );
            }
            if (comment.parentType === CommentParentTypeEnum.PLAYLIST) {
              const playlistComment = comment as UserCommentWithPlaylist;
              return (
                <div
                  className="flex p-4 my-4 border border-gray-300 rounded-lg shadow-md"
                  key={`${comment.commentId}`}
                >
                  <Link
                    href={`/playlists/${playlistComment.parentId}`}
                    className="mr-4 block flex-shrink-0"
                  >
                    <Image
                      src={playlistComment.profileImage}
                      alt={playlistComment.playlistTitle}
                      width={96}
                      height={96}
                      className="object-cover cursor-pointer hover:opacity-80 transition-opacity"
                    />
                  </Link>
                  <div className="flex flex-col my-auto min-w-0">
                    <Link
                      className="font-bold truncate text-ellipsis"
                      href={`/playlists/${playlistComment.parentId}`}
                    >
                      {playlistComment.playlistTitle}
                    </Link>
                    <p className="text-gray-500 truncate text-ellipsis">
                      {`Your comment: ${playlistComment.comment}`}
                    </p>
                    <span className="text-sm text-gray-500">
                      {new Date(playlistComment.commentTime).toLocaleString()}
                      <button
                        className="text-red-500 hover:text-red-700 ml-2"
                        onClick={() =>
                          handleDeleteComment(
                            playlistComment.commentId,
                            playlistComment.playlistTitle,
                          )
                        }
                      >
                        Delete
                      </button>
                    </span>
                  </div>
                </div>
              );
            }
          })}
        </InfiniteScroll>
      )}
    </div>
  );
}
