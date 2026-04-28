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
  const params = new URLSearchParams();

  params.append(
    "template_object",
    JSON.stringify({
      object_type: "ㅎㅇ",
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
