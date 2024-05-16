import { toast } from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import makeRequest from "../axios";

const useFollow = () => {
  const queryClient = useQueryClient();

  const {
    mutate: follow,
    isPending,
    error,
  } = useMutation({
    mutationFn: async (userId) => {
      const res = await makeRequest.post(`/users/follow/${userId}`);
      return res.data;
    },
    onSuccess: (data) => {
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] }),
        queryClient.invalidateQueries({ queryKey: ["currentUser"] }),
      ]);
      toast.success(data.message);
    },
    onError: () => {
      toast.error(error.response.data.message);
    },
  });

  return { follow, isPending };
};

export default useFollow;
