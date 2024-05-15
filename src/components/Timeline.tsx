import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { db } from '../firebase';
import Tweet from './Tweet';
import { Unsubscribe } from 'firebase/auth';

// firebase database 에 저장시킨 항목들의 타입 인터페이스
// id는 데이터에 저장되있는게 아니라 tweets폴더에 있다. ex) rASGpC5UiT3MOlXxu5mV
export interface ITweet {
  id: string;
  photo?: string;
  tweet: string;
  userId: string;
  username: string;
  createdAt: number;
}

const Wrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
  overflow-y: scroll;
`;

export default function Timeline() {
  const [tweets, setTweets] = useState<ITweet[]>([]);

  useEffect(() => {
    let unsubscribe : Unsubscribe | null = null;
    const fetchTweets = async () => {
      // query는 파이어베이스에서 불러온 쿼리
      // 쿼리는 데이터베이스에 정보를 달라고 요청하는것
      // 내가 만든 firebase db(database)에 있는 'tweets'컬렉션(디렉토리) 정보를 달라고 요청
      const tweetsQuery = query(
        collection(db, 'tweets'),
        // orderBy -> 'createAt' 항목을 기준으로 정렬, 'desc' 내림차순으로
        orderBy('createdAt', 'desc'),
        // 데이터가 너무 많을 수 있으니 페이지네이션 기능 사용
        // limit -> firebase 기능 (불러오는 데이터 양 조절)
        limit(25)
      );
      // const snapshot = await getDocs(tweetsQuery);
      // // 데이터를 추출하는 부분 -> 중요하니 잘 확인하고 내 프로젝트에 적용 ex) 외교부 api에서 국가이름 가져오기
      // const tweets = snapshot.docs.map((doc) => {
      //   const { tweet, createdAt, userId, username, photo } = doc.data();
      //   return {
      //     tweet,
      //     createdAt,
      //     userId,
      //     username,
      //     photo,
      //     id: doc.id,
      //   };
      // });
      // 추출한 tweets를 setTweets 상태에 저장
      // setTweets(tweets);

      unsubscribe = await onSnapshot(tweetsQuery, (snapshot) => {
        const tweets = snapshot.docs.map((doc) => {
          const { tweet, createdAt, userId, username, photo } = doc.data();
          return {
            tweet,
            createdAt,
            userId,
            username,
            photo,
            id: doc.id,
          };
        });
        setTweets(tweets);
      });
    };
    fetchTweets();

    // useEffect 훅은 더 이상 타임라인 컴포넌트가 사용되지 않을 때 이 함수를 호출
    // 유저가 로그아웃했거나, 다른 화면에 있을 때 굳이 이벤트를 들을 필요가 없기 때문!
    // useEffect의 cleanUp 함수임!
    return () => {
      unsubscribe && unsubscribe();
    }
  }, []);

  return (
    <Wrapper>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
    </Wrapper>
  );
}
