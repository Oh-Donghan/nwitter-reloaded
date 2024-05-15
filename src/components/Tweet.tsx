import styled from 'styled-components';
import { ITweet } from './Timeline';
import { auth, db, storage } from '../firebase';
import { deleteDoc, doc } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 5fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;

const Column = styled.div``;

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
`;

const DeleteButton = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

export default function Tweet({ username, photo, tweet, userId, id }: ITweet) {
  // user 정보를 불러와서 user.uid가 Timelime.tsx에서 보낸 userId와 같으면 삭제버튼 보이기
  const user = auth.currentUser;
  const onDelete = async () => {
    // 삭제하시겠습니까?를 컨핌창으로 확인하고 아니면 리턴, 맞으면 아래에 해당 아이디에 맞는 
    // 트윗 찾은후 삭제하는 로직 실행
    const ok = confirm('Are you sure you want to delete this tweets?');
    if (!ok || user?.uid !== userId) return;
    try {
      // 문서를 삭제하는데 doc함수를 이용해서 db에 있는 tweets컬렉션(디렉토리)에서 id를 찾아서 삭제한다.
      await deleteDoc(doc(db, 'tweets', id));
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

  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        <Payload>{tweet}</Payload>
        {user?.uid === userId ? (
          <DeleteButton onClick={onDelete}>Delete</DeleteButton>
        ) : null}
      </Column>
      <Column>{photo ? <Photo src={photo} /> : null}</Column>
    </Wrapper>
  );
}
