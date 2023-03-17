# Figma Frame to JSON

FigmaのFrameをいい感じにJSONに変換してくれるFigma Plugin。

※ ChatGPT（GPT-4）との共作です。

会話のログは以下です。

<details>
  <summary>クリックで展開するタイトル</summary>
  ## Figma JSON Exporter

Started on: 2023/3/16 10:11:18

## You

Figma の特定の Frame から Json を出力する node のスクリプトを作ってほしい。 node のプロジェクト作成のところからやり方を説明して。

## ChatGPT

Figma の特定の Frame から JSON を出力するために、Figma Plugin API を使用してカスタムプラグインを作成します。まず、Figma プラグインの開発環境をセットアップし、その後スクリプトを作成します。

1.  Figma のプラグイン開発環境のセットアップ

- Figma アカウントにログインして、右上のアバターアイコンをクリックし、"Plugins"を選択してプラグインページにアクセスします。
- "Create new plugin"をクリックし、"Link existing plugin"を選択します。
- プラグインの名前を入力し、"Choose a manifest.json file"をクリックして、後で作成する manifest.json ファイルを選択します。

2.  プロジェクトフォルダを作成

- ローカルコンピュータでプロジェクトフォルダを作成し、以下の 2 つのファイルを作成します。
  - manifest.json
  - code.ts (TypeScript を使用する場合) または code.js (JavaScript を使用する場合)

3.  manifest.json ファイルの設定

- manifest.json ファイルに以下の内容を記述します。

```json
{
  "api": "1.0.0",
  "name": "JSON Exporter",
  "id": "YOUR_PLUGIN_ID",
  "main": "code.ts",
  "ui": "html/ui.html"
}
```

- "YOUR_PLUGIN_ID"を Figma から取得したプラグイン ID に置き換えます。

4.  JSON 出力スクリプトの作成

- code.ts (または code.js) ファイルに以下の内容を記述します。

```typescript
figma.showUI(__html__, { width: 400, height: 300 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === "export-json") {
    const frameName = msg.frameName;
    const frame = figma.currentPage.findOne(
      (node) => node.type === "FRAME" && node.name === frameName
    );

    if (frame) {
      const json = exportFrameToJson(frame);
      figma.ui.postMessage({ type: "json-exported", json });
    } else {
      figma.ui.postMessage({
        type: "error",
        message: `Frame "${frameName}" not found`,
      });
    }
  }
};

function exportFrameToJson(frame) {
  const result = {
    name: frame.name,
    type: frame.type,
    children: frame.children.map((child) => exportNodeToJson(child)),
  };
  return JSON.stringify(result, null, 2);
}

function exportNodeToJson(node) {
  const result = {
    id: node.id,
    name: node.name,
    type: node.type,
  };

  if ("children" in node) {
    result.children = node.children.map((child) => exportNodeToJson(child));
  }

  return result;
}
```

5.  UI ファイルの作成

- プロジェクトフォルダ内に "html" という名前のフォルダを作成し、その中に "ui.html" という名前のファ

## You

続けて

## ChatGPT

イルを作成します。このファイルでは、プラグインの UI を定義し、メッセージの送受信を処理します。

6.  ui.html ファイルの内容を記述

- ui.html ファイルに以下の内容を記述します。

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
          Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
          "Segoe UI Symbol";
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 10px;
        margin: 0;
        padding: 16px;
        background-color: rgba(0, 0, 0, 0.1);
      }
      input {
        width: 100%;
      }
      button {
        cursor: pointer;
      }
    </style>
  </head>
  <body>
    <label for="frameName">Frame Name:</label>
    <input type="text" id="frameName" />
    <button id="exportButton">Export JSON</button>
    <pre id="jsonOutput"></pre>
    <script>
      const exportButton = document.getElementById("exportButton");
      const frameNameInput = document.getElementById("frameName");
      const jsonOutput = document.getElementById("jsonOutput");

      exportButton.onclick = () => {
        parent.postMessage(
          {
            pluginMessage: {
              type: "export-json",
              frameName: frameNameInput.value,
            },
          },
          "*"
        );
      };

      window.onmessage = (event) => {
        const msg = event.data.pluginMessage;

        if (msg.type === "json-exported") {
          jsonOutput.textContent = msg.json;
        } else if (msg.type === "error") {
          jsonOutput.textContent = msg.message;
        }
      };
    </script>
  </body>
</html>
```

これで、Figma プラグインが完成しました。Figma のプラグインページで開発環境をセットアップした際に指定した manifest.json ファイルを選択し、プラグインをリンクしてください。

プラグインの使い方:

1.  Figma でプロジェクトを開きます。
2.  メニューバーの "Plugins" から作成した "JSON Exporter" プラグインを実行します。
3.  プラグイン UI にて、JSON を出力したい Frame の名前を入力し、"Export JSON" ボタンをクリックします。
4.  出力された JSON がプラグイン UI 下部に表示されます。

これで、Figma の特定の Frame から JSON を出力するプラグインが完成しました。必要に応じて、このプラグインをカスタマイズして、さらに詳細なデータを JSON に含めることができます。

## You

Figma の特定の Frame から Json を出力する node のスクリプトを作ってほしい。 node のプロジェクト作成のところからやり方を説明して。

## ChatGPT

Figma の特定の Frame から JSON を出力する Node.js のスクリプト

## You

Figma の特定の Frame から Json を出力するカスタムプラグインを作ってほしい

## ChatGPT

Figma の API を使用して、特定の Frame から JSON を出力するカスタムプラグインを作成する方法を説明します。以下のステップに従ってください。

1.  Figma のプラグインを作成する:

Figma アカウントで、メニューバーから「Plugins」>「Manage plugins」>「Create new plugin」を選択します。新しいプラグインに名前と説明を入力し、「Create Plugin」をクリックして作成します。

2.  プラグインコードを編集する:

プラグインが作成されたら、`code.ts`ファイルを開き、以下のコードを貼り付けます。

```typescript
// This plugin will export JSON data from a specific frame in Figma.

