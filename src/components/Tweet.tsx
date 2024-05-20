import styled from "styled-components";
import { ITweet } from "./Timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useState } from "react";
import EditTweetForm from './edit-tweet-form';

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgb(255 255 255 / 0.5);
  border-radius: 15px;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  &:last-child:not(:first-child) {
    align-items: center;
  }
`;

const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
  line-height: 1.4;
`;

const BtnWrap = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const DeleteButton = styled.button`
  padding: 5px 10px;
  background-color: #666;
  border: 0;
  border-radius: 5px;
  font-weight: 600;
  font-size: 12px;
  color: white;
  text-transform: uppercase;
  cursor: pointer;
`;

const EditButton = styled.button`
  padding: 5px 10px;
  background-color: #1d9bf0;
  border: 0;
  border-radius: 5px;
  font-weight: 600;
  font-size: 12px;
  color: white;
  text-transform: uppercase;
  cursor: pointer;
`;

export default function Tweet({ userId, username, photo, tweet, id }: ITweet) {
  const [isEditing, setIsEditing] = useState(false);
  // user 정보를 불러와서 user.uid가 Timeline.tsx에서 보낸 userId와 같으면 삭제버튼 보이기
  const user = auth.currentUser;
  const onDelete = async () => {
    // 삭제하시겠습니까?를 컨핌창으로 확인하고 아니면 리턴, 맞으면 아래에 해당 아이디에 맞는 
    // 트윗 찾은후 삭제하는 로직 실행
    const ok = confirm("Are you sure you want to delete this tweet?");
    if (!ok || user?.uid !== userId) return;
    try {
      // 문서를 삭제하는데 doc함수를 이용해서 db에 있는 tweets컬렉션(디렉토리)에서 id를 찾아서 삭제한다.
      await deleteDoc(doc(db, "tweets", id));
      // 만약 사진도 있다면 사진도 삭제하는 로직
      if (photo) {
        const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (e) {
      console.log(e);
    } finally {
      // 
    }
  };

  const onEdit = () => setIsEditing((prev) => !prev);

  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        {isEditing ? (
          <EditTweetForm
            tweet={tweet}
            photo={photo}
            id={id}
            setIsEditing={onEdit}
          />
        ) : (
          <Payload>{tweet}</Payload>
        )}
        {user?.uid === userId ? (
          <BtnWrap>
            <DeleteButton onClick={onDelete}>삭제</DeleteButton>
            <EditButton onClick={onEdit}>
              {isEditing ? "취소" : "수정"}
            </EditButton>
          </BtnWrap>
        ) : null}
      </Column>
      {photo ? (
        <Column>
          <Photo src={photo} />
        </Column>
      ) : null}
    </Wrapper>
  );
}