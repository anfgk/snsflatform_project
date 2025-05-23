import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FormTitle, FormDesc, Pager, Button } from "./login-components";
import styled from "styled-components";
import categoryImg01 from "/img/signup-category01.jpg";
import categoryImg02 from "/img/signup-category02.jpg";
import categoryImg03 from "/img/signup-category03.jpg";
import categoryImg04 from "/img/signup-category04.jpg";
import categoryImg05 from "/img/signup-category05.jpg";
import categoryImg06 from "/img/signup-category06.jpg";
import categoryImg07 from "/img/signup-category07.jpg";
import categoryImg08 from "/img/signup-category08.jpg";
import categoryImg09 from "/img/signup-category09.jpg";
import checkImg from "/img/check-white.svg";

const Wrapper = styled.div`
  height: 680px;
  padding: 25px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: var(--color-light-gray-02);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  border-radius: var(--border-radius-08);
  @media screen and (max-width: 768px) {
    width: 390px;
    min-width: 390px;
    height: auto;
    justify-content: center;
    gap: 20px;
    padding: 0 15px;
    background: var(--color-white);
    box-shadow: none;
    margin-bottom: 60px;
  }
`;
const CategoryUl = styled.ul`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 30px;
  li {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    .img-wrapper {
      width: 114px;
      height: 114px;
      border-radius: var(--border-radius-08);
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: all 0.3s;
      }
    }
    &:hover,
    &:active {
      .img-wrapper {
        img {
          transform: scale(1.04);
        }
      }
    }
    &.checked {
      .img-wrapper {
        position: relative;
        &::before {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 50%;
          height: 50%;
          background: url(${checkImg}) center/contain no-repeat; // 선택된 카테고리 위에 체크 이미지 추가
          z-index: 1;
        }
        img {
          transform: scale(1.04);
          filter: brightness(0.6);
        }
      }
    }
  }
  @media screen and (max-width: 768px) {
    margin-bottom: 0;
    gap: 9px;
  }
`;

// SignupCategory 컴포넌트
const SignupCategory = ({ updateUserData, userData, mobileSize, progress }) => {
  const [selectedCategories, setSelectedCategories] = useState([]); // 선택된 카테고리 상태
  const [searchParams, setSearchParams] = useSearchParams(); // URL의 쿼리 파라미터 사용
  // 카테고리 아이템 데이터
  const categoryItems = [
    { id: 1, src: categoryImg01, title: "반려동물" },
    { id: 2, src: categoryImg02, title: "해외축구" },
    { id: 3, src: categoryImg04, title: "사진" },
    { id: 4, src: categoryImg03, title: "여행" },
    { id: 5, src: categoryImg05, title: "자연" },
    { id: 6, src: categoryImg06, title: "맛집" },
    { id: 7, src: categoryImg07, title: "요리" },
    { id: 8, src: categoryImg08, title: "예능" },
    { id: 9, src: categoryImg09, title: "영화" },
  ];

  // 카테고리 선택 처리 함수
  const handleCategorySelect = (category) => {
    setSelectedCategories((prev) => {
      const isSelected = prev.includes(category); // 이미 선택된 카테고리인 경우 선택 해제
      if (isSelected) {
        return prev.filter((item) => item !== category);
      } else {
        if (prev.length < 3) {
          // 최대 3개까지만 선택 가능
          return [...prev, category];
        }
        return prev;
      }
    });
  };

  // 선택된 카테고리 상태가 변경될 때마다 사용자 데이터 업데이트
  useEffect(() => {
    updateUserData("likeCategory", selectedCategories);
  }, [selectedCategories]);

  // 이전 단계로 돌아가는 함수
  const handlePrevSignupStep = () => {
    searchParams.set("progress", "1"); // 쿼리 파라미터로 진행 상태 업데이트
    setSearchParams(searchParams);
  };
  return (
    // progress 값이 "2"일 때만 표시되도록 설정
    <Wrapper style={{ display: progress === "2" ? "flex" : "none" }}>
      {mobileSize ? null : (
        <FormTitle>회원님을 위한 맞춤 홈피드를 준비할게요</FormTitle>
      )}
      <FormDesc>선택된 3개 분야로 그룹을 추천해 드릴게요</FormDesc>
      <CategoryUl>
        {categoryItems.map((item) => (
          <li
            key={item.id}
            className={selectedCategories.includes(item.title) ? "checked" : ""}
            onClick={() => handleCategorySelect(item.title)} // 카테고리 클릭 시 선택/해제 처리
          >
            <div className="img-wrapper">
              <img src={item.src} alt={item.title} />
            </div>
            <p>{item.title}</p>
          </li>
        ))}
      </CategoryUl>
      <div>
        {mobileSize ? null : (
          <Pager>
            <span></span>
            <span className="active"></span>
          </Pager>
        )}
        <Button onClick={() => setSearchParams({ progress: "1" })}>이전</Button>
      </div>
    </Wrapper>
  );
};

export default SignupCategory;
