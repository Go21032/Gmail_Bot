function main() {
  const query = 'is:unread'
  const threads = GmailApp.search(query, 0, 10)//Gmailの未読メールを何件探すか
    threads.forEach((thread) => {//threadをforEachというメソッドで順番に見ていく
      thread.getMessages().forEach((message) => {//次にメッセージを順に見る
        if (!message.isUnread()) { return }//未読でない(既読の)とき,trueを返す.するとreturnが実行され,即座に処理を中断して元の状態に戻る
          var text = create_message(message);
          send_to_slack(text)
          })
        })
}

function create_message(message) {
  const gmailBaseUrl = "https://mail.google.com/mail/u/0/#inbox";//Gmailの不変のURL
  const eacth_url = message.getId();
  var gmail_url =gmailBaseUrl + "/" + eacth_url;//ベースと個々のメールのURLを結合
  console.log("Gmailリンク:" + gmail_url)
return  `\n 【既読する？】➡ ${gmail_url}`
        + `\n【件名】 ${message.getSubject()}`// タイトル取得
        + `\n【本文】${message.getPlainBody()}`// メールの本文取得
} 

function send_to_slack(sendtext) {
  const webhook_url ="https://hooks.slack.com/services/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"//指定のチャンネルのWebHook_URL
  const headers = { "Content-type": "application/json" }
  var jsonData = {"icon": '',//好きなアイコン（基本名前と画像はIncoming Webhook側で設定）
                  "bot_name" : '',//アイコンの名前
                  "text" :`<@U05K1G2GFD2>返信しヨーソロー！ﾋﾞｼｬｧ`,//@メンション(ユーザーID)&メッセージ
  "attachments" : [
    {
     "text": sendtext,
     "color": "#3AA3E3",//マークダウンの色（カラーコード）
    }]
  };
  const options = {
    "method": "post",
    "headers": headers,
    "payload": JSON.stringify(jsonData),//データの形式をJSONに変換する
    "muteHttpExceptions": true
    }
UrlFetchApp.fetch(webhook_url, options)//スラックに送る
}
