import { addDoc, collection, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import styled from 'styled-components';
import { auth, db, storage } from '../firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TextArea = styled.textarea`
  border: 2px solid white;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: black;
  width: 100%;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  &::placeholder {
    font-size: 16px;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;

const AttachFileButton = styled.label`
  padding: 10px 0px;
  color: #1d9bf0;
  text-align: center;
  border-radius: 20px;
  border: 1px solid #1d9bf0;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

const AttachFileInput = styled.input`
  display: none;
`;

const SubmitBtn = styled.input`
  background-color: #1d9bf0;
  color: white;
  border: none;
  padding: 10px 0px;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`;

export default function PostTweetForm() {
  // 1mb를 나타내는 상수
  const FILE_SIZE_MAX_LIMIT = 1 * 1024 * 1024;
  const [isLoading, setLoading] = useState(false);
  const [tweet, setTweet] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweet(e.target.value);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      // 파일 크기가 1mb를 넘으면 안됨
      if (files[0].size > FILE_SIZE_MAX_LIMIT) {
        alert('The maximum capacity that can be uploaded is 1mb');
        return;
      }
      setFile(files[0]);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 현재 로그인한 유저정보
    const user = auth.currentUser;
    // 유저가 로그인이 아니거나, 로딩중이거나, 트윗이 비어있거나, 트윗에 길이가 180자(maxLength)를 넘으면 리턴;
    if (!user || isLoading || tweet === '' || tweet.length > 180) return;

    try {
      setLoading(true);
      // db(firebase.ts참조)에서(firebase 데이터베이스) tweets이라는 컬렉션에다가
      // 데이터를 저장
      const doc = await addDoc(collection(db, 'tweets'), {
        // textarea 필드의 value값 (onChange함수로 저장한 e.current.value)
        tweet,
        // 게시 시간
        createdAt: Date.now(),
        // 유저이름은 username에 저장, displayName이 존재하지 않으면 Anonymous(익명)라고 설정
        username: user.displayName || 'Anonymous',
        // 트윗을 삭제할 권한을 줄때 id를 매칭하기 위해 설정 -> Tweet.tsx
        userId: user.uid,
      });
      // 파일 첨부가 필수는 아니기에 파일 첨부 여부 확인
      if (file) {
        // 여기서 ref는 firebase의 storage참조임
        // 첨부파일(이미지) tweets 폴더(컬렉션)에 해당 유저의 폴더안에 저장하기
        // 이미지를 빠르게 찾기 위해서는 이미지의 이름은 이미지가 업로드된 트윗의 id인게 좋다
        // 그래야 트윗이 삭제 되었을 때도, 해당 트윗의 이미지를 빠르게 삭제할 수 있다.
        const locationRef = ref(storage, `tweets/${user.uid}/${doc.id}`);
        const result = await uploadBytes(locationRef, file);
        const url = await getDownloadURL(result.ref);
        await updateDoc(doc, {
          photo: url,
        });
      }
      setTweet('');
      setFile(null);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      <TextArea
        rows={5}
        maxLength={180}
        onChange={onChange}
        value={tweet}
        placeholder='What is happening?!'
        required
      />
      <AttachFileButton htmlFor='file'>
        {file ? 'Photo added ✅' : 'Add photo'}
      </AttachFileButton>
      <AttachFileInput
        onChange={onFileChange}
        type='file'
        id='file'
        accept='image/*'
      />
      <SubmitBtn
        type='submit'
        value={isLoading ? 'Posting...' : 'Post Tweet'}
      />
    </Form>
  );
}