figma.showUI(__html__, { width: 400, height: 300 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === "export-frame") {
    const frameName = msg.frameName;

    const frame = figma.currentPage.findOne(
      (node) => node.type === "FRAME" && node.name === frameName
    );

    if (!frame) {
      figma.ui.postMessage({
        type: "error",
        message: `Frame not found with name "${frameName}".`,
      });
      return;
    }

    const jsonData = JSON.stringify(frame, null, 2);

    await figma.clientStorage.setAsync(frameName, jsonData);

    figma.ui.postMessage({
      type: "success",
      message: `JSON data exported for frame "${frameName}".`,
    });
  }
};
```

3.  プラグインの UI を作成する:

プラグインの`ui.html`ファイルを開き、以下のコードを貼り付けます。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Figma Frame to JSON Exporter</title>
    <style>
      /* Add your custom styles here */
    </style>
  </head>
  <body>
    <h1>Figma Frame to JSON Exporter</h1>
    <p>Enter the frame name you want to export as JSON:</p>
    <input type="text" id="frameName" />
    <button id="exportButton">Export JSON</button>
    <p id="message"></p>

    <script>
      document.getElementById("exportButton").onclick = () => {
        const frameName = document.getElementById("frameName").value;
        parent.postMessage(
          { pluginMessage: { type: "export-frame", frameName } },
          "*"
        );
      };

      window.onmessage = (event) => {
        const msg = event.data.pluginMessage;
        if (msg.type === "success" || msg.type === "error") {
          document.getElementById("message").innerText = msg.message;
        }
      };
    </script>
  </body>
</html>
```

4.  プラグインをテストする:

Figma でプラグインを実行して、特定の Frame から JSON データを出力する機能をテストできます。プラグインを実行するには、「Plugins」メニューからプラグイン名を選択します。UI が表示されたら、Frame の名前を入力し、「Export JSON」ボタン

## You

最新の UI を加味して Figma のプラグインの作り方の手順をもう一度教えてもらってもいい？

## ChatGPT

もちろんです！最新の Figma UI を考慮して、プラグインの作成手順を以下に示します。

1.  Figma のプラグインを作成する:

Figma アカウントで、右上の「Community」アイコンをクリックし、下部メニューで「Create new」>「Plugin」を選択します。新しいプラグインに名前と説明を入力し、「Create Plugin」をクリックして作成します。

2.  プラグインコードを編集する:

プラグインが作成されたら、`code.ts`ファイルを開き、以下のコードを貼り付けます。

```typescript
// This plugin will export JSON data from a specific frame in Figma.

figma.showUI(__html__, { width: 400, height: 300 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === "export-frame") {
    const frameName = msg.frameName;

    const frame = figma.currentPage.findOne(
      (node) => node.type === "FRAME" && node.name === frameName
    );

    if (!frame) {
      figma.ui.postMessage({
        type: "error",
        message: `Frame not found with name "${frameName}".`,
      });
      return;
    }

    const jsonData = JSON.stringify(frame, null, 2);

    await figma.clientStorage.setAsync(frameName, jsonData);

    figma.ui.postMessage({
      type: "success",
      message: `JSON data exported for frame "${frameName}".`,
    });
  }
};
```

3.  プラグインの UI を作成する:

プラグインの`ui.html`ファイルを開き、以下のコードを貼り付けます。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Figma Frame to JSON Exporter</title>
    <style>
      /* Add your custom styles here */
    </style>
  </head>
  <body>
    <h1>Figma Frame to JSON Exporter</h1>
    <p>Enter the frame name you want to export as JSON:</p>
    <input type="text" id="frameName" />
    <button id="exportButton">Export JSON</button>
    <p id="message"></p>

    <script>
      document.getElementById("exportButton").onclick = () => {
        const frameName = document.getElementById("frameName").value;
        parent.postMessage(
          { pluginMessage: { type: "export-frame", frameName } },
          "*"
        );
      };

      window.onmessage = (event) => {
        const msg = event.data.pluginMessage;
        if (msg.type === "success" || msg.type === "error") {
          document.getElementById("message").innerText = msg.message;
        }
      };
    </script>
  </body>
