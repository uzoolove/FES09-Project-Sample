import Button from '@components/Button';
import ReplyEdit from '@pages/board/ReplyEdit';
import { memberState } from '@recoil/user/atoms.mjs';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';

ReplyItem.propTypes = {
  item: PropTypes.object.isRequired,
  postUserId: PropTypes.number,
  handleDelete: PropTypes.func,
  handleUpdate: PropTypes.func,
};

function ReplyItem({ item, postUserId, handleDelete, handleUpdate }) {
  const user = useRecoilValue(memberState);
  const [editMode, setEditMode] = useState(false);

  // 댓글 수정 후 수정모드 off
  const handleUpdateAndSetEditMode = async (formData) => {
    if (await handleUpdate(item._id, formData)) {
      setEditMode(false);
    }
  };

  return (
    <div className="shadow-md rounded-sm p-4 mb-4 bg-gray-50 dark:bg-gray-600">
      <div className="flex justify-between items-center mb-2">
        {item.user.profile ? (
          <img className="w-8 mr-2 rounded-full" src={`${import.meta.env.VITE_API_SERVER}/files/${import.meta.env.VITE_CLIENT_ID}/${item.user.profile}`} alt="" />
        ) : (
          <img className="w-8 mr-2" src={`/vite.svg`} alt="기본 프로필 사진" />
        )}
        <a className="text-blue-500" href="">
          {item._id} {item.user.name}
        </a>
        {postUserId === item.user._id && <span className="text-sm ml-2 font-semibold text-gray-400">작성자</span>}
        <time className="ml-auto text-gray-500 dark:text-gray-400" dateTime={item.updatedAt}>
          {item.updatedAt}
        </time>
      </div>
      <div className="flex items-center">
        {editMode ? (
          <ReplyEdit comment={item.comment} setEditMode={setEditMode} handleUpdate={handleUpdateAndSetEditMode} />
        ) : (
          <>
            <pre className="font-custom whitespace-pre-wrap">{item.comment}</pre>
            {user?._id === item.user._id && (
              <div className="ml-auto flex whitespace-nowrap">
                <Button bgColor="gray" size="sm" onClick={() => setEditMode(true)}>
                  수정
                </Button>
                <Button bgColor="red" size="sm" onClick={() => handleDelete(item._id)}>
                  삭제
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ReplyItem;
