# 負け言語 ぬく方言  
**LH Language – Nuku Dialect (Unofficial)**

⚠ **本プロジェクトは非公式の二次創作です**  
本ツールは「負けヒロインが多すぎる！」（雨森たきび ガガガ文庫-小学館）に着想を得た  
**非公式・ファンメイドの技術デモ**であり、  
原作・作者・出版社・公式プロジェクトとは一切関係ありません。

⚠ **This is an unofficial fan-made project.**  
This project is **not affiliated with, endorsed by, or related to**  
any official work, author, or publisher.

---
## 目的（Purpose）
本プロジェクトは、難解プログラミング言語の設計・実装・可視化を通じて、
- 言語仕様設計
- インタプリタ／VM 実装
- ステップ実行・デバッグ UI
- ブラウザ上での可視化
を実験・学習することを目的とした **技術デモ**です。
ネタ要素を多分に含みますが、主目的は実装と設計の検証にあります。

---
## 特徴（Features）
- Brainf**k ベースの難解プログラミング言語
- UTF-8 入力・出力対応
- メモリ（セル）状態の可視化（数値＋文字）
- ステップ実行
- ブレークポイント（クリックでトグル）
- 停止理由表示（Breakpoint / End / Halt）
- 現在 IP・行番号・セルポインタのステータス表示
- requestAnimationFrame による Run 実行
- デバッグモード（言語定義検証結果の表示）
- GitHub Pages 上で動作
---

## LH Language について
**LH Language** は、Brainf**k をベースとした  
難解プログラミング言語群（Language Family）です。

### 方言（Dialect）
- **ぬく方言（Nuku Dialect）** は LH Language の一方言です
- 本プロジェクトは、将来的に複数のキャラクター方言を  
  同一の実行基盤上で扱えることを前提に設計されています

---
## ぬく方言の基本仕様（概要）

- 入力・出力：UTF-8
- メモリ：セル配列（数値をコードポイントとして解釈）
- 文法：単語区切りは半角スペースまたは改行

### 基本命令
| Brainf**k | 意味 | ぬく方言での表記 |
|---|---|---|
| `>` | ポインタを右へ移動 | `ぬく` |
| `<` | ポインタを左へ移動 | `ぬくっ` |
| `+` | 現在セルを +1 | `ぬくぬく` |
| `-` | 現在セルを -1 | `ぬくぬくっ` |
| `.` | 出力 | `ぬくく` |
| `,` | 入力 | `ぬくくっ` |
| `[` | ループ開始 | `ぬくぬくぬく` |
| `]` | ループ終了 | `ぬくぬくぬくっ` |

※ 詳細仕様は今後拡張・変更される可能性があります。

---
## 文法（Grammar）
### 全体構造
- 本言語（LH Language / 負け言語）は Brainf**k 系の逐次実行型言語です
- プログラムは **命令トークンの列**として解釈されます
- コメント構文は現時点で存在しません（未定義トークンは無視されます）

### トークン分割規則
- 命令は以下の区切りで分割されます
  - 半角スペース
  - 改行（LF）
- 1 行に複数命令が存在しても問題ありません
  - 以下の例1、例2は同一の命令として処理されます

例1
```text
ぬく ぬくぬく ぬくく
```
例2
```text
ぬく
ぬくぬく
ぬくく
```

### 命令語
命令語は **完全一致**で解釈されます  
前後に他の文字が付与されている場合は無効です

### 数値リテラル構文（拡張仕様）
#### ◆ぬく方言
##### 構文
- ぬく方言の数値リテラルは以下の形式で記述します
```text
ぬっ[っ...]く
```
- `ぬっ` で開始
- `く` で終了
- 含まれる `っ` の個数によって加算値が決定されます
##### 数値の意味
| 表記 | 加算値 |
|---|---|
| `ぬっく` | 1 |
| `ぬっっく` | 10 |
| `ぬっっっく` | 100 |
| `ぬっっっっく` | 1000 |
- `っ` が 1 つ増えるごとに **10 倍**
- 数値は **現在のメモリセルに加算**されます
- 「ぬっく」と「ぬく」は命令として同義です
##### 合成例
```text
ぬっっく ぬっっく
```
→ 10 + 10 = 20
```text
ぬっっっく ぬっっっく ぬっっっく ぬっっっく ぬっっっく ぬっっっく ぬっっっく ぬっっっく
ぬっっく ぬっっく ぬっっく ぬっっく ぬっっく ぬっっく ぬっっく
ぬっく ぬっく ぬっく
```
→ 100 * 8 + 10 * 7 + 1 * 3 = 873
#### デコード時の推奨方針
- コード長を抑えるため、**大きな数値から優先的に使用**することを推奨します
  - 難解プログラミングとしてはむしろ難解であることが美学ですが、無用な混乱を避けるためにまずはこの方針を意識してください 