</html>
```

4.  プラグインをテストする:

Figma でプラグインを実行して、特定の Frame から JSON データを出力する機能をテストできます。プラグインを実行するには、「Plugins」メニューからプラグイン名を選択します。UI が表示されたら、Frame の名前を入力し、「Export JSON」ボタンをクリック

## You

json はどこに保存されるの？

## ChatGPT

上記のプラグインコードでは、JSON データは Figma のクライアントストレージに保存されています。`figma.clientStorage.setAsync`関数を使用して、指定したキー（この場合はフレーム名）に対して JSON データを保存しています。

ただし、この方法では、データは Figma のローカルストレージに保存され、ユーザーが直接アクセスできません。代わりに、JSON データをダウンロード可能なファイルとして保存する方法を紹介します。

1.  `code.ts`ファイルの変更:

以下のコードを`code.ts`ファイルに追加し、`figma.ui.postMessage`関数を使用して JSON データを UI に送信します。

```typescript
// Replace the following line:
// await figma.clientStorage.setAsync(frameName, jsonData);

// With these lines:
figma.ui.postMessage({ type: "json-data", jsonData: jsonData });
```

2.  `ui.html`ファイルの変更:

以下の関数を`ui.html`ファイルの`<script>`タグ内に追加して、受信した JSON データをダウンロード可能なファイルとして保存します。

```javascript
function downloadJson(jsonData, fileName) {
  const a = document.createElement("a");
  const file = new Blob([jsonData], { type: "application/json" });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}
```

次に、`window.onmessage`関数を以下のように変更して、新しい`downloadJson`関数を呼び出します。

```javascript
window.onmessage = (event) => {
  const msg = event.data.pluginMessage;
  if (msg.type === "success" || msg.type === "error") {
    document.getElementById("message").innerText = msg.message;
  } else if (msg.type === "json-data") {
    downloadJson(msg.jsonData, "frame-data.json");
  }
};
```

これで、プラグインを実行してフレームをエクスポートすると、JSON データが`frame-data.json`という名前のファイルとしてダウンロードされます。

## You

input に入力された frame 名をもとに該当 Frame を Figma の API を使って Json 形式に変換してダウンロードできるように script を書き直して

## ChatGPT

以下に、指定されたフレーム名を元に該当フレームを Figma の API を使って JSON 形式に変換し、ダウンロードできるようにスクリプトを書き直します。

1.  `code.ts` ファイルを更新:

```typescript
// This plugin will export JSON data from a specific frame in Figma.

figma.showUI(__html__, { width: 400, height: 300 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === "export-frame") {
    const frameName = msg.frameName;

    const frame = figma.currentPage.findOne(
      (node) => node.type === "FRAME" && node.name === frameName
    );

    if (!frame) {
      figma.ui.postMessage({
        type: "error",
        message: `Frame not found with name "${frameName}".`,
      });
      return;
    }

    const jsonData = JSON.stringify(frame, null, 2);
    figma.ui.postMessage({ type: "json-data", jsonData: jsonData });
  }
};
```

2.  `ui.html` ファイルを更新:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Figma Frame to JSON Exporter</title>
    <style>
      /* Add your custom styles here */
    </style>
  </head>
  <body>
    <h1>Figma Frame to JSON Exporter</h1>
    <p>Enter the frame name you want to export as JSON:</p>
    <input type="text" id="frameName" />
    <button id="exportButton">Export JSON</button>
    <p id="message"></p>

    <script>
      document.getElementById("exportButton").onclick = () => {
        const frameName = document.getElementById("frameName").value;
        parent.postMessage(
          { pluginMessage: { type: "export-frame", frameName } },
          "*"
        );
      };

      function downloadJson(jsonData, fileName) {
        const a = document.createElement("a");
        const file = new Blob([jsonData], { type: "application/json" });
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
      }

      window.onmessage = (event) => {
        const msg = event.data.pluginMessage;
        if (msg.type === "error") {
          document.getElementById("message").innerText = msg.message;
        } else if (msg.type === "json-data") {
          downloadJson(msg.jsonData, "frame-data.json");
        }
      };
    </script>
  </body>
</html>
```

これで、入力されたフレーム名を元に該当フレームを JSON 形式に変換し、ダウンロードできるようになりました。プラグインを実行して、フレーム名を入力し、「Export JSON」ボタンをクリックすると、JSON データが `frame-data.json` という名前のファイルとしてダウンロードされます。

## You

Frame の中身の構造まで取得して Json 化したい

## ChatGPT

Figma API を使って、フレームの内部構造を含む JSON データを作成するには、以下の手順でコードを更新します。

1.  `code.ts`ファイルの更新:

フレームの内部構造を含む JSON データを作成するために、新しい関数`processNode`を追加します。この関数は、ノードとその子孫を再帰的に処理して、フレームの内部構造を保持するオブジェクトを作成します。

```typescript
function processNode(node) {
  const processedNode = {
    id: node.id,
    name: node.name,
    type: node.type,
    visible: node.visible,
    locked: node.locked,
    children: [],
  };

  if ("children" in node) {
    processedNode.children = node.children.map((child) => processNode(child));
  }

  return processedNode;
}

// This plugin will export JSON data from a specific frame in Figma, including its structure.

figma.showUI(__html__, { width: 400, height: 300 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === "export-frame") {
    const frameName = msg.frameName;

    const frame = figma.currentPage.findOne(
      (node) => node.type === "FRAME" && node.name === frameName
    );

    if (!frame) {
      figma.ui.postMessage({
        type: "error",
        message: `Frame not found with name "${frameName}".`,
      });
      return;
    }

    const processedFrame = processNode(frame);
    const jsonData = JSON.stringify(processedFrame, null, 2);
    figma.ui.postMessage({ type: "json-data", jsonData: jsonData });
  }
};
```

