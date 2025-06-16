"use client";

import { Song } from "@/classes/song";
import DifficultyTable from "@/components/songById/difficulty-table";
import SongTable from "@/components/songById/song-table";
import { redirect, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "@/contexts/sessionContext";
import Image from "next/image";
import { Comment } from "@/classes/comment";
import InfiniteScroll from "react-infinite-scroll-component";
import { BackendApi } from "@/services/api";

export default function SongDetailById() {
  const params = useParams<{ songId: string }>();

  const [song, setSong] = useState<Song | null>(null);
  const [accuracy, setAccuracy] = useState<string>("");
  const [commentText, setCommentText] = useState<string>("");
  const [lastId, setLastId] = useState<string>("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [isSubmittingComment, setIsSubmittingComment] =
    useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [fetching, setFetching] = useState<boolean>(false);

  const { session } = useSession();

  useEffect(() => {
    fetchSong(params.songId);
    fetchComments(params.songId, "", true);
  }, []);

  const fetchMoreComments = async () => {
    fetchComments(params.songId, lastId, false);
  };

  const fetchSong = async (songId: string) => {
    try {
      const song = await BackendApi.fetchSong(songId);
      setSong(song);
    } catch (error) {
      console.error("Failed to fetch song data:", error);
      alert("Failed to fetch song data");
      redirect("/");
    }
  };

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

  const handleSubmitComment = async () => {
    if (!session || !commentText.trim()) return;
    setIsSubmittingComment(true);
    try {
      const response = await BackendApi.submitComment(
        params.songId,
        commentText,
        session.access_token,
      );

      if (response.ok) {
        setCommentText("");
        setLastId("");
        fetchComments(params.songId, "", true);
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
        fetchComments(params.songId, "", true);
      } else {
        alert("Error deleting comment, please try again");
      }
    } catch (error) {
      alert("Error deleting comment, please try again");
      console.error("Error deleting comment:", error);
    }
  };

  return song ? (
    <div className="px-4 flex-col max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold pb-2">Song information</h1>
      <SongTable song={song} />
      <h1 className="text-2xl font-bold py-2">Difficulty information</h1>
      <DifficultyTable song={song} accuracy={Number(accuracy)} />
      <h2 className="text-xl font-bold py-2">Accuracy input (0-101)</h2>
      <input
        className="w-full md:w-40 bg-gray-50 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 block p-1"
        type="number"
        placeholder=" Accuracy (0 - 101)"
        value={accuracy}
        max={101}
        min={0}
        step={0.0001}
        onChange={(e) => {
          setAccuracy(e.target.value);
        }}
      />
      <h1 className="text-2xl font-bold py-2">Comments</h1>

      {session ? (
        <div className="flex gap-4 mb-2">
          <Image
            src={
              session?.user?.user_metadata?.avatar_url || "/default-avatar.png"
            }
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
    </div>
  ) : (
    <div className="max-w-3xl mx-auto">
      <h1>Loading...</h1>
    </div>
  );
}
