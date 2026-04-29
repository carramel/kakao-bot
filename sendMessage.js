import axios from "axios";
import fs from "fs";

// 환경 변수
const REST_API_KEY = process.env.KAKAO_REST_API_KEY;
const REFRESH_TOKEN = process.env.KAKAO_REFRESH_TOKEN;

// 📌 오늘 날짜 구하기 (MM-DD)
function getToday() {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${month}-${day}`;
}

// 📌 생일자 찾기
function getBirthdayPeople() {
  const data = JSON.parse(fs.readFileSync("birthdays.json", "utf-8"));
  const today = getToday();

  return data
    .filter(person => person.birthday === today)
    .map(person => person.name);
}

// 📌 토큰 갱신
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

// 📌 메시지 전송
async function sendMessage(accessToken, names) {
  let message = "";

  if (names.length === 0) {
    message = "🎈 오늘은 생일인 사람이 없습니다.";
  } else {
    message = `🎉 오늘의 생일자 🎉\n${names.join(", ")}\n생일 축하합니다! 🥳`;
  }

  const params = new URLSearchParams();
  params.append(
    "template_object",
    JSON.stringify({
      object_type: "text",
      text: message,
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

// 📌 메인 실행
async function main() {
  try {
    const birthdayPeople = getBirthdayPeople();
    const token = await refreshAccessToken();
    await sendMessage(token, birthdayPeople);
  } catch (err) {
    console.error(err.response?.data || err.message);
  }
}

main();
