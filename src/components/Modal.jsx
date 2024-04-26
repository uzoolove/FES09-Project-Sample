// Modal.js
import React from 'react';
import useModalStore from '@zustand/modalStore.mjs';
import Button from '@components/Button';

const Modal = () => {
  const { title, content, callbackButton } = useModalStore.getState();
  const isOpen = useModalStore((state) => state.isOpen);
  const closeModal = useModalStore((state) => state.closeModal);

  const buttons = Object.keys(callbackButton).map((buttonName, index) => (
    <Button key={ index } onClick={ () => { closeModal(); callbackButton[buttonName] && callbackButton[buttonName]() }}>{ buttonName }</Button>
  ));

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-8 max-w-md min-w-md">
            <span className="absolute top-0 right-0 m-4 cursor-pointer" onClick={ () => closeModal() }>
              &times;
            </span>
            <h2 className="text-xl font-bold mb-4">{ title }</h2>
            <p className="overflow-wrap break-word min-w-72 space-x-4" dangerouslySetInnerHTML={{ __html: content }} />
            <div className="flex justify-end mt-8">
              { buttons }
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