2.  `ui.html`ファイルをそのまま使用します。これは以前の回答で提供したものと同じです。

これで、指定されたフレーム名を元に、フレームの内部構造を含む JSON データが作成され、ダウンロードできるようになります。プラグインを実行し、「Export JSON」ボタンをクリックすると、フレームの内部構造を含む JSON データが`frame-data.json`という名前のファイルとしてダウンロードされます。

## You

processNode の引数の node の型がなくて怒られます

## ChatGPT

すみません。型を指定していないことによるエラーが発生していました。`processNode`関数の引数`node`に型を追加しましょう。`SceneNode`型を使用して、以下のように修正します。

1.  `code.ts`ファイルの更新:

```typescript
import { SceneNode } from "@figma/plugin-typings";

function processNode(node: SceneNode) {
  const processedNode = {
    id: node.id,
    name: node.name,
    type: node.type,
    visible: node.visible,
    locked: node.locked,
    children: [],
  };

  if ("children" in node) {
    processedNode.children = (node as any).children.map((child: SceneNode) =>
      processNode(child)
    );
  }

  return processedNode;
}

// This plugin will export JSON data from a specific frame in Figma, including its structure.

figma.showUI(__html__, { width: 400, height: 300 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === "export-frame") {
    const frameName = msg.frameName;

    const frame = figma.currentPage.findOne(
      (node) => node.type === "FRAME" && node.name === frameName
    );

    if (!frame) {
      figma.ui.postMessage({
        type: "error",
        message: `Frame not found with name "${frameName}".`,
      });
      return;
    }

    const processedFrame = processNode(frame);
    const jsonData = JSON.stringify(processedFrame, null, 2);
    figma.ui.postMessage({ type: "json-data", jsonData: jsonData });
  }
};
```

`SceneNode`型をインポートして、`processNode`関数の引数`node`に型`SceneNode`を追加しました。また、`node`が`children`プロパティを持つ場合、`node`を`any`型にキャストして子要素を処理します。

これで、型エラーが解消されるはずです。再度プラグインを実行して、フレームの内部構造を含む JSON データをエクスポートできることを確認してください。

## You

@figma/plugin-typings は yarn でインストールすれば良い？

## ChatGPT

いいえ、`@figma/plugin-typings`は`figma/plugin-typings`として提供されており、インストールする必要はありません。Figma プラグインを開発する際、型定義ファイルは既にプロジェクトに含まれています。

通常、プロジェクトの`tsconfig.json`ファイルに`"types": ["figma/plugin-typings"]`が追加されており、Figma プラグインの型定義が提供されています。そのため、`import { SceneNode } from "@figma/plugin-typings";`のようなインポート文を使用する必要はありません。

代わりに、次のように修正して`SceneNode`型を使用できます。

1.  `code.ts`ファイルの更新:

```typescript
function processNode(node: SceneNode) {
  const processedNode = {
    id: node.id,
    name: node.name,
    type: node.type,
    visible: node.visible,
    locked: node.locked,
    children: [],
  };

  if ("children" in node) {
    processedNode.children = (node as any).children.map((child: SceneNode) =>
      processNode(child)
    );
  }

  return processedNode;
}

// This plugin will export JSON data from a specific frame in Figma, including its structure.

figma.showUI(__html__, { width: 400, height: 300 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === "export-frame") {
    const frameName = msg.frameName;

    const frame = figma.currentPage.findOne(
      (node) => node.type === "FRAME" && node.name === frameName
    );

    if (!frame) {
      figma.ui.postMessage({
        type: "error",
        message: `Frame not found with name "${frameName}".`,
      });
      return;
    }

    const processedFrame = processNode(frame);
    const jsonData = JSON.stringify(processedFrame, null, 2);
    figma.ui.postMessage({ type: "json-data", jsonData: jsonData });
  }
};
```

`import { SceneNode } from "@figma/plugin-typings";`のインポート文を削除しました。それ以外のコードは前回の回答と同じです。

これで、型エラーが解消され、フレームの内部構造を含む JSON データをエクスポートできるはずです。プラグインを実行して確認してください。

## You

https://github.dev/kazuyaseki/figma-to-react/blob/c4c0e6986bc81806dd98ddfd3253bea67819edc8/src/buildTagTree.ts このコードを参考にリファクタできる？

## ChatGPT

このコードを参考にして、`processNode`関数をリファクタリングして、より構造化された方法でフレームの内部構造を含む JSON データを生成できます。以下に、リファクタリングされた`processNode`関数を示します。

1.  `code.ts`ファイルの更新:

```typescript
interface ProcessedNode {
  id: string;
  name: string;
  type: string;
  visible: boolean;
  locked: boolean;
  children?: ProcessedNode[];
}

function processNode(node: SceneNode): ProcessedNode {
  const baseNode: ProcessedNode = {
    id: node.id,
    name: node.name,
    type: node.type,
    visible: node.visible,
    locked: node.locked,
  };

  if ("children" in node) {
    baseNode.children = (node as any).children.map((child: SceneNode) =>
      processNode(child)
    );
  }

  return baseNode;
}

// This plugin will export JSON data from a specific frame in Figma, including its structure.

figma.showUI(__html__, { width: 400, height: 300 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === "export-frame") {
    const frameName = msg.frameName;

    const frame = figma.currentPage.findOne(
      (node) => node.type === "FRAME" && node.name === frameName
    );

    if (!frame) {
      figma.ui.postMessage({
        type: "error",
        message: `Frame not found with name "${frameName}".`,
      });
      return;
    }

    const processedFrame = processNode(frame);
    const jsonData = JSON.stringify(processedFrame, null, 2);
    figma.ui.postMessage({ type: "json-data", jsonData: jsonData });
  }
};
```

