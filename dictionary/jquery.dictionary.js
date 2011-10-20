/*
 *	jquery.dictionary.js
 *	簡易辞書プラグイン
 *	Version		: 1.0.4
 *	Copyright	: ww24
 *	License		: MIT License
 */
(function($){
	// 辞書データオブジェクト
	var dic = {};
	// テキストボックスの値
	var textbox = "";
	// hasOwnProperty
	var hasOwn = Object.prototype.hasOwnProperty;
	
	$.fn.dictionary = function(settings) {
// #要素追加
		// インターフェース書き出し
		$(this).append(
			'<div id="dicBox">'+
				'<div id="dicSearch">'+
					'<form id="dicForm">'+
						'<input id="dicText" type="text" autocomplete="off" />'+
						'<input id="dicButton" type="submit" value="検索" />'+
					'</form>'+
					'<span id="dicResult">テキストボックスに検索したい文字を入力してください。</span>'+
				'</div>'+
				'<div id="dicResponse"></dd>'+
			'</div>'
		);
		
// #関数定義
		// 重複しない文字列置換操作
		var strReplace = function(str, from, to, count) {
			// 配列かチェック
			var isArray = function(a) {
				return typeof(a)=="object" && (a instanceof Array);
			};
			
			// String→Array
			var toArray = function(a) {
				return isArray(a) ? a : [a];
			};
			from = toArray(from);
			to = toArray(to);
			
			// Array(from+to) table[0]->from, table[1]->to
			var table = [];
			for (var i=0,l=from.length; i<l; i++) {
				table[i] = [from[i], (typeof(to[i])=="undefined")?"":String(to[i])];
			}
			
			// from length sort
			table.sort(function(a, b) {
				return b[0].length - a[0].length;
			});
			
			// 文字列を設定して、複数の単語で分割し、別の単語で置換する
			
			// 配列を走査して文字列をsplitする
			var depth = [];
			var strSp = function(str, word, c, d) {
				var arr = [];
				if (isArray(str) && str.length) {
					d++;
					for (var i=0,l=str.length; i<l; i++) {
						arr[i] = arguments.callee(str[i], word, c, d);
					}
				} else {
					arr = str.split(word);
				}
				depth[c].push(d + 1);
				return arr;
			};
			
			// 上の逆
			var strJo = function(arr, word, d) {
				if (d > 1) {
					d--;
					var str = [];
					for (var i=0,l=arr.length; i<l; i++) {
						str[i] = arguments.callee(arr[i], word, d);
					}
					return str;
				}
				return arr.join(word);
			};
			
			// 実行
			var len = table.length;
			for (i=0,l=len; i<l; i++) {
				depth[i] = [];
				str = strSp(str, table[i][0], i, 0);
				depth[i] = Math.max.apply(null, depth[i]);
			}
			for (i=len-1; i>=0; i--) {
				str = strJo(str, table[i][1], depth[i]);
			}
			return str;
		};
		
		// 検索結果-リスト表示
		var resList = function(keyword) {
			// 前回と同じ文字列か判定
			if (keyword != textbox) {
				// 今回の検索テキストを保持
				textbox = keyword;
				// カウンタ
				var count = 0;
				// レスポンス+リストタグ挿入
				var res = [];
				
				// 空文字判定
				if (keyword !== "") {
					// リストタグ挿入
					res.push('<ul>');
					// マッチング-正規表現
					regexp = new RegExp("");
					regexp.compile(keyword, "i");
					for (var key in dic) {
						if (hasOwn.call(dic, key)) {
							// 部分一致
							var str = key.match(regexp);
							if (str) {
								count++;
								// 一致した文字列を太文字に
								key = key.replace(RegExp(str, "i"), '<b>'+str+'</b>');
								res.push('<li>'+key+'</li>');
							}
						}
					}
					// 1つもマッチしなかった場合
					if (!count) {
						$("#dicResult").html('「'+keyword+'」は見つかりません。');
					} else {
						$("#dicResult").html('検索結果：「'+keyword+'」について'+count+'個見つかりました。');
					}
					// リストタグ挿入
					res.push('</ul>');
				} else {
					$("#dicResult").html('テキストボックスに検索したい文字を入力してください。');
				}
				
				// 書き出し
				$("#dicResponse").html(res.join(""));
			}
		};
		
		// 検索結果-詳細表示
		var search = function(keyword) {
			if (keyword in dic) {
				//検索結果:ヒット
				var linkTag = [];
				// 関連する項目タグ
				if (dic[keyword].link[0] !== "") {
					linkTag.push('<hr /><p><b>関連する項目：</b>');
					for (var i in dic[keyword].link) {
						if (hasOwn.call(dic[keyword].link, i)) {
							linkTag.push('<a href="#" class="dicTag">'+dic[keyword].link[i]+'</a>　');
						}
					}
					linkTag.push('</p>');
				}
				var res = '<dl class="dicRes"><dt>'+dic[keyword].title+'</dt><dd>'+dic[keyword].content + linkTag.join("")+'<dd></dl>';
				$("#dicResponse").html(res);
				if (settings.popup) {
					// ポップアップに表示されるリンクからリンクとしての要素を排除(クリック出来ないため)
					$("#popup").html(res).find("a").attr("onclick", "return false")
						.css("text-decoration", "none").css("color", "#666666").css("cursor", "auto");
				}
				
				// 初期化
				textbox = keyword;
				$("#dicResult").html("");
			} else {
				// 検索失敗→サジェスト関数へ引渡し
				resList(keyword);
			}
		};
		
		// 用語リンク用Index配列
		var index = new function() {
			var set = true,
				t = this;
			this.term = [[],[]];
			this.set = function() {
				if (set) {
					for (var key in dic) {
						if (hasOwn.call(dic, key)) {
							t.term[0].push(key);
							t.term[1].push('<a href="#" class="dicTerm">'+key+'</a>');
						}
					}
					set = false;
				}
			};
		}();
		
		// 用語リンク追加
		var term = function($target) {
			// Index set
			index.set();
			// コンテンツ取得
			var content = $target.html();
			// 置き換え-重複しない文字列置換
			content = strReplace(content, index.term[0], index.term[1]);
			$target.html(content);
		};
		
		// 辞書データロード
		$.ajax({
			type		: "GET",
			url			: settings.path,
			dataType	: "json",
			success		: function(data) {
				dic = data;
				
// #トリガ設置、関数実行
				// 用語トリガ追加
				if (settings.target) {
					term($(settings.target));
					// Ajaxでコンテンツが更新された場合のイベント追加
					if (settings.ajax) {
						$(settings.target).bind("load", function(){
							term($(this));
						});
					}
				
					// ポップアップ
					if (settings.popup) {
						// 要素書き出し
						$("body").append('<div id="popup"></div>');
						var distance = 10,
							time = 250,
							topOrBottom = true,
							$pop = $("#popup").css("opacity", 0);
						
						$(settings.target).delegate(".dicTerm", "mouseover", function(){
							// 検索実行
							search($(this).text());
							
							// Windowsの位置取得
							var $win = $(window),
								win = {
									width: $win.width(),
									scrollTop: $win.scrollTop(),
									scrollLeft: $win.scrollLeft()
								};
							
							// trigger要素の座標取得
							var $trigger = $(this),
								offset = $trigger.offset(),
								trig = {
									width: $trigger.width(),
									height: $trigger.height()
								};
							
							// popup要素の座標取得
							var pop = {};
							pop.height = $pop.outerHeight();
							pop.width = $pop.outerWidth();
							
							// 上に表示するか下に表示するか
							topOrBottom = offset.top - win.scrollTop > pop.height + distance + 10;
							
							// 左右に必要な領域
							var trigPopOffset = (pop.width - trig.width) / 2,
							// 左領域の足りない長さ
								trigLeft = trigPopOffset - (offset.left - win.scrollLeft),
							// 右領域の足りない長さ
								trigRight = trigPopOffset - (win.width + win.scrollLeft - offset.left - trig.width);
							// 0以下の場合は0に繰り上げ
							trigLeft = (trigLeft > 0) ? trigLeft : 0;
							trigRight = (trigRight > 0) ? trigRight : 0;
							// ポップアップの左右微調整
							var trigLR =  trigLeft - trigRight;
							
							// popupを表示する座標を計算(基本的に単語の上で、上に表示できる領域がない場合は下)
							var i_top = 0;
							if (topOrBottom) {
								// 要素の上
								i_top = offset.top - pop.height - 15;
							} else {
								// 要素の下
								i_top = offset.top + trig.height + 5;
							}
							// 要素の横幅の中央(もしくは、表示できる領域まで移動)
							var i_left = offset.left + trig.width/2 - pop.width/2 + trigLR;
							
							// 表示するアニメーション
							$pop.stop().css({
								top: i_top,
								left: i_left,
                                display: "block"
							}).animate({
								top: (topOrBottom ? "-" : "+") + "=" + distance + "px",
								opacity: 1
							}, time, "swing");
						}).delegate(".dicTerm", "mouseout", function(){
							// 消えるアニメーション
							$pop.stop().animate({
								top: (topOrBottom ? "-" : "+") + "=" + distance + "px",
								opacity: 0
							}, time, "swing", function () {
								$(this).css({display:"none"});
							});
						});
					}
					
					// 用語トリガ・タグトリガ・検索トリガ
					$(settings.target).delegate(".dicTerm", "click", function(){
						search($(this).text());
						// トリガーの実行
						if (settings.click) {
							settings.click();
						}
						// 検索ボックス初期化
						$("#dicText").val("");
						return false;
					});
				}
				
				$("#dicResponse").delegate(".dicTag", "click", function(){
					search($(this).text());
					// 検索ボックス初期化
					$("#dicText").val("");
					return false;
				});
				$("#dicResponse").delegate("li", "click", function(){
					search($(this).text());
					// 検索ボックス初期化
					$("#dicText").val("");
				});
				$("#dicForm").submit(function(){
					search($("#dicText").val());
					return false;
				});
				
				// サジェスト
				if (settings.autocomplete) {
					$("#dicText").keyup(function(){
						resList($(this).val());
					});
				}
			},
			error		: function() {
				alert("辞書データを読み込み中にエラーが発生しました。");
			}
		});
		
		return this;
	};
})(jQuery);