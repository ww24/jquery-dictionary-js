/*
 *    jquery.dictionary.js用辞書ファイルジェネレーター
 *	辞書ファイルは、
 *	1行目にタイトル
 *	2行目に関係する項目リンク(,カンマ区切り)
 *	3行目以降に内容を書いて
 *	ファイル名を検索ワードにして拡張子は.htmlにします
 *	Firefox, Chrome, Opera(D&D未対応)で動作確認済み
 */
$(function () {
	var $dnd = $("#draganddrop"),
		$list,
		dic = {};
	var length = function () {
		var i = 0;
		for (var key in this) {
			if (this.hasOwnProperty(key)) {
				i++;
			}
		}
		return i;
	};
	var addFiles = function (files) {
		if (files) {
			for (var i=0,l=files.length; i<l; i++) {
				(function (i) {
					var file = files[i],
						name = file.name.split(".").slice(0, this.length-1).join(""),
						fr = new FileReader();
					if (file.type == "text/html") {
						fr.onload = function () {
							if ($dnd.find("ul").length === 0) {
								$list = $dnd.css("padding", "5px").append('<ul/><div id="generate">辞書生成 (<span></span> words)</div>').find("ul");
							}
							if (! dic[name]) {
								var text = this.result.split("\r\n").join("\n"),
									index,
									newline = function (data) {
										index = data.indexOf("\n");
										if (index < 0) {
											index = data.indexOf("\r");
										}
									};
								if (index < 0) {
									alert("フォーマットが間違っています");
								} else {
									newline(text);
									var title = text.slice(0, index);
									text = text.slice(index+1);
									newline(text);
									dic[name] = {
										title: title,
										link: text.slice(0, index).split(","),
										content: text.slice(index+1)
									};
									$list.append('<li><span class="del">Delete</span>-<span>'+name+'</span></li>')
										.find("li").eq(i).data("name", name);
									$("#generate span").text(length.call(dic));
								}
							} else {
								alert(name + "が重複しています");
							}
						};
						fr.readAsText(file);
					}
				})(i);
			}
		}
	};
	
	$("#files").bind("change", function () {
		addFiles(this.files);
		return false;
	});
	$dnd.bind("drop", function (e) {
		addFiles(e.originalEvent.dataTransfer.files);
		return false;
	}).bind("dragenter", function () {
		return false;
	}).bind("dragover", function () {
		return false;
	}).delegate("li span.del", "click", function () {
		var $target = $(this).parent();
		if (delete dic[$target.data("name")]) {
			$target.remove();
		}
		var words = length.call(dic);
		if (words < 1) {
			$dnd.css("padding", "130px 5px").find("ul, div").remove();
		} else {
			$("#generate span").text(words);
		}
	}).delegate("#generate", "click", function () {
		location.href = "data:application/octet-stream," + encodeURIComponent(JSON.stringify(dic));
	});
});