import { Navigate } from 'react-router-dom';
import { auth } from '../firebase';

// App컴포넌트에 라우트에서 감싼 children (Layout (Home, Profile))이
// 이 ProtectedRoute에 들어와서 유저 정보를 확인하고
export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  // firebase에 유저 정보 요청 (로그인 여부)
  // 정보가 있으면 정보 리턴, 없으면 null 리턴
  const user = auth.currentUser;

  // 정보가 없으면 (null이면) 로그인 페이지로 이동
  if (user === null) {
    return <Navigate to='/login' />;
  }
  return children;
}
