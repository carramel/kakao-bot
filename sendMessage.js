import axios from "axios";

const REST_API_KEY = process.env.KAKAO_REST_API_KEY;
const REFRESH_TOKEN = process.env.KAKAO_REFRESH_TOKEN;

async function refreshAccessToken() {
  const res = await axios.post(
    "https://kauth.kakao.com/oauth/token",
    null,
    {
      params: {
        grant_type: "refresh_token",
        client_id: REST_API_KEY,
        refresh_token: REFRESH_TOKEN
      }
    }
  );

  return res.data.access_token;
}

async function sendMessage(accessToken) {
  console.error('시작은했으요');
  // 1. 생일 데이터 파일(birthdays.json) 읽기
  // 파일 형식: [{"name": "홍길동", "birthday": "05-22"}, ...]
  const birthdays = JSON.parse(fs.readFileSync("./birthdays.json", "utf-8"));
  const params = new URLSearchParams();

  console.error('생일자 가져왔으요');

  // 2. 오늘 날짜 (MM-DD 형식) 가져오기
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const todayStr = `${month}-${day}`;

  // 3. 오늘 생일인 사람들 필터링
  const todayBirthdays = birthdays
  .filter(person => person.birthday === todayStr)
  .map(person => person.name);

   console.error('여까진댔으요');

  // 4. 메시지 텍스트 구성
  let messageText = "";
  if (todayBirthdays.length > 0) {
    const names = todayBirthdays.join(", ");
    messageText = `🎂 오늘의 주인공은~ ${names}! 생일을 축하합니다! 🎉`;
    } else {
    // 생일자가 없을 경우의 기본 메시지 (원하는 대로 수정 가능)
    messageText = "오늘은 생일자가 없습니다";
    }

  params.append(
    "template_object",
    JSON.stringify({
      object_type: "text",
      text: messageText,
      link: {
        web_url: "https://example.com"
      }
    })
  );

  await axios.post(
    "https://kapi.kakao.com/v2/api/talk/memo/default/send",
    params,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }
  );

  console.log("메시지 전송 완료!");
}

async function main() {
  try {
    const token = await refreshAccessToken();
    await sendMessage(token);
  } catch (err) {
    console.error(err.response?.data || err.message);
  }
}

main();
