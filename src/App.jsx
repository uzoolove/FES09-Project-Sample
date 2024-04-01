import { RouterProvider } from "react-router-dom";
import router from "@/routes";
import { RecoilRoot } from "recoil";
import useThemeStore from "@zustand/themeStore.mjs";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactCsspin } from "react-csspin";
import 'react-csspin/dist/style.css';
import { Suspense } from "react";

// react-query 사용
const queryClient = new QueryClient();

function App(){

  const { isDarkMode } = useThemeStore();

  if(isDarkMode){
    document.documentElement.classList.add('dark');
  }else{
    document.documentElement.classList.remove('dark');
  }

  return (
    <QueryClientProvider client={ queryClient }>
      <RecoilRoot>
        <Suspense fallback={<ReactCsspin />}>
          <RouterProvider router={ router } />
        </Suspense>
      </RecoilRoot>
      <ReactQueryDevtools initialIsOpen={ false } />
    </QueryClientProvider>    
  );
}

export default App;