リファクタリングでは、`ProcessedNode`インターフェイスを作成し、`processNode`関数が返すオブジェクトの型を明示的に指定しました。これにより、関数の入出力がより明確になり、コードの可読性が向上します。

また、`processNode`関数内でベースノードを作成し、子ノードが存在する場合に`children`プロパティを追加しています。

このリファクタリングにより、コードがより構造化され、可読性が向上します。プラグインを実行し、フレームの内部構造を含む JSON データをエクスポートできることを確認してください。

## You

スタイルの情報って加味できない？

## ChatGPT

もちろん、スタイル情報を加味して JSON データを生成することができます。以下に、スタイル情報を含めたリファクタリングされた`processNode`関数を示します。

1.  `code.ts`ファイルの更新:

```typescript
interface ProcessedNode {
  id: string;
  name: string;
  type: string;
  visible: boolean;
  locked: boolean;
  children?: ProcessedNode[];
  style?: object;
}

function processNode(node: SceneNode): ProcessedNode {
  const baseNode: ProcessedNode = {
    id: node.id,
    name: node.name,
    type: node.type,
    visible: node.visible,
    locked: node.locked,
  };

  if (
    node.type === "RECTANGLE" ||
    node.type === "TEXT" ||
    node.type === "VECTOR" ||
    node.type === "ELLIPSE" ||
    node.type === "POLYGON" ||
    node.type === "STAR" ||
    node.type === "LINE"
  ) {
    baseNode.style = {
      fills: (node as GeometryMixin).fills,
      strokes: (node as GeometryMixin).strokes,
      strokeWeight: (node as GeometryMixin).strokeWeight,
      cornerRadius: (node as CornerMixin).cornerRadius,
      blendMode: (node as BlendMixin).blendMode,
      opacity: (node as BlendMixin).opacity,
    };
  }

  if ("children" in node) {
    baseNode.children = (node as any).children.map((child: SceneNode) =>
      processNode(child)
    );
  }

  return baseNode;
}

// This plugin will export JSON data from a specific frame in Figma, including its structure and styles.

figma.showUI(__html__, { width: 400, height: 300 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === "export-frame") {
    const frameName = msg.frameName;

    const frame = figma.currentPage.findOne(
      (node) => node.type === "FRAME" && node.name === frameName
    );

    if (!frame) {
      figma.ui.postMessage({
        type: "error",
        message: `Frame not found with name "${frameName}".`,
      });
      return;
    }

    const processedFrame = processNode(frame);
    const jsonData = JSON.stringify(processedFrame, null, 2);
    figma.ui.postMessage({ type: "json-data", jsonData: jsonData });
  }
};
```

`ProcessedNode`インターフェイスに`style`プロパティを追加しました。`processNode`関数内で、対象のノードタイプがスタイル情報を持っている場合（例: RECTANGLE、TEXT、VECTOR、ELLIPSE、POLYGON、STAR、LINE など）、そのスタイル情報を取得し、`style`プロパティに割り当てます。

このリファクタリングにより、各ノードのスタイル情報も JSON データに含まれるようになります。プラグインを実行し、フレームの内部構造とスタイル情報を含む JSON データをエクスポートできることを確認してください。

## You

fontsize とかも考慮できる？

## ChatGPT

もちろん、フォントサイズやその他のテキスト関連のスタイル情報も考慮できます。以下に、`processNode`関数を更新して、テキストノードの場合にフォントサイズやその他のテキストスタイル情報を含める方法を示します。

1.  `code.ts`ファイルの更新:

