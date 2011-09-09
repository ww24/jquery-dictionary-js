jquery.dictionary.js
===
簡易辞書プラグイン

Version    	: 1.0.4  
Copyright	: ww24  
Link		: [Website](http://dev.ww24.jp/javascript/jquery-dictionary-js/)  
License		: [MIT License](http://www.opensource.org/licenses/mit-license.php)  


## 概要 - Outline
サイトに簡易的な辞書機能付加するjQueryプラグイン
* 検索(文字列の部分一致)
* 検索結果のリスト表示
* コンテンツに自動リンク挿入(Ajax対応)
* リンククリック時に呼び出される関数を設定することでLightBoxによる表示も可能
* HTML5で辞書データを生成


## 使い方 - Usage

### 設置方法

	$("#dic").dictionary({
		// 辞書ファイルまでのパス
		path: "dictionary.json",
		// [option]テキスト中の検索ワードにリンクを張る(セレクタ or false)
		autocomplete: true,
		// [option]コンテンツが非同期で更新されたときに自動でリンクを張る(true or false)
		target: "#target-content",
		// [option]オートコンプリートを使う(true or false)
		ajax: true,
		// [option]ポップアップを有効化(true or false)
		popup: true,
		// クリックされた時のコールバック関数を設定(function or false)
		click: function(){}
	});

**[option]はデフォルトで全て無効**


### 辞書ファイルの生成方法

テキストファイルの
- 1行目にタイトル
- 2行目に関連する項目(カンマ[,]区切り)
- 3行目以降には内容(HTMLタグが使えます)

を記述し`検索ワード.html`というファイル名で保存します。
テキストファイルのフォーマットについてはdictionary_dataディレクトリに内を参考にして下さい。

上記のフォーマットで作成したHTMLファイルを
[Website](http://dev.ww24.jp/javascript/jquery-dictionary-js/)でJSONに変換します。


## 更新履歴 - History

### v1.0.4: 2011/09/09
- コードの管理をgistからgithubへ変更
- bugfix(ポップアップが`display:none`されていない問題の修正)
- リファレンス追記

### v1.0.3: 2011/09/04
- 関連する項目のフォーマットを若干変更("null"→""に変更)
- 仕様変更により、v1.0.2以前の辞書データとの互換性がありません
- HTML5で辞書データが生成できるようになりました

### v1.0.2: 2011/08/28
- StyleSheet修正
- 重大なバグ修正(Operaで正常に表示されるようになりました)
- W3C XHTML1.1 CSS3 準拠

### v1.0.1: 2011/08/26
- 検索時のレスポンス改善
- ZIPで配布

### v1.0.0: 2011/08/25
- 文字列置換を改善(コンテンツへの自動リンク挿入)
- ツールチップ機能追加(角丸はCSS3)
- ソースをGistで管理することに

### Beta(0.9.9):
- bugfix
- 検索結果表示後のテキストボックス初期化
- `$().live`を`$().delegate`に変更
- jQuery1.4.2以降サポート
- 自動リンクを設置するイベントを追加
- 自動リンクをクリックされたときに実行するイベントを追加

### Beta(0.9.0): 初リリース
*基本的な機能*

- 検索
- 検索結果表示
- 自動リンク設置