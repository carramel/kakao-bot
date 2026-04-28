const axios = require("axios");
const fs = require("fs");

/**
 * 카카오톡 메시지를 전송하는 함수
 * @param {string} accessToken 카카오 API 액세스 토큰
 */
async function sendMessage(accessToken) {
  try {
    // 1. 생일 데이터 파일(birthdays.json) 읽기
    // 파일 형식: [{"name": "홍길동", "birthday": "05-22"}, ...]
    const birthdays = JSON.parse(fs.readFileSync("./birthdays.json", "utf-8"));

    // 2. 오늘 날짜 (MM-DD 형식) 가져오기
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const todayStr = `${month}-${day}`;

    // 3. 오늘 생일인 사람들 필터링
    const todayBirthdays = birthdays
      .filter(person => person.birthday === todayStr)
      .map(person => person.name);

    // 4. 메시지 텍스트 구성
    let messageText = "";
    if (todayBirthdays.length > 0) {
      const names = todayBirthdays.join(", ");
      messageText = `🎂 오늘 생일인 분: ${names}님! 진심으로 축하드립니다! 🎉`;
    } else {
      // 생일자가 없을 경우의 기본 메시지 (원하는 대로 수정 가능)
      messageText = "오늘도 좋은 하루 되세요! 🚀 (오늘은 생일자가 없습니다)";
    }

    // 5. 카카오톡 API 파라미터 설정
    const params = new URLSearchParams();
    params.append(
      "template_object",
      JSON.stringify({
        object_type: "text",
        text: messageText,
        link: {
          web_url: "https://example.com",
          mobile_web_url: "https://example.com"
        },
        button_title: "확인하기"
      })
    );

    // 6. API 호출 (나에게 보내기)
    const res = await axios.post(
      "https://kapi.kakao.com/v2/api/talk/memo/default/send",
      params,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );

    if (res.data.result_code === 0) {
      console.log("✅ 메시지 전송 성공!");
    } else {
      console.log("❌ 메시지 전송 실패:", res.data);
    }

  } catch (error) {
    console.error("🚨 에러 발생:");
    if (error.response) {
      console.error("상태 코드:", error.response.status);
      console.error("에러 내용:", error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

// 이 함수를 호출할 때 액세스 토큰을 넘겨주면 됩니다.
// module.exports = sendMessage; // 다른 파일에서 쓸 경우
