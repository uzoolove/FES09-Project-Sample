import useCustomAxios from "@hooks/useCustomAxios.mjs";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import Submit from "@components/Submit";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function ReplyNew(){
  const { _id } = useParams();
  const axios = useCustomAxios();

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const queryClient = useQueryClient();
  const addReply = useMutation({
    mutationFn: (formData) => axios.post(`/posts/${ _id }/replies`, formData),
    onSuccess(){ // queryFn이 성공을(2xx 응답 상태 코드) 응답 받을 경우 호출되는 콜백 합수
      // 기존 캐시 무효화
      queryClient.invalidateQueries(['posts', _id, 'replies']);
      
      reset();
    }
  });

  const onSubmit = formData => {
    // await axios.post(`/posts/${ _id }/replies`, formData);
    // fetchList();
    // reset();
    addReply.mutate(formData);
  };

  return (
    <div className="p-4 mb-6 bg-gray-100 dark:bg-gray-600 shadow-md rounded-lg">
      <h4 className="mb-4">새로운 댓글을 추가하세요.</h4>
      <form onSubmit={ handleSubmit(onSubmit) } >
        <div className="mb-4">
          <textarea 
            { ...register('comment', {
              required: '내용을 입력하세요',
              minLength: {
                value: 2,
                message: '2글자 이상 입력하세요'
              }
            }) } 
            rows="3"
            className="block p-2 w-full text-sm border rounded-lg border-gray-300 bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            placeholder="내용을 입력하세요." />

          { errors.comment && <p className="ml-2 mt-1 text-sm text-red-500">{ errors.comment.message }</p> }
        </div>
        <Submit size="sm">댓글 등록</Submit>
      </form>
    </div>
  );
}

export default ReplyNew;