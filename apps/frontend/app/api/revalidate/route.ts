import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

/**
 * microCMS Webhook用 On-Demand Revalidation API
 * 
 * microCMS側の設定:
 * 1. microCMS管理画面 → API設定 → Webhook
 * 2. URL: https://your-domain.com/api/revalidate
 * 3. Secret: 環境変数 REVALIDATE_SECRET と同じ値を設定
 * 4. トリガー: 「コンテンツの公開」「コンテンツの更新」「コンテンツの削除」
 * 
 * セキュリティ:
 * - Secretトークンで認証
 * - microCMSからのリクエストのみ受け付け
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Secretトークンの検証
    const secret = request.nextUrl.searchParams.get("secret");
    const expectedSecret = process.env.REVALIDATE_SECRET;

    if (!expectedSecret) {
      console.error("❌ REVALIDATE_SECRET が設定されていません");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    if (secret !== expectedSecret) {
      console.error("❌ 無効なSecretトークン");
      return NextResponse.json(
        { error: "Invalid secret" },
        { status: 401 }
      );
    }

    // 2. microCMSからのペイロード解析
    const body = await request.json();
    console.log("📨 Webhook受信:", body);

    const { api, id, type } = body;

    // 3. 更新されたコンテンツに応じてキャッシュをクリア
    if (api === "blogs") {
      // ブログ記事が更新された場合
      console.log(`🔄 ブログキャッシュをクリア: ${id}`);
      
      // トップページとブログ一覧ページ
      revalidatePath("/[lang]", "page");
      revalidatePath("/[lang]/blog", "page");
      
      // 詳細ページ（日本語・英語両方）
      const baseId = id.replace(/-en$/, "");
      revalidatePath(`/ja/blog/${baseId}`, "page");
      revalidatePath(`/en/blog/${baseId}`, "page");
      
    } else if (api === "book") {
      // Book記事が更新された場合
      console.log(`🔄 Bookキャッシュをクリア: ${id}`);
      
      revalidatePath("/[lang]", "page");
      revalidatePath("/[lang]/book", "page");
      
      const baseId = id.replace(/-en$/, "");
      revalidatePath(`/ja/book/${baseId}`, "page");
      revalidatePath(`/en/book/${baseId}`, "page");
      
    } else if (api === "topics") {
      // トピックが更新された場合
      console.log(`🔄 トピックキャッシュをクリア: ${id}`);
      
      // トピックはすべてのページに影響
      revalidatePath("/[lang]", "page");
      revalidatePath("/[lang]/blog", "page");
      revalidatePath("/[lang]/book", "page");
    }

    // 4. サイトマップも更新
    revalidatePath("/sitemap.xml");

    console.log(`✅ キャッシュクリア完了: ${api} (${type})`);

    return NextResponse.json({
      revalidated: true,
      api,
      id,
      type,
      now: Date.now(),
    });
  } catch (error) {
    console.error("❌ Revalidation エラー:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * 手動でキャッシュクリアする場合（開発用）
 * GET /api/revalidate?secret=YOUR_SECRET&path=/ja
 */
export async function GET(request: NextRequest) {
  try {
    const secret = request.nextUrl.searchParams.get("secret");
    const path = request.nextUrl.searchParams.get("path") || "/";

    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
    }

    revalidatePath(path);

    return NextResponse.json({
      revalidated: true,
      path,
      now: Date.now(),
    });
  } catch (error) {
    console.error("❌ Revalidation エラー:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
