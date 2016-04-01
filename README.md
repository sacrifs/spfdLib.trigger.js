# spfdLib.trigger.js

## 概要

フレームごとにしたい処理やリサイズ時の処理をまとめて管理する。
addTimer等で追加した処理は単一のrequestAnimationFrameで管理される。

## 使い方

```
//タイマー処理を追加
spfdLib.trigger.addTimer(function(){});

//スプライトシートなどの場合
spfdLib.trigger.addTimer({fps:30, frame:300, func:function(f){
	// f : 現在のフレームカウント
}});

//リサイズ処理を追加
spfdLib.trigger.addResize(function(){});
```

## ライセンス

MIT License