- この方針はエンコーダ実装時の最適化ルールとして扱われます
---
## その他仕様詳細
### メモリモデル
- メモリは **一次元配列** （無限長：実装上は30,000セル）
- 各セルは **整数値**
- 初期値はすべて `0`
- ポインタは 0 番目のセルから開始します

### 入出力
- 入力・出力は **UTF-8 対応**
- 出力時は、現在セルの値を **Unicode コードポイント**として解釈します
- printable 判定は UI 側で行い、非表示文字は数値として表示されます

### ループ構文
- `[` と `]` は Brainf**k と同等の意味を持ちます
- 現在セルが `0` の場合：
  - `[` で対応する `]` の直後へジャンプ
- 現在セルが `0` 以外の場合：
  - `]` で対応する `[` に戻ります

### 未定義・非対応構文
- コメント構文：未対応
- マクロ・関数定義：未対応（実装予定なし）
- 負数表現専用リテラル：未対応・方針未策定
---

## 方言拡張について
- 文法構造は **言語共通** です
- 方言ごとの差分は以下に限定されます
  - 命令語の表記
  - 数値リテラルの解釈関数
このため、新しいキャラクター方言は  
**LanguageDefinition** を追加して拡張する予定です
---

## 実装技術（Implementation）
- JavaScript（Vanilla）
- Brainf**k 派生 VM
- requestAnimationFrame
- GitHub Pages
---

## 今後の開発・拡張予定（Future Plans）
- 他キャラクター方言の追加
- 言語定義・命令拡張
- デバッグ機能の拡張
- サンプルコードの充実
※ これらは構想段階のものであり、実装を保証するものではありません。
---

## ライセンス（License）
本プロジェクト **LH Language（負け言語）** は  
**MIT License** のもとで公開されています。

### MIT License
MIT License

Copyright (c) 2026 LH Language Project

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

## 非公式・二次創作に関する免責（Unofficial Disclaimer）
- 本プロジェクトは **公式作品・公式関係者とは一切関係のない非公式二次創作**です
- 原作・登場人物・作品名に関する著作権・商標権は、すべて各権利者に帰属します
- 本プロジェクトは、技術的・学術的・娯楽的目的で制作されています
---

## 表現内容に関する注意（Content Disclaimer）
- 本ツールは **任意のテキストをエンコード／デコード可能**な汎用言語処理系です
- 利用者が入力・生成するコードおよび出力内容について、開発者は責任を負いません
- 公序良俗・法令に反する内容、差別的・攻撃的表現の生成・利用は推奨されません
⚠️ **本ツールを用いて生成された内容の最終的な責任は、すべて利用者に帰属します**
---

## 安全設計に関する方針
- 本プロジェクトは以下を目的としていません
  - 不適切表現の生成支援
  - 有害コンテンツの拡散
- UI 上では注意喚起を表示しますが、  
  **内容の自動検閲・制限は行いません**
---

## 利用に関する免責（General Disclaimer）
- 本ソフトウェアは **「現状のまま（AS IS）」提供**されます
- 動作保証・正確性・特定目的への適合性は保証されません
- 本ツールの使用により生じたいかなる損害についても、  
  作者および貢献者は責任を負いません
---

## 派生・再配布について
- MIT License に基づき、以下を許可します
  - 改変
  - 再配布
  - 派生プロジェクトの作成
- ただし、以下を遵守してください
  - ライセンス表記の保持
  - 非公式である旨の明示（推奨）
---

## 最後に
LH Language は  
**「難解言語 × 可視化 × 遊び心」**を目的とした実験的プロジェクトです 
節度をもって楽しく利用をお願いします


