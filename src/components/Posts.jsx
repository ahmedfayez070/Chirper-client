import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import makeRequest from "../axios";

import Post from "./Post";
import PostSkeleton from "./skeletons/PostSkeleton";
import LoadingSpinner from "./LoadingSpinner";

const Posts = ({ feedType, username, id }) => {
  const getFeedEndPoint = () => {
    switch (feedType) {
      case "forYou":
        return "/posts/all";
      case "following":
        return "/posts/following";
      case "userProfilePosts":
        return `/posts/user/${username}`;
      case "likes":
        return `/posts/likes/${id}`;
      default:
        return "/posts/all";
    }
  };
  const POST_ENDPOINT = getFeedEndPoint();

  const { ref, inView } = useInView();

  const {
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isPending,
    data,
    refetch,
    isRefetching,
  } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: async ({ pageParam }) => {
      const res = await makeRequest.get(POST_ENDPOINT + `/${pageParam}`);
      return res.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = lastPage.length > 0 ? allPages.length + 1 : undefined;
      return nextPage;
    },
  });

  useEffect(() => {
    refetch();
  }, [refetch, feedType, username, id]);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const content = data?.pages.map((posts) =>
    posts.map((post, index) => {
      if (posts.length == index + 1) {
        return <Post key={post._id} post={post} innerRef={ref} />;
      }
      return <Post key={post._id} post={post} />;
    })
  );

  return (
    <>
      {(isPending || isRefetching) && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {!isPending && !isRefetching && data?.pages[0].length === 0 && (
        <p className="text-center my-4">No posts in this tab. Switch 👻</p>
      )}
      {!isPending && !isRefetching && <div>{content}</div>}
      {isFetchingNextPage && (
        <div className="flex justify-center items-center my-5">
          <LoadingSpinner size="lg" />
        </div>
      )}
    </>
  );
};
export default Posts;
