import Button from "@components/Button";
import Pagination from "@components/Pagination";
import Search from "@components/Search";
import useCustomAxios from "@hooks/useCustomAxios.mjs";
import BoardListItem from "@pages/board/BoardListItem";
import { memberState } from "@recoil/user/atoms.mjs";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useRecoilValue } from "recoil";

// import { useEffect, useState } from "react";

function BoardList(){
  const axios = useCustomAxios();
  // /posts?page=3
  const [searchParams, setSearchParams] = useSearchParams();

  const page = searchParams.get('page');

  const { isLoading, data, error, refetch } = useQuery({
    queryKey: ['posts', page],
    queryFn: () => axios.get('/posts', { params: { page, limit: import.meta.env.VITE_POST_LIMIT, keyword: searchParams.get('keyword') } }),
    select: response => response.data,
    // staleTime: 1000*100, // 쿼리 실행 후 캐시가 유지되는 시간(기본, 0)
    suspense: true,
  });

  useEffect(() => {
    refetch();
  }, [searchParams.toString()]);

  // 검색 요청시 주소의 query string 수정
  const handleSearch = (keyword) => {
    searchParams.set('keyword', keyword);
    searchParams.set('page', 1);
    setSearchParams(searchParams);
  };

  const user = useRecoilValue(memberState);
  const navigate = useNavigate();
  const handleNewPost = () => {
    if(!user){
      const gotoLogin = confirm('로그인 후 이용 가능합니다.\n로그인 페이지로 이동하시겠습니까?');
      gotoLogin && navigate('/users/login');
    }else{
      navigate(`/boards/new`);
    }
  }

  const itemList = data?.item?.map(item => <BoardListItem key={ item._id } item={ item } />);

  return (
    <div className="min-w-80 p-4">
      <div className="text-center py-4">
        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200">게시물 목록 조회</h2>
      </div>
      <div className="flex justify-end items-center">
        <Search onClick={ handleSearch } />
        <Button onClick={ handleNewPost }>글쓰기</Button>
      </div>
      <section className="p-4">
        <table className="border-collapse w-full table-fixed">
          <colgroup>
            <col className="w-[10%] sm:w-[10%]" />
            <col className="w-[60%] sm:w-[30%]" />
            <col className="w-[30%] sm:w-[15%]" />
            <col className="w-0 sm:w-[10%]" />
            <col className="w-0 sm:w-[10%]" />
            <col className="w-0 sm:w-[25%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-solid border-gray-200">
              <th className="p-2 whitespace-nowrap">번호</th>
              <th className="p-2 whitespace-nowrap">제목</th>
              <th className="p-2 whitespace-nowrap">글쓴이</th>
              <th className="p-2 whitespace-nowrap hidden sm:table-cell">조회수</th>
              <th className="p-2 whitespace-nowrap hidden sm:table-cell">댓글수</th>
              <th className="p-2 whitespace-nowrap hidden sm:table-cell">작성일</th>
            </tr>
          </thead>
          <tbody>
            { isLoading && (
              <tr><td colSpan="5">로딩중...</td></tr>
            ) }
            { error && (
              <tr><td colSpan="5">{ error.message }</td></tr>
            ) }
            { itemList }

          </tbody>
        </table>
        <hr/>

        <Pagination totalPage={ data?.pagination.totalPages } current={ data?.pagination.page } />
      </section>
    </div>
  );
}

export default BoardList;