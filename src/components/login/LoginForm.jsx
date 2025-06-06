import React, { useState } from "react";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Form, InputWrapperColumn, Input, FormTitle } from "./login-components";
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth"; // Firebase 로그인 및 비밀번호 재설정 함수
import { SubDescription_16_n } from "../../styles/GlobalStyles.styles";

const Error = styled.p`
  text-align: center;
  color: var(--color-error);
  font-weight: 500;
`;
const FindAccount = styled.div`
  padding-bottom: 10px;
  text-align: center;
  ${SubDescription_16_n}
  color: var(--color-gray-01);
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const LoginForm = ({ mobileSize }) => {
  // 로딩 상태: 로그인 처리 중에는 중복 요청 방지를 위해 true
  const [isLoading, setIsLoading] = useState(false);

  // 에러 상태: 로그인 실패 시 사용자에게 보여줄 메시지
  const [error, setError] = useState("");

  // 폼 상태: 입력된 이메일과 비밀번호 저장
  const [email, setEmailTel] = useState("");
  const [password, setPassword] = useState("");

  // 페이지 이동을 위한 훅
  const navigate = useNavigate();

  // input 값 변경 시 상태 업데이트
  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") setEmailTel(value);
    if (name === "password") setPassword(value);
  };

  // 비밀번호 재설정 함수
  const handlePasswordReset = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert("비밀번호 재설정 링크가 이메일로 전송되었습니다.");
    } catch (error) {
      console.error("비밀번호 재설정 중 오류 발생:", error);
    }
  };

  // 로그인 제출 처리
  const onSubmit = async (e) => {
    e.preventDefault();

    // 유효성 검사
    if (isLoading || email === "" || password === "") return;

    try {
      setIsLoading(true); // 중복 요청 방지
      await signInWithEmailAndPassword(auth, email, password); // Firebase 로그인
      navigate("/"); // 로그인 성공 후 홈으로 이동
    } catch (e) {
      // 에러 코드에 따라 사용자 친화적 메시지 설정
      let errorCode;
      switch (e.code) {
        case "auth/user-not-found":
          errorCode = "존재하지 않는 계정입니다.";
          break;
        case "auth/wrong-password":
          errorCode = "잘못된 비밀번호입니다.";
          break;
        case "auth/too-many-requests":
          errorCode = "로그인 시도가 너무 많습니다. 나중에 다시 시도해주세요.";
          break;
        case "auth/invalid-email":
          errorCode = "유효하지 않은 이메일 주소입니다.";
          break;
        default:
          errorCode = "로그인 중 오류가 발생했습니다.";
      }
      setError(errorCode);
    } finally {
      setIsLoading(false); // 요청 완료 후 로딩 상태 해제
    }
  };

  return (
    <Form onSubmit={onSubmit} height={280}>
      {mobileSize ? null : <FormTitle>계정으로 로그인</FormTitle>}
      <InputWrapperColumn>
        <Input
          name="email"
          type="email"
          required
          placeholder="이메일 또는 휴대폰 번호"
          width={430}
          onChange={onChange}
          value={email}
        />
        <Input
          name="password"
          type="password"
          required
          placeholder="비밀번호"
          width={430}
          onChange={onChange}
          value={password}
        />
      </InputWrapperColumn>
      <Input name="submit" type="submit" required width={430} value="로그인" />
      {error !== "" ? <Error>{error}</Error> : null}
      <FindAccount onClick={handlePasswordReset}>
        아이디, 비밀번호를 잊으셨나요?
      </FindAccount>
    </Form>
  );
};

export default LoginForm;