```typescript
interface ProcessedNode {
  id: string;
  name: string;
  type: string;
  visible: boolean;
  locked: boolean;
  children?: ProcessedNode[];
  style?: object;
  textStyle?: object;
}

function processNode(node: SceneNode): ProcessedNode {
  const baseNode: ProcessedNode = {
    id: node.id,
    name: node.name,
    type: node.type,
    visible: node.visible,
    locked: node.locked,
  };

  if (
    node.type === "RECTANGLE" ||
    node.type === "TEXT" ||
    node.type === "VECTOR" ||
    node.type === "ELLIPSE" ||
    node.type === "POLYGON" ||
    node.type === "STAR" ||
    node.type === "LINE"
  ) {
    baseNode.style = {
      fills: (node as GeometryMixin).fills,
      strokes: (node as GeometryMixin).strokes,
      strokeWeight: (node as GeometryMixin).strokeWeight,
      cornerRadius: (node as CornerMixin).cornerRadius,
      blendMode: (node as BlendMixin).blendMode,
      opacity: (node as BlendMixin).opacity,
    };
  }

  if (node.type === "TEXT") {
    baseNode.textStyle = {
      fontSize: (node as TextNode).fontSize,
      fontFamily: (node as TextNode).fontName,
      fontWeight: (node as TextNode).fontWeight,
      textAlignHorizontal: (node as TextNode).textAlignHorizontal,
      textAlignVertical: (node as TextNode).textAlignVertical,
      letterSpacing: (node as TextNode).letterSpacing,
      lineHeight: (node as TextNode).lineHeight,
    };
  }

  if ("children" in node) {
    baseNode.children = (node as any).children.map((child: SceneNode) =>
      processNode(child)
    );
  }

  return baseNode;
}

// This plugin will export JSON data from a specific frame in Figma, including its structure and styles.

figma.showUI(__html__, { width: 400, height: 300 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === "export-frame") {
    const frameName = msg.frameName;

    const frame = figma.currentPage.findOne(
      (node) => node.type === "FRAME" && node.name === frameName
    );

    if (!frame) {
      figma.ui.postMessage({
        type: "error",
        message: `Frame not found with name "${frameName}".`,
      });
      return;
    }

    const processedFrame = processNode(frame);
    const jsonData = JSON.stringify(processedFrame, null, 2);
    figma.ui.postMessage({ type: "json-data", jsonData: jsonData });
  }
};
```

`ProcessedNode`インターフェイスに`textStyle`プロパティを追加しました。`processNode`関数内で、対象のノードタイプが`TEXT`の場合、フォントサイズやその他のテキストスタイル情報を取得し、`textStyle`プロパティに割り当てます。

このリファク

## You

続けて

## ChatGPT

タリングにより、テキストノードのフォントサイズやその他のテキストスタイル情報も JSON データに含まれるようになります。プラグインを実行し、フレームの内部構造、スタイル情報、およびテキストスタイル情報を含む JSON データをエクスポートできることを確認してください。

## You

同じように node.type のそれぞれについて詳細にスタイルを出力してほしい

## ChatGPT

了解しました。それぞれのノードタイプに応じて、詳細なスタイル情報を含むように`processNode`関数を更新します。

1.  `code.ts`ファイルの更新:

```typescript
interface ProcessedNode {
  id: string;
  name: string;
  type: string;
  visible: boolean;
  locked: boolean;
  children?: ProcessedNode[];
  style?: object;
}

function processNode(node: SceneNode): ProcessedNode {
  const baseNode: ProcessedNode = {
    id: node.id,
    name: node.name,
    type: node.type,
    visible: node.visible,
    locked: node.locked,
  };

  if ("fills" in node) {
    baseNode.style = {
      fills: node.fills,
    };
  }

  if ("strokes" in node) {
    if (!baseNode.style) baseNode.style = {};
    baseNode.style = {
      ...baseNode.style,
      strokes: node.strokes,
      strokeWeight: node.strokeWeight,
      strokeMiterLimit: node.strokeMiterLimit,
      strokeCap: node.strokeCap,
      strokeJoin: node.strokeJoin,
    };
  }

  if ("cornerRadius" in node) {
    if (!baseNode.style) baseNode.style = {};
    baseNode.style = {
      ...baseNode.style,
      cornerRadius: node.cornerRadius,
    };
  }

  if ("blendMode" in node) {
    if (!baseNode.style) baseNode.style = {};
    baseNode.style = {
      ...baseNode.style,
      blendMode: node.blendMode,
      opacity: node.opacity,
    };
  }

  if (node.type === "TEXT") {
    if (!baseNode.style) baseNode.style = {};
    baseNode.style = {
      ...baseNode.style,
      fontSize: node.fontSize,
      fontFamily: node.fontName,
      fontWeight: node.fontWeight,
      textAlignHorizontal: node.textAlignHorizontal,
      textAlignVertical: node.textAlignVertical,
      letterSpacing: node.letterSpacing,
      lineHeight: node.lineHeight,
      textDecoration: node.textDecoration,
      textCase: node.textCase,
      textAutoResize: node.textAutoResize,
      paragraphIndent: node.paragraphIndent,
      paragraphSpacing: node.paragraphSpacing,
      autoRename: node.autoRename,
    };
  }

  if ("children" in node) {
    baseNode.children = (node as any).children.map((child: SceneNode) =>
      processNode(child)
    );
  }

  return baseNode;
}

// This plugin will export JSON data from a specific frame in Figma, including its structure and styles.

figma.showUI(__html__, { width: 400, height: 300 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === "export-frame") {
    const frameName = msg.frameName;

    const frame = figma.currentPage.findOne(
      (node) => node.type === "FRAME" && node.name === frameName
    );

    if (!frame) {
      figma.ui.postMessage({
        type: "error",
        message: `Frame not found with name "${frameName}".`,
      });
      return;
    }

    const processedFrame = processNode(frame);
    const jsonData = JSON.stringify(processedFrame, null, 2);
    figma.ui.postMessage({ type: "json-data", jsonData: jsonData });
  }
};
```

`processNode`関数では、各ノードタイプごとに詳細なスタイル情報を持つ`style`プロパ

## You

続けて

## ChatGPT

パティを割り当てます。例えば、テキストノードにはフォントサイズ、フォントファミリー、フォントウェイト、テキストアラインメント、行間、段落のインデント、段落のスペーシングなどの情報が含まれます。それぞれのノードタイプに対して、適切なスタイル情報が含まれるようになりました。

