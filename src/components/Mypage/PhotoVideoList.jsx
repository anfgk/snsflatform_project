import React, { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import PhotoVideoItem from "./PhotoVideoItem";
import { DataStateContext } from "../../contexts";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase";
import ModalCont from "../Modal/ModalCont";

const Wrapper = styled.section`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  width: var(--inner-width-02);
  height: 100%;
  padding: 90px 90px;
  margin: 0 auto;
  gap: 15px;
  @media (max-width: 768px) {
    border: 1px solid #f00;
    width: 100%;
    padding: 100px 24px 60px;
    gap: 20px;
  }
`;

const PhotoVideoList = () => {
  const [userPosts, setUserPosts] = useState([]); // 사용자의 게시물 목록을 저장할 상태
  const [selectedPost, setSelectedPost] = useState(null); // 선택된 게시물을 저장할 상태
  const { currentUserData } = useContext(DataStateContext); // 현재 로그인한 사용자의 데이터를 가져오기 위해 context 사용

  useEffect(() => {
    // 게시물을 가져오는 함수
    const fetchPosts = async () => {
      try {
        if (!currentUserData) return; // currentUserData가 없는 경우에는 함수 실행을 중단
        const postsQuery = query(
          collection(db, "posts"), // Firestore에서 'posts' 컬렉션을 조회
          orderBy("createdAt", "desc") // 게시물의 생성일 기준으로 내림차순 정렬
        );
        const querySnapshot = await getDocs(postsQuery); // 쿼리 실행
        const postData = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            userId: doc.data().userId,
            ...doc.data(), // 게시물 데이터 확장 (id, userId 포함)
          }))
          .filter((post) => post.userId === currentUserData.userId); // 현재 사용자 게시물만 필터링
        setUserPosts(postData); // 상태에 필터링된 게시물 목록 저장
      } catch (err) {
        console.error("Post 데이터를 가져오는 중 오류 발생:", err); // 데이터 가져오기 중 에러 발생 시 처리
      }
    };
    fetchPosts(); // 게시물 데이터 fetch 실행
  }, [currentUserData]); // currentUserData가 변경될 때마다 fetchPosts 실행

  // 모달을 열 때 호출되는 함수
  const openModal = (post) => {
    setSelectedPost(post); // 선택된 게시물 저장
  };

  // 모달을 닫을 때 호출되는 함수
  const closeModal = () => {
    setSelectedPost(null); // 선택된 게시물 초기화 (모달 닫기)
  };

  return (
    <>
      <Wrapper>
        {userPosts
          .filter((post) => post.image) // 이미지를 가진 포스트만 필터링
          .map((post) => (
            <PhotoVideoItem
              key={post.id}
              postId={post.id}
              userId={post.userId}
              imageSrc={post.image}
              contentDesc={post.content}
              createdAt={post.createdAt}
              ModalOpen={() => openModal(post)} // 포스트 객체를 전달
            />
          ))}
      </Wrapper>
      {selectedPost && (
        <ModalCont
          post={selectedPost} // 선택된 포스트 전체를 전달
          onClose={closeModal} // 모달 닫기 함수 전달
        />
      )}
    </>
  );
};

export default PhotoVideoList;
