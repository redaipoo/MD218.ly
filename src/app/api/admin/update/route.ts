import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password, data } = body;

    // Simple password protection
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "md218lyadmin";
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "كلمة المرور غير صحيحة" }, { status: 401 });
    }

    if (!data) {
      return NextResponse.json({ error: "البيانات مفقودة" }, { status: 400 });
    }

    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    if (!GITHUB_TOKEN) {
      // If we are on local and no github token is provided, just write locally
      if (process.env.NODE_ENV === 'development') {
        const fs = await import('fs');
        const path = await import('path');
        const filePath = path.join(process.cwd(), 'src', 'data', 'categories.json');
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        return NextResponse.json({ success: true, message: "تم الحفظ محلياً بنجاح (بيئة التطوير)" });
      }
      return NextResponse.json({ error: "لم يتم تكوين GITHUB_TOKEN في إعدادات الاستضافة" }, { status: 500 });
    }

    // GitHub API Settings
    const owner = "redaipoo";
    const repo = "MD.LY";
    const filePath = "src/data/categories.json";
    const branch = "main";

    // 1. Get the current file's SHA (needed to update it)
    const getRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json"
      }
    });

    let sha = undefined;
    if (getRes.ok) {
      const getJson = await getRes.json();
      sha = getJson.sha;
    }

    // 2. Encode the new content to Base64
    const content = Buffer.from(JSON.stringify(data, null, 2)).toString('base64');

    // 3. Update the file
    const updateRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: "Admin Panel: Update categories and prices",
        content: content,
        sha: sha,
        branch: branch
      })
    });

    if (!updateRes.ok) {
      const errText = await updateRes.text();
      console.error("GitHub API Error:", errText);
      return NextResponse.json({ error: "حدث خطأ أثناء الاتصال بقيت هب. تأكد من الرمز." }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "تم الحفظ بنجاح! سيتم تحديث الموقع خلال دقيقة." });

  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json({ error: "حدث خطأ غير متوقع" }, { status: 500 });
  }
}