これで、プラグインはフレームの内部構造、各ノードの詳細なスタイル情報を含む JSON データをエクスポートできるようになります。プラグインを実行し、期待される JSON データが正しくエクスポートされることを確認してください。

## You

node.strokeMiterLimit と node.strokeCap で型エラーが出ます

## ChatGPT

失礼しました。それらのプロパティはすべてのノードには存在しないため、`GeometryMixin`インターフェイスを持つノードでのみアクセスできます。これを修正するには、`processNode`関数で`strokes`プロパティを持つノードをチェックし、それらのプロパティにアクセスする前に型アサーションを使用します。

以下が修正された`processNode`関数の一部です。

```typescript
if ("strokes" in node) {
  if (!baseNode.style) baseNode.style = {};
  const geometryNode = node as GeometryMixin;
  baseNode.style = {
    ...baseNode.style,
    strokes: geometryNode.strokes,
    strokeWeight: geometryNode.strokeWeight,
    strokeMiterLimit: geometryNode.strokeMiterLimit,
    strokeCap: geometryNode.strokeCap,
    strokeJoin: geometryNode.strokeJoin,
  };
}
```

この修正により、`node.strokeMiterLimit`と`node.strokeCap`に関する型エラーが解決されるはずです。プラグインを再度実行し、期待される JSON データが正しくエクスポートされることを確認してください。

## You

ありがとう。 それと、入力された frame 名でファイル保存できるようにしたい。

## ChatGPT

了解しました。入力されたフレーム名を使ってファイルを保存するようにプラグインを更新します。まず、`ui.html`ファイルを更新して、保存ボタンを追加し、フレーム名をメッセージとして送信できるようにします。

