import styled from "styled-components";
import { MdOutlineShoppingBag } from "react-icons/md";
import { SubTitle_16_b } from "../../styles/GlobalStyles.styles";
import { IoClose } from "react-icons/io5";
import React, { useContext, useEffect, useRef, useState } from "react";
import { DataStateContext } from "../../contexts";
import { motion } from "framer-motion";

const Wrapper = styled(motion.div)`
  z-index: 3;
  position: absolute;
  top: 100px;
  right: 20px;
  width: 382px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: ${(props) => props.theme.ContainColor};
  padding: 28px 20px;
  border-radius: var(--border-radius-30);
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
  max-height: 80vh;
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  @media screen and (max-width: 1050px) {
    right: 10px;
  }
  @media screen and (max-width: 768px) {
    width: 330px;
    top: 70px;
  }
`;
const Title = styled.div`
  color: ${(props) => props.theme.textColor};
  display: flex;
  justify-content: space-between;
  span {
    font-size: 20px;
    cursor: pointer;
    transition: all 0.3s;
    &:hover {
      opacity: 0.5;
    }
  }
`;

const Box = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  h3 {
    font-size: var(--font-size-title-04);
  }
`;
const WalletItem = styled.div`
  color: ${(props) => props.theme.textColor};
  display: flex;
  align-items: center;
  gap: 15px;
  img,
  div {
    cursor: pointer;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: var(--color-light-gray-01);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  div {
    color: #777;
    font-size: 30px;
    padding-bottom: 3px;
    text-align: center;
  }
`;

const RecentProductItem = styled.div`
  padding: 0 10px;
  background: ${(props) => props.theme.cardColor};
  width: 347px;
  height: 90px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 10px;
  img {
    width: 60px;
    height: 60px;
    object-fit: cover;
    background: #ddd;
    border-radius: 10px;
  }
  .icon {
    min-width: 45px;
    height: 45px;
    display: flex;
    justify-content: center;
    background-color: var(--color-white);
    border-radius: 50%;
    align-items: center;
    cursor: pointer;
    svg {
      font-size: 30px;
    }
  }
  @media screen and (max-width: 768px) {
    width: 100%;
  }
`;
const ProductItemInfo = styled.div`
  width: 180px;
  display: flex;
  flex-direction: column;
  h4 {
    ${SubTitle_16_b}
    color: ${(props) => props.theme.textColor};
  }
  div {
    font-weight: bold;
    display: flex;
    gap: 10px;
    span:nth-child(1) {
      color: red;
    }
    span:nth-child(2) {
      color: ${(props) => props.theme.subTextColor};
    }
  }
`;

// 사이드바 지갑 컴포넌트
const SideBarWallet = ({ onClick, closeModal }) => {
  const [randomProducts, setRandomProducts] = useState([]); // 랜덤 상품 상태
  const data = useContext(DataStateContext); // 데이터 컨텍스트
  const { currentUserData } = useContext(DataStateContext); // 현재 사용자 데이터
  const { mockData } = useContext(DataStateContext); // 모의 데이터
  const liveCommerce = mockData.liveCommerce; // 라이브 커머스 상품 데이터

  const points = data?.points || 0; // 포인트 값, 없으면 기본값 0

  const closeRef = useRef(null); // 클릭 외부 감지용 참조
  const handleClickOutside = (event) => {
    if (closeRef.current && !closeRef.current.contains(event.target)) {
      closeModal(); // 모달을 닫는 함수 호출
    }
  };

  // 외부 클릭 이벤트 처리
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // 라이브 커머스 상품 데이터를 랜덤으로 선택
  useEffect(() => {
    if (liveCommerce.length > 0) {
      // 모든 liveItem의 products 배열을 하나로 합침
      const allProducts = liveCommerce.flatMap((liveItem) => liveItem.products);

      // 랜덤하게 3개의 상품 선택
      const selectedProducts = allProducts
        .sort(() => 0.5 - Math.random()) // 랜덤으로 섞기
        .slice(0, 3); // 상위 3개만 선택

      setRandomProducts(selectedProducts); // 랜덤 상품 상태로 설정
    }
  }, [liveCommerce]);

  if (!data) {
    return <div>로딩 중...</div>; // 데이터가 로드되지 않았을 때 로딩 상태를 표시
  }

  return (
    <Wrapper
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      ref={closeRef}
      onClick={(e) => e.stopPropagation()} // 클릭 이벤트 전파 방지
    >
      <Title>
        <h3>Wallett +</h3>
        <span>
          <IoClose onClick={onClick} /> {/* 닫기 버튼 클릭 시 onClick 호출 */}
        </span>
      </Title>
      <Box>
        <WalletItem>
          <img src="https://www.pngplay.com/wp-content/uploads/5/Alphabet-P-PNG-Pic-Background.png" />
          <span>{currentUserData.wallet.point}p </span>
          {/* 사용자 포인트 표시 */}
        </WalletItem>
        <WalletItem onClick={() => alert("서비스 준비중 입니다")}>
          // 아이콘 클릭 시 서비스 준비 중 알림
          <div>+</div>
          <span>지갑 추가</span>
        </WalletItem>
      </Box>
      <Title>
        <h3>추천 상품</h3>
      </Title>
      <Box>
        {randomProducts.length > 0 ? (
          // randomProducts 배열에 상품이 있을 경우, 각각의 상품을 표시
          randomProducts.map((product) => (
            <RecentProductItem key={product.id}>
              <img src={product.productImage} alt={product.name} />
              <ProductItemInfo>
                <h4>{product.name}</h4>
                <div>
                  <span>{product.discountRate}</span>
                  <span>{product.discountPrice}</span>
                </div>
              </ProductItemInfo>
              <div
                className="icon"
                onClick={() => alert("서비스 준비중 입니다.")}
              >
                <MdOutlineShoppingBag />
              </div>
            </RecentProductItem>
          ))
        ) : (
          // randomProducts 배열이 비어있을 경우, "상품이 없습니다" 메시지 표시
          <div style={{ color: "${(props) => props.theme.textColor}" }}>
            상품이 없습니다.
          </div>
        )}
      </Box>
    </Wrapper>
  );
};

export default React.memo(SideBarWallet);
