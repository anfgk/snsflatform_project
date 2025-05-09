import React, { useState, useRef, useEffect, useContext } from "react";
import styled from "styled-components";
import { DataDispatchContext } from "../../contexts";

const Wrapper = styled.div`
  position: relative;
  display: flex;
  width: 150px;
  align-items: center;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;

  @media (max-width: 768px) {
    width: 150px;
    font-size: 14px;
  }

  .label {
    display: flex;
    justify-content: end;
    width: inherit;
    padding: 5px 25px;
    border: none;
    background: transparent;
    font-size: 16px;
    cursor: pointer;
  }

  .optionList {
    position: absolute;
    top: 40px;
    right: 20px;
    width: fit-content;
    padding: 12px 38px;
    font-size: 14px;
    /* background: #fff; */
    background: ${(props) => props.theme.ContainColor};
    border-radius: 8px;
    box-shadow: 4px 6px 14px ${(props) => props.theme.boxShadow};
    list-style-type: none;
    opacity: 0.2;
    visibility: hidden;
    overflow: hidden;
    transition:
      max-height 0.3s ease,
      opacity 0.1s ease,
      visibility 0.1s;

    @media (max-width: 768px) {
      top: 30px;
      right: 18px;
    }
  }

  // 'active' 클래스가 적용되면 드롭다운 메뉴 표시
  &.active .optionList {
    max-height: 200px;
    opacity: 1;
    visibility: visible;
  }

  .optionItem {
    margin-bottom: 8px;
    border-radius: 8px;
    transition: all 0.1s;
  }
`;

const EditeBox = ({ Title, postId, handleEditBtn }) => {
  // 드롭다운 메뉴 상태 관리 (열림/닫힘)
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { onUpdatePost } = useContext(DataDispatchContext); // Context에서 함수 가져오기

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    // 컴포넌트가 마운트될 때 이벤트 리스너 추가
    document.addEventListener("mousedown", handleClickOutside);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 드롭다운 토글 함수
  const toggleDropdown = () => setIsOpen(!isOpen); // 드롭다운 토글

  // 수정 버튼 클릭 시 처리
  const onEditClick = () => {
    if (postId) {
      console.log(`Editing postId: ${postId}`); // 디버깅 로그

      // 수정할 데이터 객체를 생성 (예: content 업데이트)
      const updatedData = {
        updatedAt: new Date().toISOString(), // 업데이트 시간을 기록
      };
      handleEditBtn(postId); // 수정 버튼 클릭 시 처리
      onUpdatePost(postId, updatedData) // 수정할 데이터 전달
        .then(() => {
          console.log("게시물이 성공적으로 수정되었습니다.");
        })
        .catch((error) => {
          console.error("게시물 수정 중 오류 발생:", error);
        });
    } else {
      console.error("postId가 정의되지 않았습니다.");
    }
  };

  return (
    <Wrapper className={isOpen ? "active" : ""} ref={dropdownRef}>
      <button className="label" onClick={toggleDropdown}>
        {Title || "옵션"} {/* 버튼에 제목이 없으면 기본 "옵션" 텍스트 표시 */}
      </button>
      <ul className="optionList">
        <li className="optionItem" onClick={onEditClick}>
          수정하기 {/* 수정 옵션 */}
        </li>
      </ul>
    </Wrapper>
  );
};

export default EditeBox;