1.  `ui.html`ファイルの更新:

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      /* Add your styles here */
    </style>
  </head>
  <body>
    <label for="frame-name">Frame name:</label>
    <input type="text" id="frame-name" />
    <button id="export-button">Export Frame as JSON</button>
    <script>
      document.getElementById("export-button").onclick = () => {
        const frameName = document.getElementById("frame-name").value;
        parent.postMessage(
          { pluginMessage: { type: "export-frame", frameName: frameName } },
          "*"
        );
      };

      onmessage = (event) => {
        const message = event.data.pluginMessage;
        if (message.type === "json-data") {
          const jsonData = message.jsonData;
          const blob = new Blob([jsonData], { type: "application/json" });
          const url = URL.createObjectURL(blob);

          const link = document.createElement("a");
          link.href = url;
          link.download = `${frameName}.json`; // Use the frameName as the file name
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      };
    </script>
  </body>
</html>
```

次に、`code.ts`ファイルのメッセージハンドラを更新して、フレーム名を含む JSON データを`ui.html`に送信します。

2.  `code.ts`ファイルの更新:

```typescript
figma.ui.onmessage = async (msg) => {
  if (msg.type === "export-frame") {
    const frameName = msg.frameName;

    const frame = figma.currentPage.findOne(
      (node) => node.type === "FRAME" && node.name === frameName
    );

    if (!frame) {
      figma.ui.postMessage({
        type: "error",
        message: `Frame not found with name "${frameName}".`,
      });
      return;
    }

    const processedFrame = processNode(frame);
    const jsonData = JSON.stringify(processedFrame, null, 2);
    figma.ui.postMessage({
      type: "json-data",
      jsonData: jsonData,
      frameName: frameName,
    }); // Send the frameName along with jsonData
  }
};
```

これで、プラグインはフレーム名を使って JSON ファイルを保存できるようになります。プラグインを実行し、期待される JSON データがフレーム名を持つファイルとして正しく保存されることを確認してください。

## You

ui.html

> この時点でのコード

code.ts

> この時点でのコード

この二つのファイルが現在のコードなんだけど、これを加味してもう一度作ってもらってもいい？

## ChatGPT

もちろんです！`ui.html`と`code.ts`の両方のファイルを加味して、フレーム名を使用してファイルを保存するようにプラグインを修正します。

1.  `ui.html`ファイルの更新:

```html
<!DOCTYPE html>
<html lang="en">
  <!-- head の中身は省略 -->
  <body>
    <!-- 省略... -->
    <script>
      document.getElementById("export-button").onclick = () => {
        const frameName = document.getElementById("frame-name").value;
        parent.postMessage(
          { pluginMessage: { type: "export-frame", frameName: frameName } },
          "*"
        );
      };

      onmessage = (event) => {
        const message = event.data.pluginMessage;
        if (message.type === "json-data") {
          const jsonData = message.jsonData;
          const frameName = message.frameName;
          const blob = new Blob([jsonData], { type: "application/json" });
          const url = URL.createObjectURL(blob);

          const link = document.createElement("a");
          link.href = url;
          link.download = `${frameName}.json`; // Use the frameName as the file name
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      };
    </script>
  </body>
</html>
```

2.  `code.ts`ファイルの更新:

```typescript
// 既存のインターフェースと関数は省略

// This plugin will export JSON data from a specific frame in Figma, including its structure and styles.

figma.showUI(__html__, { width: 400, height: 300 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === "export-frame") {
    const frameName = msg.frameName;

    const frame = figma.currentPage.findOne(
      (node) => node.type === "FRAME" && node.name === frameName
    );

    if (!frame) {
      figma.ui.postMessage({
        type: "error",
        message: `Frame not found with name "${frameName}".`,
      });
      return;
    }

    const processedFrame = processNode(frame);
    const jsonData = JSON.stringify(processedFrame, null, 2);
    figma.ui.postMessage({
      type: "json-data",
      jsonData: jsonData,
      frameName: frameName,
    }); // Send the frameName along with jsonData
  }
};
```

これで、プラグインはフレーム名を使って JSON ファイルを保存できるようになります。プラグインを実行し、期待される JSON データがフレーム名を持つファイルとして正しく保存されることを確認してください。

## You

message が出なくなっちゃったんだけどどうしたらいい？

## ChatGPT

失礼しました。`ui.html` の `onmessage` イベントハンドラでエラーメッセージを処理する部分を追加し忘れていました。次のように `ui.html` の `<script>` タグ内にエラーメッセージを処理するコードを追加してください。

```html
<!-- 他の部分は省略 -->
<script>
  // 既存のコードは省略

  onmessage = (event) => {
    const message = event.data.pluginMessage;
    if (message.type === "json-data") {
      // 既存のコードは省略
    } else if (message.type === "error") {
      const logElement = document.getElementById("message");
      logElement.textContent = message.message;
    }
  };
</script>
<!-- 他の部分は省略 -->
```

これで、エラーメッセージが正しく表示されるはずです。プラグインを再度実行して、エラーメッセージが表示されることを確認してください。

## You

治った！ありがとう！ ボタンにもアニメーションつけたい

## ChatGPT

ボタンにアニメーションを追加するには、`ui.html` の `<style>` タグ内に CSS アニメーションを定義しましょう。ここでは、ボタンにホバー（マウスオーバー）したときに背景色が変わるアニメーションを追加してみます。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- 省略... -->
    <style>
      /* 既存のスタイルは省略 */

      .button {
        /* 既存のスタイルは省略 */
        transition: background-color 0.3s ease; /* アニメーションを追加 */
      }

      .button:hover {
        background-color: #61c0c3; /* ホバー時の背景色を変更 */
      }
    </style>
  </head>
  <body>
    <!-- 省略... -->
  </body>
</html>
```

このコードは、ボタンにマウスオーバーしたときに背景色が徐々に変わるアニメーションを追加します。`transition` プロパティで、アニメーションするプロパティ（ここでは `background-color`）、アニメーションの持続時間（`0.3s`）、およびアニメーションのタイミング関数（`ease`）を指定しています。

さらに別のアニメーション効果を追加したい場合は、同様に CSS を編集してください。たとえば、ボタンの境界線の色も変更するには、次のようにコードを追加します。

```html
<style>
  /* 既存のスタイルは省略 */

  .button {
    /* 既存のスタイルは省略 */
    transition: background-color 0.3s ease, border-color 0.3s ease; /* 境界線の色もアニメーションするように変更 */
  }

  .button:hover {
    background-color: #61c0c3; /* ホバー時の背景色を変更 */
    border-color: #61c0c3; /* ホバー時の境界線の色を変更 */
  }
</style>
```

プラグインを再度実行して、ボタンのアニメーションが期待通りに動作することを確認してください。

## You

押下中もいい感じにスタイリングできない？

## ChatGPT

もちろんできます！ボタンが押下中（クリック中）のスタイリングを追加するには、`:active` 疑似クラスを使用します。ここでは、ボタンが押下中のときに背景色と境界線の色をさらに暗くします。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- 省略... -->
    <style>
      /* 既存のスタイルは省略 */

      .button {
        /* 既存のスタイルは省略 */
        transition: background-color 0.3s ease, border-color 0.3s ease;
      }

      .button:hover {
        background-color: #61c0c3; /* ホバー時の背景色を変更 */
        border-color: #61c0c3; /* ホバー時の境界線の色を変更 */
      }

      .button:active {
        background-color: #4a999a; /* 押下中の背景色を変更 */
        border-color: #4a999a; /* 押下中の境界線の色を変更 */
      }
    </style>
  </head>
  <body>
    <!-- 省略... -->
  </body>
</html>
```

これで、ボタンが押下されている間、背景色と境界線の色が暗くなります。プラグインを再度実行して、ボタンのスタイリングが期待通りに動作することを確認してください。

## You

綺麗な感じになったありがと！

## ChatGPT

どういたしまして！お手伝いできてうれしいです。

これからも Figma プラグインや他の開発に関する質問があれば、どんどんお聞きください。お手伝いできることがあれば喜んで対応します。プロジェクトがうまく進むことを願っています！

</details>

  
出力されたJSONを以下の命令の中にコピペしてChatGPTに投げるとコンポーネントの叩きを作ってくれます。
例: 
  ```plane
    # 命令書

    あなたは、プロのフロントエンドエンジニアです。
    以下の Figma の Frame から出力された「元となる JSON」から「制約条件」満たすを最高のプログラムを出力してください。

    # 元となる JSON

    ```json
  
    <ここにjsonを書く>
      
    ```

    # 制約条件

    - React の関数型記述でコンポーネントを作成すること
    - Typescript を使用すること
    - スタイリングは CSS Module の形式に則ること
    - Sass で書くこと
    - ファイル数はなるべく少なくすること

  ```

 
