import Button from '@components/Button';
import Submit from '@components/Submit';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';

ReplyEdit.propTypes = {
  comment: PropTypes.string,
  setEditMode: PropTypes.func,
  handleUpdate: PropTypes.func,
};

function ReplyEdit({ comment, setEditMode, handleUpdate }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    values: { comment },
  });

  return (
    <form className="w-full" onSubmit={handleSubmit(handleUpdate)}>
      <div className="mb-4">
        <textarea
          {...register('comment', {
            required: '내용을 입력하세요',
            minLength: {
              value: 2,
              message: '2글자 이상 입력하세요',
            },
          })}
          rows="3"
          className="block p-2 w-full text-sm border rounded-lg border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          placeholder="내용을 입력하세요."
        />

        {errors.comment && <p className="ml-2 mt-1 text-sm text-red-500">{errors.comment.message}</p>}
      </div>
      <div className="ml-auto flex whitespace-nowrap">
        <Submit bgColor="blue" size="sm" className="ml-auto">
          수정
        </Submit>
        <Button bgColor="red" size="sm" onClick={() => setEditMode(false)}>
          취소
        </Button>
      </div>
    </form>
  );
}

export default ReplyEdit;
