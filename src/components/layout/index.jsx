import Modal from '@components/Modal';
import Footer from '@components/layout/Footer';
import Header from '@components/layout/Header';
import useModalStore from '@zustand/modalStore.mjs';
import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

function Layout() {
  const location = useLocation();
  const closeModal = useModalStore((state) => state.closeModal);

  useEffect(() => {
    closeModal();
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Outlet />
      <Footer />
      <Modal />
    </div>
  );
}

export default Layout;
