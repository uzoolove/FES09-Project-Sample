import useCustomAxios from "@hooks/useCustomAxios.mjs";
import ReplyItem from "@pages/board/ReplyItem";
import ReplyNew from "@pages/board/ReplyNew";
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import InfiniteScroll from "react-infinite-scroller";
import Spinner from "@components/Spinner";
import { produce } from 'immer';
import { useOutletContext } from "react-router-dom";
import _ from 'lodash';

function ReplyList(){
  const post = useOutletContext();
  const axios = useCustomAxios();
  const queryClient = useQueryClient();

  const { data, fetchNextPage, isFetching } = useInfiniteQuery({
    queryKey: ['posts', post._id, 'replies'],
    queryFn: ({ pageParam=1 }) => axios.get(`/posts/${ post._id }/replies`, { params: { page: pageParam, limit: import.meta.env.VITE_REPLY, sort: JSON.stringify({ _id: -1 }) } }),
    select: response => {
      response.items = response.pages.map(page => page.data.item);
      response.totalPages = response.pages.at(-1).data.pagination.totalPages;
      response.page = response.pages.at(-1).data.pagination.page;
      return response;
    },
    // refetchInterval: 1000
    // 마지막 페이지와 함께 전체 페이지 목록을 받아서 queryFn에 전달할 pageParam 값을 리턴하도록 구현한다.
    // false를 리턴하면 더이상 queryFn이 호출되지 않고 무한 스크롤 종료
    // lastPage: 마지막으로 응답 받은 axios.get() 리턴값(response 객체)
    // allPage: 모든 페이지 배열
    getNextPageParam: (lastPage) => {
      const pagination = lastPage.data.pagination;
      let nextPage = pagination.page < pagination.totalPages ? pagination.page + 1 : false; // 새로 요청해야할 페이지
      return nextPage;
    }
  });

  let list = [];
  let hasNext = false;
  if(data){
    list = _.flatten(data.items).map(item => {
      return <ReplyItem key={ item._id } postUserId={ post.user._id } item={ item } handleDelete={ handleDelete } handleUpdate={ handleUpdate } />;
    });
    hasNext = data.page < data.totalPages;
  }

  // 후기 삭제
  async function handleDelete(reply_id) {
    if(confirm('후기를 삭제하시겠습니까?')){
      await axios.delete(`/posts/${ post._id }/replies/${ reply_id }`);

      // 삭제한 후기 제거
      const newPagesArray = produce(data.pages, draft => draft.forEach(page => {
        _.remove(page.data.item, item => item._id === reply_id);
      })) || [];
  
      // 지정한 queryKey의 캐시된 값을 수정
      queryClient.setQueryData(['posts', post._id, 'replies'], data => ({
        pages: newPagesArray,
        pageParams: data.pageParams,
      }));
    }
  }

  // 후기 수정
  async function handleUpdate(reply_id, formData) {
    if(confirm('후기를 수정하시겠습니까?')){
      const response = await axios.patch(`/posts/${ post._id }/replies/${ reply_id }`, formData);
    
      const newItem = response.data.item;
      // 화면에서 후기 수정
      const newPagesArray = produce(data.pages, draft => draft.forEach(page => {
        const target = _.find(page.data.item, item => item._id === reply_id);
        if(target){
          target.comment = newItem.comment,
          target.updatedAt = newItem.updatedAt
        }
      })) || [];
  
      // 지정한 queryKey의 캐시된 값을 수정
      queryClient.setQueryData(['posts', post._id, 'replies'], data => ({
        pages: newPagesArray,
        pageParams: data.pageParams,
      }));
      return true;
    }else{
      return false;
    }
  }

  return (
    <section className="mb-8">
      <h4 className="mt-8 mb-4 ml-2">댓글 { data?.pages.at(-1).data.pagination.total || 0 }개</h4>
      <ReplyNew />
      <InfiniteScroll pageStart={1} loadMore={ fetchNextPage } hasMore={ !isFetching && hasNext } loader={ <Spinner key="0" /> }>
        { list }
      </InfiniteScroll>
    </section>
  );
}

export default ReplyList;