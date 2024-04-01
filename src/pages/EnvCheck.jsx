function EnvCheck() {
  return (
    <div>
      <h1>환경변수 확인</h1>

      <div>
        <h2>기본 환경 변수</h2>
        <ul>
          <li>MODE: {import.meta.env.MODE}</li>
          <li>BASE_URL: {import.meta.env.BASE_URL}</li>
        </ul>
      </div>

      <div>
        <h2>사용자 정의 환경 변수</h2>
        <ul>
          <li>VITE_API_SERVER: {import.meta.env.VITE_API_SERVER}</li>
          <li>VITE_POST_LIMIT: {import.meta.env.VITE_POST_LIMIT}</li>
          <li>SOME_KEY: {import.meta.env.SOME_KEY}</li>
          <li>VITE_SOME_KEY: {import.meta.env.VITE_SOME_KEY}</li>
        </ul>
      </div>
    </div>
  );
}

export default EnvCheck;
