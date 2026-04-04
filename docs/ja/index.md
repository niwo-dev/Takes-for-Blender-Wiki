---
icon: material/home
title: Home
hide:
  - navigation
  - toc
  - title
---

<div class="grid cards" markdown>

-   :material-rocket-launch:{ .lg .middle } **スタートガイド (Getting Started)**

    ---

    わずか5分でアドオンのインストールと基本事項を学びます。

    [:octicons-arrow-right-24: インストール](getting_started/installation.md)

-   :material-view-dashboard:{ .lg .middle } **インターフェースガイド (Interface Guide)**

    ---

    全てのパネル、ボタン、およびコントロールの視覚的なマップです。

    [:octicons-arrow-right-24: インターフェース](interface/index.md)

-   :material-layers-triple:{ .lg .middle } **主要機能 (Features)**

    ---

    Takes、カスケード、バリアント、バッチレンダリングなどについて深く掘り下げます。

    [:octicons-arrow-right-24: 主要機能](features/index.md)

-   :material-play-circle:{ .lg .middle } **ワークフロー (Workflows)**

    ---

    実際の制作シナリオに即したステップバイステップのチュートリアルです。

    [:octicons-arrow-right-24: ワークフロー](workflows/index.md)

</div>

## 主な機能

| 機能 | 説明 |
|---------|-------------|
| **Takes Tree** | 統合された階層管理：Scene Groups → Scenes → VL Groups → View Layers → Versions。 |
| **6層カスケード (6-Tier Cascade)** | カメラ、ワールド、アクションなどをグローバルからバージョンレベルまでオーバーライド（上書き）解決するシステム。 |
| **バリアントスイッチ (Variant Switch)** | 個別スコープの素材置換、プリセット注入、プール管理を備えた製品バリアント（派生状態）システム。 |
| **レストステート (Rest State)** | アクションやアニメーションをまたいでも汚染されていない本来のデフォルトキーフレームを保持する、自動ミラーリングでの基準アクションシステム。 |
| **バッチレンダリング (Batch Render)** | ファイル命名のためのスマート出力 (Smart Output) トークンシステムを備えたモーダルレンダリングエンジン (フォアグラウンドまたはバックグラウンド)。 |
| **レンダープリセット (Render Presets)** | プレビューからレンダー、カメラ、ワールド、およびファイル出力設定用の JSON ベースの軽量プリセット。これらをビューレイヤーごとに適用可能。 |
| **インラインプレビュー (Inline Previews)** | ツリー内の各ビューレイヤーの横に、リアルタイムのビューポートサムネイルを表示。 |

!!! tip "Blender のバージョンについて"
    Takes for Blender は **Blender 5.1** 以降を要件としています。これは、Blender 5.0 で導入された「スロットアクション (Slotted Action)」システムを利用しているためです。

---

*Created by Nikolaj Woroschilow*
