import qs from 'query-string';
import useCustomAxios from '@hooks/useCustomAxios.mjs';
import { memberState } from '@recoil/user/atoms.mjs';
import { useSetRecoilState } from 'recoil';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import Spinner from '@components/Spinner';

function KaKaoLogin() {
  const [searchParams, setSearchParams] = useSearchParams();

  const authCode = searchParams.get('code');
  const state = searchParams.get('state');
  const parsedState = qs.parse(state);

  // recoil setter 반환
  const setUser = useSetRecoilState(memberState);
  const axios = useCustomAxios();
  const navigate = useNavigate();
  
  useEffect(() => {
    kakaoLogin();
  }, []);

  const kakaoLogin = async () => {
    try {
      const res = await axios.post('/users/login/kakao', {
        code: authCode,
        // user: { // 카카오에서 제공하는 정보 이외에 추가할 회원 정보
        //   type: 'seller',
        //   phone: '010-1234-5678',
        // },
      });
      // 사용자 정보를 recoil에 저장
      setUser({
        _id: res.data.item._id,
        name: res.data.item.name,
        profile: res.data.item.profileImage,
        token: res.data.item.token,
        loginType: res.data.item.loginType,
        kakaoToken: res.data.item.kakaoToken,
      });
      navigate(parsedState.from ? parsedState?.from : '/', {
        replace: true, // 뒤로가기 버튼 눌렀을 때 현재 페이지 유지 안함
      });
    } catch (err) {
      console.error(err);
      // AxiosError(네트워크 에러: response가 없음, 서버의 4xx, 5xx 응답 상태 코드를 받았을 때-response 있음)
      if (err.response?.data.message) {
        alert(err.response?.data.message);
      }
    }
  };
  
  return (
    <div className="min-w-80 flex-grow flex items-center justify-center">
      <Spinner />
    </div>
  );
}

export default KaKaoLogin;
